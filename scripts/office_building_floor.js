import { DrawingContext } from "./drawing_context.js";
import { GameObject } from "./game_object.js"
import { OfficeMatrix } from "./office_matrix.js";
import { Sprite } from "./sprite.js";
import { Vector2 } from "./vector_2.js";

export class OfficeBuildingFloor extends GameObject
{
    constructor(images, position, htmlDocument)
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
        /*
        this.canvas = htmlDocument.createElement("canvas");
        this.canvas.width = 300;
        this.canvas.height = 300;
        this.drawingContext = new DrawingContext(this.canvas);
        */
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
        drawingContext.canvasContext.globalAlpha = this.alpha;
        this.drawChildren(drawingContext);
        drawingContext.canvasContext.globalAlpha = 1;
        /*
        this.drawChildren(this.drawingContext);
        drawingContext.canvasContext.globalAlpha = this.alpha;
        drawingContext.canvasContext.drawImage(this.canvas, 0, 0);
        drawingContext.canvasContext.globalAlpha = 1;
        */
    }
}