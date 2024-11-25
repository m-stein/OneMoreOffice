import { cloneArray, shuffleArray } from "./array_utilities.js";
import { GameObject } from "./game_object.js";
import { randomIntInclusive } from "./math.js";
import { Vector2 } from "./vector_2.js";

export class RunningGame extends GameObject
{
    static maxNumLevels = 9;
    static maxPoints = 900;
    static percentLosableLevelPoints = 50;
    static minutesTillMaxLevelPointsLost = 15;
    static maxPointsPerLevel = Math.floor(RunningGame.maxPoints / RunningGame.maxNumLevels);

    static maxLevelPointsLost = Math.floor(
        RunningGame.maxPointsPerLevel *
        (RunningGame.percentLosableLevelPoints / 100));

    static msPerLostLevelPoint =
        RunningGame.minutesTillMaxLevelPointsLost * 60 * 1000 /
        RunningGame.maxLevelPointsLost;

    constructor(onGameOver, availableLevels)
    {
        super(new Vector2(0, 0), "RunningGame")
        const unusedLevels = cloneArray(availableLevels);
        this.levelSequence = [];
        while (this.levelSequence.length < RunningGame.maxNumLevels) {
            if (unusedLevels.length == 0) {
                console.error("Error: Not enough levels available");
            }
            const randomLevelIdx = randomIntInclusive(0, unusedLevels.length - 1);
            this.levelSequence.push(unusedLevels[randomLevelIdx]);
            unusedLevels.splice(randomLevelIdx, 1);
        }
        console.log(this.levelSequence);
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