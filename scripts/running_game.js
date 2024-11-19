export class RunningGame
{
    static maxNumCompletedLevels = 9;
    static maxNumPoints = 900;
    static maxNumPointsPerLevel = Math.floor(RunningGame.maxNumPoints / RunningGame.maxNumCompletedLevels);

    constructor(onCompleted)
    {
        this.numPoints = 0;
        this.numCompletedLevels = 0;
        this.onCompleted = onCompleted;
    }

    completeLevel(answerCorrect)
    {
        if (this.numCompletedLevels < RunningGame.maxNumCompletedLevels) {
            this.numCompletedLevels++;
            if (answerCorrect) {
                this.numPoints += RunningGame.maxNumPointsPerLevel;
            }
            if (this.numCompletedLevels == RunningGame.maxNumCompletedLevels) {
                this.onCompleted(this.numPoints);
            }
        } else {
            console.warn("Warning: Invalid number of levels completed");
        }
    }
}