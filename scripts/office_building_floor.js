import { DrawingContext } from "./drawing_context.js";
import { GameObject } from "./game_object.js"
import { OfficeMatrix } from "./office_matrix.js";
import { Sprite } from "./sprite.js";
import { Vector2 } from "./vector_2.js";

export class OfficeBuildingFloor extends GameObject
{
    /*
     * Provide some extra room at the top of the local canvas for
     * office objects of great height, such as servers.
     */
    static localCanvasTopMargin = 16;

    constructor(images, position, htmlDocument)
    {
        super(position, "OfficeBuildingFloor");
        this.officeMatrix = new OfficeMatrix(new Vector2(0, 0));
        this.wallsPosition = new Vector2(-145, -9);
        const wallsElem = images.building.htmlElement;
        const wallsFrameSize = new Vector2(wallsElem.width, wallsElem.height / 2);
        this.backWalls = new Sprite({
            sourceImage: images.building,
            position: this.wallsPosition,
            frameSize: wallsFrameSize,
            numRows: 2,
            drawFrameIndex: 0,
        });
        this.frontWalls = new Sprite({
            sourceImage: images.building,
            position: this.wallsPosition,
            frameSize: wallsFrameSize,
            numRows: 2,
            drawFrameIndex: 1,
        });
        const canvas = htmlDocument.createElement("canvas");
        canvas.width = images.building.htmlElement.width;
        canvas.height = images.building.htmlElement.height / 2 + OfficeBuildingFloor.localCanvasTopMargin;
        this.localDrawingContext = new DrawingContext(canvas);
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

    drawChildrenToLocalDrawingContext()
    {
        const localCanvasCtx = this.localDrawingContext.canvasContext;
        const localCanvas = this.localDrawingContext.canvas;
        localCanvasCtx.clearRect(0, 0, localCanvas.width, localCanvas.height);
        localCanvasCtx.save();
        localCanvasCtx.translate(-this.wallsPosition.x, -this.wallsPosition.y + OfficeBuildingFloor.localCanvasTopMargin);
        this.drawChildren(this.localDrawingContext);
        localCanvasCtx.restore();
    }

    draw(drawingContext)
    {
        if (this.alpha === undefined ||
            this.alpha >= 1)
        {
            this.drawChildren(drawingContext);
            return;
        }
        if (this.alpha == 0) {
            return;
        }
        this.drawChildrenToLocalDrawingContext();
        const canvasCtx = drawingContext.canvasContext;
        canvasCtx.globalAlpha = this.alpha;
        const position = drawingContext.position.copy().add(this.wallsPosition);
        canvasCtx.drawImage(this.localDrawingContext.canvas, position.x, position.y - OfficeBuildingFloor.localCanvasTopMargin);
        canvasCtx.globalAlpha = 1;
    }
}