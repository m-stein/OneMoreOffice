import { GameObject } from "./game_object";
import { IsometricFormation3 } from "./isometric_formation";
import { Sprite } from "./sprite";
import { Vector2 } from "./vector_2";
import { Vector3 } from "./vector_3";

export class Office extends IsometricFormation3
{
    static size = 3;
    static tileHeight = 16;
    static tileIsoQuartWidth = 8;

    constructor(position, resources)
    {
        super(position, "Office", Office.tileHeight, Office.tileIsoQuartWidth);
        for (let y = 0; y < Office.size; y++) {
            for (let x = 0; x < Office.size; x++) {
                this.insert(new Sprite({sourceImage: resources.imageRegistry.floor, position: new Vector2(0, 0)}), new Vector3(x, y, 0));
            }
        }
    }

    update(deltaTimeMs) { this.updateChildren(deltaTimeMs); }

    draw(drawingContext) { this.drawChildren(drawingContext); }
}

export class OfficeLevel extends IsometricFormation3
{
    static size = 3;
    static officeMargin = 3;
    static tileHeight = Office.tileHeight * OfficeLevel.size + OfficeLevel.officeMargin;
    static tileIsoQuartWidth = Office.tileIsoQuartWidth * OfficeLevel.size + OfficeLevel.officeMargin;

    constructor(resources, position)
    {
        super(position, "OfficeLevel", OfficeLevel.tileHeight, OfficeLevel.tileIsoQuartWidth);
        for (let y = 0; y < OfficeLevel.size; y++) {
            for (let x = 0; x < OfficeLevel.size; x++) {
                this.insert(new Office(new Vector2(0, 0), resources), new Vector3(x, y, 0));
            }
        }
    }

    update(deltaTimeMs) { this.updateChildren(deltaTimeMs); }

    draw(drawingContext) { this.drawChildren(drawingContext); }
}