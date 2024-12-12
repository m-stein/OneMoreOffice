import { removeItem } from "./array_utilities.js";
import { Button } from "./button.js";
import { GameObject } from "./game_object.js"
import { LinearMovement } from "./linear_movement.js";
import { Rectangle } from "./rectangle.js";
import { Vector2 } from "./vector_2.js";

export class Menu extends GameObject
{
    constructor(
        rect, mousePosition, mouseDownHandlers, mouseEntersButtonAudio,
        onNewGamePressed, onHighscorePressed, onCreditsPressed)
    {
        super(rect.position, "Menu");
        this.rect = rect;
        this.enabled = true;
        this.mouseEntersButtonAudio = mouseEntersButtonAudio;
        this.onNewGamePressed = onNewGamePressed;
        this.onHighscorePressed = onHighscorePressed;
        this.onCreditsPressed = onCreditsPressed;
        this.mousePosition = mousePosition;
        this.mouseDownHandlers = mouseDownHandlers;
        this.mouseDownHandlers.push(this.onMouseDown);
        this.buttonsEnabled = false;
        this.clickedOnce = false;
        this.titleMovement = new LinearMovement(new Vector2(rect.width / 2, 130));
    }

    enable() { this.enabled = true; }
    
    disable() { this.enabled = false; }

    onMouseDown = () =>
    {
        this.clickedOnce = true;
        this.titleMovement.startMovingTowards(new Vector2(this.rect.width / 2, 80), 0.002);
        removeItem(this.mouseDownHandlers, this.onMouseDown);
    }

    destroy()
    {
        removeItem(this.mouseDownHandlers, this.onMouseDown);
    }

    enableButtons()
    {
        const buttonWidth = 100;
        let buttonRect = new Rectangle(new Vector2(this.rect.width / 2 - buttonWidth / 2, 120), buttonWidth, 20);
        this.newGame = new Button(buttonRect.copy(), "NEW GAME", this.mousePosition, this.mouseDownHandlers, this.mouseEntersButtonAudio);
        this.newGame.pressedHandlers.push(this.onNewGamePressed);
        buttonRect.position.y += 35;
        this.highscore = new Button(buttonRect.copy(), "HIGHSCORE", this.mousePosition, this.mouseDownHandlers, this.mouseEntersButtonAudio);
        this.highscore.pressedHandlers.push(this.onHighscorePressed);
        buttonRect.position.y += 35;
        this.credits = new Button(buttonRect.copy(), "CREDITS", this.mousePosition, this.mouseDownHandlers, this.mouseEntersButtonAudio);
        this.credits.pressedHandlers.push(this.onCreditsPressed);
        this.addChild(this.newGame);
        this.addChild(this.highscore);
        this.addChild(this.credits);
        this.buttonsEnabled = true;
    }

    update(deltaTimeMs)
    {
        if (!this.enabled) {
            return;
        }
        if (this.clickedOnce && !this.titleMovement.arrived) {
            this.titleMovement.update(deltaTimeMs);
            if (this.titleMovement.arrived) {
                this.enableButtons();
            }
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
        let titleSize = 48;
        if (this.clickedOnce) {
            titleSize -= 16 * this.titleMovement.amountOfDistTraveled;
        }
        drawingContext.drawText("ONE MORE OFFICE!", this.titleMovement.at, titleSize, "center");
        this.drawChildren(drawingContext);
    }
}