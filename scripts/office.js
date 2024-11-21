import { IsometricFormation3 } from "./isometric_formation.js";
import { ObjectsSpritesheet } from "./objects_spritesheet.js";
import { Rectangle } from "./rectangle.js";
import { Vector2 } from "./vector_2.js";
import { Vector3 } from "./vector_3.js";

export class Office extends IsometricFormation3
{
    static size = 3;
    static tileHeight = 16;
    static tileIsoQuartWidth = 8;

    constructor(position, images)
    {
        super(position, "Office", Office.tileHeight, Office.tileIsoQuartWidth);
        for (let y = 0; y < Office.size; y++) {
            for (let x = 0; x < Office.size; x++) {
                const floor = new ObjectsSpritesheet(images.objects);
                floor.position.y = -9;
                floor.currFrameIndex = 33;
                this.insert(floor, new Vector3(x, y, 0));
            }
        }
        this.boundingRect = new Rectangle(
            new Vector2(
                -Office.tileIsoQuartWidth * 4 * Math.floor(Office.size / 2),
                -Office.tileHeight / 2
            ),
            Office.tileIsoQuartWidth * 4 * Office.size,
            Office.tileHeight * (Office.size + 1)
        );
    }

    update(deltaTimeMs) { this.updateChildren(deltaTimeMs); }

    draw(drawingContext) { this.drawChildren(drawingContext); }
}