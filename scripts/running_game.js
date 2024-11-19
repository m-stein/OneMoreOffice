export class RunningGame
{
    static maxNumLevels = 9;
    static maxNumPoints = 900;
    static maxNumPointsPerLevel = Math.floor(RunningGame.maxNumPoints / RunningGame.maxNumLevels);

    constructor(onGameOver)
    {
        this.numPoints = 0;
        this.numLevels = 0;
        this.onGameOver = onGameOver;
    }

    obtainPoints(answerCorrect)
    {
        if (answerCorrect) {
            this.numPoints += RunningGame.maxNumPointsPerLevel;
            return RunningGame.maxNumPointsPerLevel;
        }
        return 0;
    }

    endLevel()
    {
        this.numLevels++;
        if (this.numLevels == RunningGame.maxNumLevels) {
            this.onGameOver(this.numPoints);
        }
    }
}