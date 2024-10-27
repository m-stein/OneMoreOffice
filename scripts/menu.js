import { GameObject } from "./game_object.js"
import { Vector2 } from "./vector_2.js";

export class Menu extends GameObject
{
    constructor(position)
    {
        super(position, "Menu");
        this.enabled = true;
    }

    update() { }

    draw(drawingContext)
    {
        let ctx = drawingContext.canvasContext;
        ctx.fillStyle = "black";
        ctx.globalAlpha = 0.6;
        ctx.fillRect(0, 0, drawingContext.canvas.width, drawingContext.canvas.height);
        ctx.fillStyle = "white";
        ctx.globalAlpha = 1;
        const position = new Vector2(drawingContext.canvas.width / 2, 60);
        drawingContext.drawText("ONE MORE OFFICE!", position, 32, "center");
        position.y += 60;
        ctx.globalAlpha = 0.7;
        drawingContext.drawText("NEW GAME", position, 16, "center");
        position.y += 35;
        drawingContext.drawText("HIGHSCORE", position, 16, "center");
        position.y += 35;
        drawingContext.drawText("CREDITS", position, 16, "center");
        ctx.globalAlpha = 1;
    }
}