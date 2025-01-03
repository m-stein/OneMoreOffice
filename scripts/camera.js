import { GameObject } from "./game_object.js";
import { Sprite } from "./sprite.js";
import { Vector2 } from "./vector_2.js";

export class Camera extends GameObject
{
    constructor(backgroundImg, width, height)
    {
        super(new Vector2(0, 0), 'Camera');
        this.backgroundSprite = new Sprite
        ({
            sourceImage: backgroundImg,
            frameSize: new Vector2(width, height),
            position: new Vector2(0, 0),
        });
        this.addChild(this.backgroundSprite);
    }
    
    update(deltaTimeMs) { this.updateChildren(deltaTimeMs); }

    draw(drawingContext) { this.drawChildren(drawingContext); }
}