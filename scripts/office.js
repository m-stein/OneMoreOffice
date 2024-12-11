import { DrawingContext } from "./drawing_context.js";
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

    constructor(position, images, hasAlpha = false, htmlDocument = undefined)
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
        if (hasAlpha) {
            const canvas = htmlDocument.createElement("canvas");
            canvas.width = 640;
            canvas.height = 320;
            this.localDrawingContext = new DrawingContext(canvas);
            this.alpha = 1;
        }
    }
    
    drawChildrenToLocalDrawingContext()
    {
        const localCanvasCtx = this.localDrawingContext.canvasContext;
        const localCanvas = this.localDrawingContext.canvas;
        localCanvasCtx.clearRect(0, 0, localCanvas.width, localCanvas.height);
        this.drawChildren(this.localDrawingContext);
    }

    update(deltaTimeMs) { this.updateChildren(deltaTimeMs); }

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
        canvasCtx.drawImage(this.localDrawingContext.canvas, 0, 0);
        canvasCtx.globalAlpha = 1;
    }
}