import { GameObject } from "./game_object.js";

export class Button extends GameObject
{
    constructor(position, label) { super(position, label); }
    
    update(deltaTimeMs) { }

    draw(drawingContext)
    {
        let ctx = drawingContext.canvasContext;
        ctx.fillStyle = "white";
        ctx.globalAlpha = 0.7;
        drawingContext.drawText(this.label, this.position, 16, "center");
    }
}