import { makeRandomSelection } from "./array_utilities.js";
import { GameObject } from "./game_object.js";
import { ObjectsSpritesheet } from "./objects_spritesheet.js";
import { Vector2 } from "./vector_2.js";

class FloorIndicator extends GameObject
{
    static hardFloorArrowFrame = 44;
    static easyFloorArrowFrame = 45;
    static hardFloorBackFrame = 46;
    static hardFloorFrontFrame = 47;
    static easyFloorFrontFrame = 48;

    constructor(position, images, numEasyFloors, numHardFloors)
    {
        super(position, "FloorIndicator");
        console.log(numEasyFloors, numHardFloors);
        this.floorHeight = 4;
        const hardFloorBack = new ObjectsSpritesheet(images.objects, 46);
        this.addChild(hardFloorBack);
        for (let idx = 0; idx < numHardFloors; idx++) {
            const hardFloorFront = new ObjectsSpritesheet(images.objects, 47);
            hardFloorFront.position = new Vector2(0, idx * this.floorHeight);
            this.addChild(hardFloorFront);
        }
        for (let idx = 0; idx < numEasyFloors; idx++) {
            const easyFloorFront = new ObjectsSpritesheet(images.objects, 48);
            easyFloorFront.position = new Vector2(0, (numHardFloors + idx) * this.floorHeight);
            this.addChild(easyFloorFront);
        }
        this.numEasyFloors = numEasyFloors;
        this.numHardFloors = numHardFloors;
        this.arrow = new ObjectsSpritesheet(images.objects, 45);
        this.addChild(this.arrow);
        this.indicateFloor(0);
    }

    indicateFloor(floorIdx)
    {
        if (floorIdx < this.numEasyFloors) {
            this.arrow.currFrameIndex = 45;
        } else {
            this.arrow.currFrameIndex = 44;
        }
        this.arrow.position.y = (this.numEasyFloors + this.numHardFloors - floorIdx - 1) * this.floorHeight;
    }
    
    update(deltaTimeMs)
    {
        this.updateChildren(deltaTimeMs);
    }

    draw(drawingContext)
    {
        this.drawChildren(drawingContext);
    }
}

export class RunningGame extends GameObject
{
    static maxNumEasyLevels = 3;
    static maxNumHardLevels = 5;
    static maxNumLevels = RunningGame.maxNumEasyLevels + RunningGame.maxNumHardLevels;
    static maxPoints = 1000;
    static percentLosableLevelPoints = 50;
    static minutesTillMaxLevelPointsLost = 10;
    static maxPointsPerLevel = Math.floor(RunningGame.maxPoints / RunningGame.maxNumLevels);

    static maxLevelPointsLost = Math.floor(
        RunningGame.maxPointsPerLevel *
        (RunningGame.percentLosableLevelPoints / 100));

    static msPerLostLevelPoint =
        RunningGame.minutesTillMaxLevelPointsLost * 60 * 1000 /
        RunningGame.maxLevelPointsLost;

    constructor(onGameOver, easyLevels, hardLevels, images, canvasRect)
    {
        super(new Vector2(0, 0), "RunningGame");
        this.easyLevelSequence = makeRandomSelection(easyLevels, RunningGame.maxNumEasyLevels);
        this.hardLevelSequence = makeRandomSelection(hardLevels, RunningGame.maxNumHardLevels);
        this.points = 0;
        this.numEasyLevels = 0;
        this.numHardLevels = 0;
        this.onGameOver = onGameOver;
        this.levelTimeMs = 0;
        const floorIndicatorPadding = 5;
        this.floorIndicator = new FloorIndicator(
            new Vector2(canvasRect.width - 32 - floorIndicatorPadding, floorIndicatorPadding),
            images, RunningGame.maxNumEasyLevels, RunningGame.maxNumHardLevels);

        this.addChild(this.floorIndicator);
    }

    currentLevelName()
    {
        if (this.numEasyLevels < RunningGame.maxNumEasyLevels) {
            return this.easyLevelSequence[this.numEasyLevels];
        }
        if (this.numHardLevels < RunningGame.maxNumHardLevels) {
            return this.hardLevelSequence[this.numHardLevels];
        }
    }

    update(deltaTimeMs)
    {
        this.levelTimeMs += deltaTimeMs;
    }

    draw(drawingContext)
    {
        this.drawChildren(drawingContext);
    }

    obtainPoints(selectedCorrectOffice)
    {
        if (selectedCorrectOffice) {
            let pointsLost = Math.floor(this.levelTimeMs / RunningGame.msPerLostLevelPoint);
            if (pointsLost > RunningGame.maxLevelPointsLost) {
                pointsLost = RunningGame.maxLevelPointsLost;
            }
            let pointsObtained = RunningGame.maxPointsPerLevel - pointsLost;
            this.points += pointsObtained;
            return pointsObtained;
        }
        return 0;
    }

    endLevel()
    {
        if (this.numEasyLevels < RunningGame.maxNumEasyLevels) {
            this.numEasyLevels++;

        } else if (this.numHardLevels < RunningGame.maxNumHardLevels) {
            this.numHardLevels++;
        }
        if (this.numEasyLevels >= RunningGame.maxNumEasyLevels &&
            this.numHardLevels >= RunningGame.maxNumHardLevels)
        {
            this.onGameOver(this.points);
        } else {
            this.floorIndicator.indicateFloor(this.numEasyLevels + this.numHardLevels);
        }
        this.levelTimeMs = 0;
    }
}