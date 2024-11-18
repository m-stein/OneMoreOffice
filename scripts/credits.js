import { GameObject } from "./game_object.js";
import { LinearMovement } from "./linear_movement.js";
import { Vector2 } from "./vector_2.js";

class TextConfig
{
    constructor(fontSize, lineHeight, topMargin, alpha)
    {
        this.fontSize = fontSize;
        this.lineHeight = lineHeight;
        this.topMargin = topMargin;
        this.alpha = alpha;
    }
}

export class Credits extends GameObject
{
    static textConfigs = {
        "normal": new TextConfig(14, 16, 0, 0.8),
        "headline2": new TextConfig(18, 20, 32, 1),
        "headline1": new TextConfig(26, 28, 72, 1),
    };

    constructor(rect, onFinished, text)
    {
        super(rect.position, "Credits");
        this.rect = rect;
        this.onFinished = onFinished;
        this.text = text.concat(["", "", "", "", "### Thank you for playing!"]);
        this.textHeight = 0;
        this.lineConfigs = []
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
                    this.lineConfigs[lineIdx] = Credits.textConfigs["headline1"];
                    break;
                case 4:
                    this.lineConfigs[lineIdx] = Credits.textConfigs["headline2"];
                    break;
                default:
                    this.lineConfigs[lineIdx] = Credits.textConfigs["normal"];
                    break;
            }
            this.textHeight +=
                this.lineConfigs[lineIdx].topMargin +
                this.lineConfigs[lineIdx].lineHeight;
        }
        this.startPosition = new Vector2(
            this.rect.width / 2,
            this.rect.height - this.lineConfigs[0].topMargin + this.lineConfigs[0].lineHeight / 2);

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
        ctx.globalAlpha = 0.6;
        ctx.fillRect(0, 0, this.rect.width, this.rect.height);
        ctx.fillStyle = "white";
        let lineY = Math.ceil(this.textMovement.at.y);
        for (let lineIdx = 0; lineIdx < this.text.length; lineIdx++) {

            lineY += this.lineConfigs[lineIdx].topMargin;
            ctx.globalAlpha = this.lineConfigs[lineIdx].alpha;
            drawingContext.drawText(
                this.text[lineIdx], new Vector2(this.textMovement.at.x, lineY),
                this.lineConfigs[lineIdx].fontSize, "center");

            lineY += this.lineConfigs[lineIdx].lineHeight;
        }
    }
}