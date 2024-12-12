import { GameObject } from "./game_object.js";

export class Button extends GameObject
{
    constructor(rect, label, mousePosition, mouseDownHandlers, mouseEntersButtonAudio)
    {
        super(rect.position, label);
        this.rect = rect;
        this.pressedHandlers = [];
        this.mouseEntersButtonAudio = mouseEntersButtonAudio;
        this.mousePosition = mousePosition;
        this.mouseDownHandlers = mouseDownHandlers;
        this.mouseDownHandlers.push(this.onMouseDown);
        this.wasHovered = this.hovered();
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
    
    update(deltaTimeMs)
    {
        if (this.hovered()) {
            if (!this.wasHovered) {
                this.wasHovered = true;
                this.mouseEntersButtonAudio.play();
            }
        } else {
            if (this.wasHovered) {
                this.wasHovered = false;
            }
        }
    }

    draw(drawingContext)
    {
        let ctx = drawingContext.canvasContext;
        ctx.fillStyle = "white";
        const alpha = ctx.globalAlpha;
        ctx.globalAlpha = this.hovered() ? 1 : 0.6;
        ctx.textBaseline = 'middle';
        drawingContext.drawText(this.label, this.rect.center, 16, "center");
        ctx.globalAlpha = alpha;
    }
}