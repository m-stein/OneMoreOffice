import { GameObject } from "../game_object.js";
import { Sprite } from "../sprite.js";
import { Vector2 } from "../vector_2.js";

class DeskPc extends GameObject
{
    constructor(images)
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
    }

    update(deltaTimeMs) { this.updateChildren(deltaTimeMs); }

    draw(drawingContext) { this.drawChildren(drawingContext); }
}

class DeskPcSouth extends DeskPc
{
    constructor(images)
    {
        super(images);
        this.deskLeft.currFrameIndex = 13;
        this.deskRight.currFrameIndex = 12;
        this.pc.currFrameIndex = 76;
        this.addChild(this.deskLeft);
        this.addChild(this.deskRight);
        this.addChild(this.pc);
    }
}

class DeskPcEast extends DeskPc
{
    constructor(images)
    {
        super(images);
        this.deskLeft.currFrameIndex = 15;
        this.deskRight.currFrameIndex = 14;
        this.pc.currFrameIndex = 77;
        this.addChild(this.deskRight);
        this.addChild(this.deskLeft);
        this.addChild(this.pc);
    }
}

class DeskPcNorth extends DeskPc
{
    constructor(images)
    {
        super(images);
        this.deskLeft.currFrameIndex = 29;
        this.deskRight.currFrameIndex = 28;
        this.pc.currFrameIndex = 78;
        this.addChild(this.deskRight);
        this.addChild(this.deskLeft);
        this.addChild(this.pc);
    }
}

class DeskPcWest extends DeskPc
{
    constructor(images)
    {
        super(images);
        this.deskLeft.currFrameIndex = 31;
        this.deskRight.currFrameIndex = 30;
        this.pc.currFrameIndex = 79;
        this.addChild(this.deskLeft);
        this.addChild(this.deskRight);
        this.addChild(this.pc);
    }
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

export class ExtradaveTheme
{
    static withNewOfficeObject(images)
    {
        return (id, lambda) => {
            switch (id) {
                case 1: lambda(new DeskPcSouth(images)); break;
                case 2: lambda(new DeskPcEast(images)); break;
                case 3: lambda(new DeskPcNorth(images)); break;
                case 4: lambda(new DeskPcWest(images)); break;
                case 5: lambda(new CupboardMachine(images)); break;
                case 'v': lambda(new DeskPcSouth(images)); break;
                case '>': lambda(new DeskPcEast(images)); break;
                case '^': lambda(new DeskPcNorth(images)); break;
                case '<': lambda(new DeskPcWest(images)); break;
                case 'm': lambda(new CupboardMachine(images)); break;
            }
        }
    }
}