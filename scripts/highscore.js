import { GameObject } from "./game_object.js";
import { Vector2 } from "./vector_2.js";

export class Highscore extends GameObject
{
    static numEntries = 5;
    static rankSuffix = ["", "st", "nd", "rd", "th", "th"];

    constructor(rect, fontStyles)
    {
        super(rect.position, "Highscore");
        this.rect = rect;
        this.fontStyles = fontStyles;
        this.titlePosition = new Vector2(Math.floor(this.rect.width / 2), 80);
        this.entriesX = Math.floor(this.rect.width / 2) - 55;
    }
    
    update(deltaTimeMs)
    {
        if (!this.enabled) {
            return;
        }
        this.updateChildren(deltaTimeMs)
    }

    disable()
    {
        this.enabled = false;
    }

    enable(entries)
    {
        this.enabled = true;
        this.entries = entries;
    }

    drawRow(columns, y, drawingContext, fontStyle)
    {
        const position = new Vector2(this.entriesX, y);
        drawingContext.canvasContext.globalAlpha = fontStyle.alpha;
        drawingContext.drawText(columns[0], position, fontStyle.size, "right");
        position.x += 65;
        drawingContext.drawText(columns[1], position, fontStyle.size, "right");
        position.x += 35;
        drawingContext.drawText(columns[2], position, fontStyle.size, "left");
        return y + 25;
    }

    draw(drawingContext)
    {
        if (!this.enabled) {
            return;
        }
        this.drawChildren(drawingContext);

        /* Draw screen background */
        let ctx = drawingContext.canvasContext;
        ctx.fillStyle = "black";
        const alpha = ctx.globalAlpha;
        ctx.globalAlpha = 0.6;
        ctx.fillRect(0, 0, this.rect.width, this.rect.height);

        /* Draw screen title */
        ctx.fillStyle = "white";
        const titleStyle = this.fontStyles.h1;
        ctx.globalAlpha = titleStyle.alpha;
        drawingContext.drawText("HIGHSCORE", this.titlePosition, titleStyle.size, "center");

        /* Draw names of the columns of the highscore table */
        let y = this.titlePosition.y + 50;
        y = this.drawRow(["Rank", "Score", "Name"], y, drawingContext, this.fontStyles.h3);

        /* Draw content of the highscore table */
        let score, userName, rank = 0;
        for (let idx = 0; idx < Highscore.numEntries; idx++) {
            if (this.entries.length > idx) {
                rank = this.entries[idx].rank;
                score = this.entries[idx].score;
                userName = this.entries[idx].userName;
            } else {
                rank++;
                score = "- - -";
                userName = "- - -";
            }
            y = this.drawRow([rank + Highscore.rankSuffix[rank], score, userName], y, drawingContext, this.fontStyles.normal);
        }
        ctx.globalAlpha = alpha;
    }
}