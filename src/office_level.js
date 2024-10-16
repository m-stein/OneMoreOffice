import { GameObject } from "./game_object";
import { IsometricFormation3 } from "./isometric_formation";
import { Matrix2 } from "./matrix_3";
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
                this.insert(new Sprite({sourceImage: resources.imageRegistry.floor, position: new Vector2(0, -9)}), new Vector3(x, y, 0));
            }
        }
    }

    update(deltaTimeMs) { this.updateChildren(deltaTimeMs); }

    draw(drawingContext) { this.drawChildren(drawingContext); }
}

export class Plant extends Sprite
{
    constructor(resources)
    {
        super({ sourceImage: resources.imageRegistry.plant, position: new Vector2(0, 0) });
    }
}

export class Desk extends Sprite
{
    constructor(resources)
    {
        super({ sourceImage: resources.imageRegistry.desk, position: new Vector2(0, 0) });
    }
}

export class OfficeLevel extends IsometricFormation3
{
    static size = 3;
    static officeMargin = 3;
    static tileHeight = Office.tileHeight * OfficeLevel.size + OfficeLevel.officeMargin;
    static tileIsoQuartWidth = Office.tileIsoQuartWidth * OfficeLevel.size + OfficeLevel.officeMargin;

    constructor(resources, position, objects)
    {
        super(position, "OfficeLevel", OfficeLevel.tileHeight, OfficeLevel.tileIsoQuartWidth);
        this.offices = new Matrix2();
        for (let y = 0; y < OfficeLevel.size; y++) {
            for (let x = 0; x < OfficeLevel.size; x++) {
                const office = new Office(new Vector2(0, 0), resources);
                this.insert(office, new Vector3(x, y, 0));
                console.log("add office ", x, y);
                this.offices.insert(office, new Vector2(x, y));
            }
        }
        objects.forEach((obj) => {
            switch(obj[0]) {
                case "plant":
                    this.offices.item(new Vector2(obj[1], obj[2])).insert(new Plant(resources), new Vector3(obj[3], obj[4], 1));
                    break;
                case "desk":
                    this.offices.item(new Vector2(obj[1], obj[2])).insert(new Desk(resources), new Vector3(obj[3], obj[4], 1));
                    break;
            }
        });
    }

    update(deltaTimeMs) { this.updateChildren(deltaTimeMs); }

    draw(drawingContext) { this.drawChildren(drawingContext); }
}