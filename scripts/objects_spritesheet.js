import { Sprite } from "./sprite.js";
import { Vector2 } from "./vector_2.js";

export class ObjectsSpritesheet extends Sprite
{
    constructor(image, frameIdx)
    {
        super({
            sourceImage: image,
            frameSize: new Vector2(32, 32),
            numColumns: 7,
            numRows: 7,
        });
        if (frameIdx !== undefined) {
            this.currFrameIndex = frameIdx;
        }
    }
}