import { lastItem } from "./array_utilities.js";
import { GameObject } from "./game_object.js";
import { OfficeBuildingFloor } from "./office_building_floor.js";
import { Vector2 } from "./vector_2.js";

export class OfficeBuilding extends GameObject
{
    static floorHeight = 78;
    static numFloors = 4;

    constructor(images, position)
    {
        super(position, "OfficeBuilding");
        this.floors = [];
        let floorY = 0;
        for (let idx = 0; idx < OfficeBuilding.numFloors; idx++) {
            this.floors.unshift(
                new OfficeBuildingFloor(images, new Vector2(0, floorY))
            );
            floorY += OfficeBuilding.floorHeight;
        }
        this.floors.forEach((floor) => { this.addChild(floor); });
    }

    heighestFloor()
    {
        return lastItem(this.floors);
    }

    update(deltaTimeMs)
    {
        this.updateChildren(deltaTimeMs);
    }

    draw(drawingContext)
    {
        this.drawChildren(drawingContext);
    }
}