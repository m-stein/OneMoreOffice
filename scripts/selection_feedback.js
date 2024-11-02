import { GameObject } from "./game_object.js";
import { Vector2 } from "./vector_2.js";

export class SelectionFeedback extends GameObject
{
    constructor(position, selectionCorrect)
    {
        super(position, "SelectionFeedback");
        this.enabled = false;
        this.selectionCorrect = selectionCorrect;
    }

    update(deltaTimeMs) { }

    draw(drawingContext)
    {
        if (!this.enabled) {
            return;
        }
        if (this.selectionCorrect()) {
            drawingContext.drawText("Marvellous!", this.position, 16, "center");
        } else {
            drawingContext.drawText("Well, that'll do...", this.position, 16, "center");
        }
    }
}