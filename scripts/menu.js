import { Button } from "./button.js";
import { GameObject } from "./game_object.js"
import { Rectangle } from "./rectangle.js";
import { Vector2 } from "./vector_2.js";

export class Menu extends GameObject
{
    constructor(rect, mousePosition)
    {
        super(rect.position, "Menu");
        this.rect = rect;
        this.enabled = true;
        const buttonWidth = 100;
        let buttonRect = new Rectangle(new Vector2(rect.width / 2 - buttonWidth / 2, 120), buttonWidth, 20);
        this.newGame = new Button(buttonRect.copy(), "NEW GAME", mousePosition);
        buttonRect.position.y += 35;
        this.highscore = new Button(buttonRect.copy(), "HIGHSCORE", mousePosition);
        buttonRect.position.y += 35;
        this.credits = new Button(buttonRect.copy(), "CREDITS", mousePosition);
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