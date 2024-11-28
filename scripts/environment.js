import { createEnum } from "./enum.js";

export class Environment
{
    static Type = createEnum({
        Dummy: 0,
        AdventCalender: 1,
    });

    constructor(type)
    {
        this.type = type;
    }

    endGame(points)
    {
        switch(this.type) {
            case Environment.Type.Dummy:
                console.log("The user scored " + points + " points!");
                break;
            case Environment.Type.AdventCalender:
                logScore(ttac.userHash, ttac.gameId, points);
                logGameEnd(ttac.userHash, ttac.gameId);
                break;
        }
    }
    
    startGame()
    {
        switch(this.type) {
            case Environment.Type.Dummy:
                console.log("The user started a new game!");
                break;
            case Environment.Type.AdventCalender:
                logGameStart(ttac.userHash, ttac.gameId);
                break;
        }
    }
}