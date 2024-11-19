import { getRandomItem } from "./array_utilities.js";
import { GameObject } from "./game_object.js";
import { LinearMovement } from "./linear_movement.js";
import { Vector2 } from "./vector_2.js";

export class SelectionFeedback extends GameObject
{
    static positiveFeedback = [
        "Good choice!",
        "This is correct!",
        "Wonderful, keep going!",
        "You are doing great!",
        "Well chosen!",
        "You solved it!",
        "You cracked it!",
        "Fit perfectly!",
        "This looks great!",
        "A perfect match!",
    ];

    static negativeFeedback = [
        "Not correct unfortunately.",
        "Sorry, wrong choice.",
        "No, maybe next time!",
        "No, but keep at it!",
        "Sorry, this is not it.",
        "Sorry, this does not fit.",
    ];

    constructor(textPosition)
    {
        super(new Vector2(0, 0), "SelectionFeedback");
        this.textPosition = textPosition;
        this.enabled = false;
    }

    enable(selectionCorrect, points, pointsStartPosition)
    {
        this.removeAllChildren();
        if (selectionCorrect) {
            this.text = getRandomItem(SelectionFeedback.positiveFeedback);
        } else {
            this.text = getRandomItem(SelectionFeedback.negativeFeedback);
        }
        this.points = points;
        this.pointsMovement = new LinearMovement(pointsStartPosition);
        this.pointsMovement.startMovingTowards(pointsStartPosition.copy().add(new Vector2(0, -30)), 0.001);
        this.addChild(this.pointsMovement);
        this.enabled = true;
    }

    disable()
    {
        this.enabled = false;
    }

    update(deltaTimeMs)
    {
        if (!this.enabled) {
            return;
        }
        this.updateChildren(deltaTimeMs);
    }

    draw(drawingContext)
    {
        if (!this.enabled) {
            return;
        }
        drawingContext.drawText(this.text, this.textPosition, 16, "center");
        if (!this.pointsMovement.arrived) {
            drawingContext.drawText("+ " + this.points, this.pointsMovement.at, 12, "center");
        }
    }
}