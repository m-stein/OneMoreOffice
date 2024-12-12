import { makeRandomSelection } from "./array_utilities.js";
import { FloorIndicator } from "./floor_indicator.js";
import { GameObject } from "./game_object.js";
import { Vector2 } from "./vector_2.js";

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

    constructor(onPlayerScoreChanged, onGameOver, easyLevels, hardLevels, images, canvasRect)
    {
        super(new Vector2(0, 0), "RunningGame");
        this.easyLevelSequence = makeRandomSelection(easyLevels, RunningGame.maxNumEasyLevels);
        this.hardLevelSequence = makeRandomSelection(hardLevels, RunningGame.maxNumHardLevels);
        this.points = 0;
        this.numEasyLevels = 0;
        this.numHardLevels = 0;
        this.onGameOver = onGameOver;
        this.onPlayerScoreChanged = onPlayerScoreChanged;
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
            this.onPlayerScoreChanged(this.points);
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