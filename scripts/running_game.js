import { makeRandomSelection } from "./array_utilities.js";
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

    constructor(onGameOver, easyLevels, hardLevels)
    {
        super(new Vector2(0, 0), "RunningGame");
        this.easyLevelSequence = makeRandomSelection(easyLevels, RunningGame.maxNumEasyLevels);
        this.hardLevelSequence = makeRandomSelection(hardLevels, RunningGame.maxNumHardLevels);
        console.log(this.hardLevelSequence);
        this.points = 0;
        this.numEasyLevels = 0;
        this.numHardLevels = 0;
        this.onGameOver = onGameOver;
        this.levelTimeMs = 0;
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

    draw(drawingContext) { }

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
        }
        this.levelTimeMs = 0;
    }
}