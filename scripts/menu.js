import { Button } from "./button.js";
import { GameObject } from "./game_object.js"
import { Vector2 } from "./vector_2.js";

export class Menu extends GameObject
{
    constructor(rect)
    {
        super(rect.position, "Menu");
        this.rect = rect;
        this.enabled = true;
        let y = 120;
        this.newGame = new Button(new Vector2(rect.width / 2, y), "NEW GAME");
        y += 35;
        this.highscore = new Button(new Vector2(rect.width / 2, y), "HIGHSCORE");
        y += 35;
        this.credits = new Button(new Vector2(rect.width / 2, y), "CREDITS");
        this.addChild(this.newGame);
        this.addChild(this.highscore);
        this.addChild(this.credits);
    }

    update(deltaTimeMs) { this.updateChildren(deltaTimeMs); }

    draw(drawingContext)
    {
        let ctx = drawingContext.canvasContext;
        ctx.fillStyle = "black";
        ctx.globalAlpha = 0.6;
        ctx.fillRect(0, 0, this.rect.width, this.rect.height);
        ctx.fillStyle = "white";
        ctx.globalAlpha = 1;
        const position = new Vector2(this.rect.width / 2, 60);
        drawingContext.drawText("ONE MORE OFFICE!", position, 32, "center");
        this.drawChildren(drawingContext);
    }
}