import { GameObject } from "./game_object.js";
import { LinearMovement } from "./linear_movement.js";
import { Vector2 } from "./vector_2.js";

export class Credits extends GameObject
{
    constructor(rect, fontStyles, onFinished, text)
    {
        super(rect.position, "Credits");
        this.rect = rect;
        this.fontStyles = fontStyles;
        this.onFinished = onFinished;
        this.text = text.concat(["", "", "", "", "### Thank you for playing!"]);
        this.textHeight = 0;
        this.lineStyles = []
        for (let lineIdx = 0; lineIdx < this.text.length; lineIdx++) {
            let numHashes = 0;
            for (let charIdx = 0; charIdx < this.text[lineIdx].length; charIdx++) {
                if (this.text[lineIdx][charIdx] != '#') {
                    break;
                }
                numHashes++;
            }
            if (numHashes > 0) {
                this.text[lineIdx] = this.text[lineIdx].slice(numHashes).trim();
            }
            switch (numHashes) {
                case 3:
                    this.lineStyles[lineIdx] = this.fontStyles.h1;
                    break;
                case 4:
                    this.lineStyles[lineIdx] = this.fontStyles.h2;
                    break;
                default:
                    this.lineStyles[lineIdx] = this.fontStyles.normal;
                    break;
            }
            this.textHeight +=
                this.lineStyles[lineIdx].topMargin +
                this.lineStyles[lineIdx].lineHeight;
        }
        this.startPosition = new Vector2(
            this.rect.width / 2,
            this.rect.height - this.lineStyles[0].topMargin + this.lineStyles[0].lineHeight / 2);

        this.endPosition = new Vector2(this.startPosition.x, -this.textHeight);
        this.disable();
    }
    
    update(deltaTimeMs)
    {
        if (!this.enabled) {
            return;
        }
        this.textMovement.update(deltaTimeMs);
        if (this.textMovement.arrived) {
            this.onFinished();
        }
    }

    disable()
    {
        this.enabled = false;
        this.textMovement = new LinearMovement(this.startPosition);
    }

    enable()
    {
        this.enabled = true;
        this.textMovement.startMovingTowards(this.endPosition, 0.00003);
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
        let lineY = Math.ceil(this.textMovement.at.y);
        for (let lineIdx = 0; lineIdx < this.text.length; lineIdx++) {

            lineY += this.lineStyles[lineIdx].topMargin;
            ctx.globalAlpha = this.lineStyles[lineIdx].alpha;
            drawingContext.drawText(
                this.text[lineIdx], new Vector2(this.textMovement.at.x, lineY),
                this.lineStyles[lineIdx].size, "center");

            lineY += this.lineStyles[lineIdx].lineHeight;
        }
        ctx.globalAlpha = alpha;
    }
}