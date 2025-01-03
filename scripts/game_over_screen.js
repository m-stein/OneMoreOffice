import { GameObject } from "./game_object.js"
import { Vector2 } from "./vector_2.js";

export class GameOverScreen extends GameObject
{
    constructor(rect)
    {
        super(rect.position, "Menu");
        this.rect = rect;
        this.enabled = false;
        this.textPosition = new Vector2(rect.width / 2, 130);
    }

    enable(points)
    {
        this.enabled = true;
        this.points = points;
    }
    
    disable() { this.enabled = false; }

    update(deltaTimeMs)
    {
        if (!this.enabled) {
            return;
        }
        this.updateChildren(deltaTimeMs);
    }

    draw(drawingContext)
    {
        if (!this.enabled) {
            return;
        }
        let ctx = drawingContext.canvasContext;
        ctx.fillStyle = "black";
        const alpha = ctx.globalAlpha;
        ctx.globalAlpha = 0.6;
        ctx.fillRect(0, 0, this.rect.width, this.rect.height);
        ctx.fillStyle = "white";
        ctx.globalAlpha = alpha;
        drawingContext.drawText("You scored " + this.points + " points!", this.textPosition, 32, "center");
        this.drawChildren(drawingContext);
    }
}