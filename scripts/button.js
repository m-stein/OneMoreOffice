import { GameObject } from "./game_object.js";

export class Button extends GameObject
{
    constructor(rect, label, mousePosition, mouseDownHandlers)
    {
        super(rect.position, label);
        this.rect = rect;
        this.pressedHandlers = [];
        this.mousePosition = mousePosition;
        this.mouseDownHandlers = mouseDownHandlers;
        this.mouseDownHandlers.push(this.onMouseDown);
    }

    destroy() { this.mouseDownHandlers.remove(this.onMouseDown); }

    hovered() { return this.rect.isInside(this.mousePosition); }

    onMouseDown = () =>
    {
        if (!this.hovered()) {
            return;
        }
        this.pressedHandlers.forEach((handler) => { handler(); });
    }
    
    update(deltaTimeMs) { }

    draw(drawingContext)
    {
        let ctx = drawingContext.canvasContext;
        ctx.fillStyle = "white";
        ctx.globalAlpha = this.hovered() ? 1 : 0.6;
        ctx.textBaseline = 'middle';
        drawingContext.drawText(this.label, this.rect.center, 16, "center");
    }
}