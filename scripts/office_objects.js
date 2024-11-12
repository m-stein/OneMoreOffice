import { GameObject } from "./game_object.js";
import { Sprite } from "./sprite.js";
import { Vector2 } from "./vector_2.js";

class DeskPc extends GameObject
{
    constructor(images, args)
    {
        super(new Vector2(1, -33), "DeskPc");
        this.deskLeft = new Sprite({
            sourceImage: images.extradaveFurniture,
            frameSize: new Vector2(64, 128),
            numColumns: 16,
            numRows: 16,
            scaleFactor: 0.5,
            drawFrameIndex: 0,
            position: new Vector2(0, 0)
        });
        this.deskRight = new Sprite({
            sourceImage: images.extradaveFurniture,
            frameSize: new Vector2(64, 128),
            numColumns: 16,
            numRows: 16,
            scaleFactor: 0.5,
            drawFrameIndex: 0,
            position: new Vector2(0, 0)
        });
        this.pc = new Sprite({
            sourceImage: images.extradaveFurniture,
            frameSize: new Vector2(64, 128),
            numColumns: 16,
            numRows: 16,
            scaleFactor: 0.5,
            drawFrameIndex: 0,
            position: new Vector2(0, 0)
        });
        switch(args.heading) {

            case "down":
                this.deskLeft.currFrameIndex = 13;
                this.deskRight.currFrameIndex = 12;
                this.pc.currFrameIndex = 76;
                this.addChild(this.deskLeft);
                this.addChild(this.deskRight);
                break;

            case "right":
                this.deskLeft.currFrameIndex = 15;
                this.deskRight.currFrameIndex = 14;
                this.pc.currFrameIndex = 77;
                this.addChild(this.deskRight);
                this.addChild(this.deskLeft);
                break;

            case "up":
                this.deskLeft.currFrameIndex = 29;
                this.deskRight.currFrameIndex = 28;
                this.pc.currFrameIndex = 78;
                this.addChild(this.deskRight);
                this.addChild(this.deskLeft);
                break;

            case "left":
                this.deskLeft.currFrameIndex = 31;
                this.deskRight.currFrameIndex = 30;
                this.pc.currFrameIndex = 79;
                this.addChild(this.deskLeft);
                this.addChild(this.deskRight);
                break;
        }
        this.addChild(this.pc);
    }

    update(deltaTimeMs) { this.updateChildren(deltaTimeMs); }

    draw(drawingContext) { this.drawChildren(drawingContext); }
}

class CupboardMachine extends GameObject
{
    constructor(images)
    {
        super(new Vector2(1, -33), "CupboardMachine");
        this.cupboard = new Sprite({
            sourceImage: images.extradaveFurniture,
            frameSize: new Vector2(64, 128),
            numColumns: 16,
            numRows: 16,
            scaleFactor: 0.5,
            drawFrameIndex: 43,
            position: new Vector2(0, 0)
        });
        this.machine = new Sprite({
            sourceImage: images.extradaveFurniture,
            frameSize: new Vector2(64, 128),
            numColumns: 16,
            numRows: 16,
            scaleFactor: 0.5,
            drawFrameIndex: 126,
            position: new Vector2(0, 0)
        });
        this.addChild(this.cupboard);
        this.addChild(this.machine);
    }

    update(deltaTimeMs) { this.updateChildren(deltaTimeMs); }

    draw(drawingContext) { this.drawChildren(drawingContext); }
}

class Plant extends Sprite
{
    constructor(images)
    {
        super({ sourceImage: images.plant, position: new Vector2(0, 0) });
    }
}

class Desk extends Sprite
{
    constructor(images)
    {
        super({ sourceImage: images.desk, position: new Vector2(0, 0) });
    }
}

export class OfficeObjects
{
    constructor(images)
    {
        this.classes = { Desk, Plant, DeskPc, CupboardMachine };
        this.images = images;
    }

    withNewObject(objDescriptor, lambda)
    {
        if (objDescriptor === undefined) {
            return;
        }
        lambda(new this.classes[objDescriptor.class](this.images, objDescriptor.args));
    }
}