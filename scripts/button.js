import { GameObject } from "./game_object.js";

export class Button extends GameObject
{
    constructor(rect, label, mousePosition)
    {
        super(rect.position, label);
        this.rect = rect;
        this.mousePosition = mousePosition;
    }
    
    update(deltaTimeMs) { }

    draw(drawingContext)
    {
        const hover = this.rect.isInside(this.mousePosition);
        let ctx = drawingContext.canvasContext;
        ctx.fillStyle = "white";
        ctx.globalAlpha = hover ? 1 : 0.6;
        ctx.textBaseline = 'middle';
        drawingContext.drawText(this.label, this.rect.center, 16, "center");
    }
}