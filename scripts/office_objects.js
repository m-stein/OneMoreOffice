import { GameObject } from "./game_object.js";
import { randomIntInclusive } from "./math.js";
import { Sprite } from "./sprite.js";
import { TimedValue } from "./timed_value.js";
import { Vector2 } from "./vector_2.js";

class Human extends GameObject
{
    static types = [
        { imgPrefix: "woman", numImages: 12 },
        { imgPrefix: "man", numImages: 12 }
    ];

    constructor(images, args)
    {
        super(new Vector2(8, 8), "TableCake");
        const type = Human.types[randomIntInclusive(0, 1)];
        console.log(type.imgPrefix + randomIntInclusive(1, type.numImages));
        this.humanSprite = new Sprite({
            sourceImage: images[type.imgPrefix + randomIntInclusive(1, type.numImages)],
            frameSize: new Vector2(16, 17),
            numColumns: 4,
            numRows: 3,
            drawFrameIndex: 0,
        });
        this.shadowSprite = new Sprite({ sourceImage: images.humanShadow });
        const animationIdx = randomIntInclusive(0, 3);
        this.frameIdx = new TimedValue([
            { ms: randomIntInclusive(200, 400), value: animationIdx + 0 },
            { ms: randomIntInclusive(200, 400), value: animationIdx + 4 },
            { ms: randomIntInclusive(200, 400), value: animationIdx + 8 }
        ]);
        this.frameIdx.startPhase(randomIntInclusive(0, 2));
        this.addChild(this.frameIdx);
        this.addChild(this.shadowSprite);
        this.addChild(this.humanSprite);
    }

    update(deltaTimeMs)
    {
        this.updateChildren(deltaTimeMs);
        this.humanSprite.currFrameIndex = this.frameIdx.value();
    }

    draw(drawingContext) { this.drawChildren(drawingContext); }
}

class TableCake extends GameObject
{
    constructor(images, args)
    {
        super(new Vector2(0, 6), "TableCake");
        this.table = new Sprite({
            sourceImage: images.tableCake,
            frameSize: new Vector2(32, 288),
            numColumns: 9,
            drawFrameIndex: 0,
        });
        this.cake = new Sprite({
            sourceImage: images.tableCake,
            frameSize: new Vector2(32, 288),
            numColumns: 9,
            drawFrameIndex: args.numCandles,
        });
        this.addChild(this.table);
        this.addChild(this.cake);
    }

    update(deltaTimeMs) { this.updateChildren(deltaTimeMs); }

    draw(drawingContext) { this.drawChildren(drawingContext); }
}

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
        });
        this.deskRight = new Sprite({
            sourceImage: images.extradaveFurniture,
            frameSize: new Vector2(64, 128),
            numColumns: 16,
            numRows: 16,
            scaleFactor: 0.5,
        });
        this.pc = new Sprite({
            sourceImage: images.extradaveFurniture,
            frameSize: new Vector2(64, 128),
            numColumns: 16,
            numRows: 16,
            scaleFactor: 0.5,
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
        });
        this.machine = new Sprite({
            sourceImage: images.extradaveFurniture,
            frameSize: new Vector2(64, 128),
            numColumns: 16,
            numRows: 16,
            scaleFactor: 0.5,
            drawFrameIndex: 126,
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
        super({ sourceImage: images.plant });
    }
}

class Desk extends Sprite
{
    constructor(images)
    {
        super({ sourceImage: images.desk });
    }
}

export class OfficeObjects
{
    constructor(images)
    {
        this.classes = { Desk, Plant, DeskPc, CupboardMachine, TableCake, Human };
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