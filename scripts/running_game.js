import { makeRandomSelection } from "./array_utilities.js";
import { GameObject } from "./game_object.js";
import { Vector2 } from "./vector_2.js";

export class RunningGame extends GameObject
{
    static maxNumLevels = 8;
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

    constructor(onGameOver, availableLevels)
    {
        super(new Vector2(0, 0), "RunningGame");
        this.levelSequence = makeRandomSelection(availableLevels, RunningGame.maxNumLevels);
        this.points = 0;
        this.numLevels = 0;
        this.onGameOver = onGameOver;
        this.levelTimeMs = 0;
    }

    currentLevelName()
    {
        return this.levelSequence[this.numLevels];
    }

    update(deltaTimeMs)
    {
        this.levelTimeMs += deltaTimeMs;
    }

    draw(drawingContext) { }

    obtainPoints(answerCorrect)
    {
        if (answerCorrect) {
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
        this.numLevels++;
        if (this.numLevels == RunningGame.maxNumLevels) {
            this.onGameOver(this.points);
        }
        this.levelTimeMs = 0;
    }
}