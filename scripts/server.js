import { createEnum } from "./enum.js";

export class Server
{
    static Type = createEnum({
        LiveServer: 0,
        AdventCalender: 1,
    });

    constructor(type)
    {
        this.type = type;
    }

    logGameEnd(points)
    {
        switch(this.type) {
            case Server.Type.LiveServer:
                console.log("Server log: The user finished a game with " + points + " points");
                break;
            case Server.Type.AdventCalender:
                logScore(ttac.userHash, ttac.gameId, points);
                logGameEnd(ttac.userHash, ttac.gameId);
                break;
        }
    }
    
    logGameStart()
    {
        switch(this.type) {
            case Server.Type.LiveServer:
                console.log("Server log: The user started a game");
                break;
            case Server.Type.AdventCalender:
                logGameStart(ttac.userHash, ttac.gameId);
                break;
        }
    }
}