import { GameObject } from "./game_object.js";
import { LinearMovement } from "./linear_movement.js";
import { Vector2 } from "./vector_2.js";

export class Credits extends GameObject
{
    constructor(rect)
    {
        super(rect.position, "Credits");
        this.rect = rect;
        this.text = [
            "Hallo Welt!",
            "Das sind die Credits!",
            "Und noch eine Zeile.",
        ];
        this.disable();
    }
    
    update(deltaTimeMs)
    {
        if (!this.enabled) {
            return;
        }
        this.textMovement.update(deltaTimeMs);
    }

    disable()
    {
        this.enabled = false;
        this.textMovement = new LinearMovement(new Vector2(this.rect.width / 2, this.rect.height));
    }

    enable()
    {
        this.enabled = true;
        this.textMovement.startMovingTowards(new Vector2(this.rect.width / 2, -100), 0.00005);
    }

    draw(drawingContext)
    {
        if (!this.enabled) {
            return;
        }
        let ctx = drawingContext.canvasContext;
        ctx.fillStyle = "black";
        ctx.globalAlpha = 0.6;
        ctx.fillRect(0, 0, this.rect.width, this.rect.height);
        ctx.fillStyle = "white";
        ctx.globalAlpha = 1;
        let lineIdx = 0;
        const fontSize = 18;
        const lineHeight = fontSize + 4;
        this.text.forEach((line) => {
            console.log(lineIdx);
            drawingContext.drawText(line, new Vector2(this.textMovement.at.x, this.textMovement.at.y + lineIdx * lineHeight), fontSize, "center");
            lineIdx++;
        });
    }
}