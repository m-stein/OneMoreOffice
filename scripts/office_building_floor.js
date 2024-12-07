import { GameObject } from "./game_object.js"
import { OfficeMatrix } from "./office_matrix.js";
import { Sprite } from "./sprite.js";
import { Vector2 } from "./vector_2.js";

export class OfficeBuildingFloor extends GameObject
{
    constructor(images, position)
    {
        super(position, "OfficeBuildingFloor");
        this.officeMatrix = new OfficeMatrix(new Vector2(0, 0));
        const wallsElem = images.building.htmlElement;
        const wallsPosition = new Vector2(-144, -8);
        const wallsFrameSize = new Vector2(wallsElem.width, wallsElem.height / 2);
        this.backWalls = new Sprite({
            sourceImage: images.building,
            position: wallsPosition,
            frameSize: wallsFrameSize,
            numRows: 2,
            drawFrameIndex: 0,
        });
        this.frontWalls = new Sprite({
            sourceImage: images.building,
            position: wallsPosition,
            frameSize: wallsFrameSize,
            numRows: 2,
            drawFrameIndex: 1,
        });
        this.addAllChildren();
    }

    addAllChildren()
    {
        this.addChild(this.backWalls);
        this.addChild(this.officeMatrix);
        this.addChild(this.frontWalls);
    }

    removeAllOffices()
    {
        this.removeAllChildren();
        this.officeMatrix = new OfficeMatrix(new Vector2(0, 0));
        this.addAllChildren();
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