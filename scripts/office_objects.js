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

    constructor(images)
    {
        super(new Vector2(8, 8), "Human");
        const type = Human.types[randomIntInclusive(0, 1)];
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

class Plant extends Sprite
{
    constructor(images)
    {
        super({ sourceImage: images.plant });
    }
}

class Desk extends GameObject
{
    constructor(images, args)
    {
        super(new Vector2(0, 0), "Desk");
        this.sprite = new Sprite({
            sourceImage: images.desk,
            frameSize: new Vector2(32, 32),
            numColumns: 8,
        });
        let firstFrameIdx = 0;
        if (args !== undefined) {
            switch(args.heading) {
                case "right": firstFrameIdx = 0; break;
                case "down": firstFrameIdx = 2; break;
                case "left": firstFrameIdx = 4; break;
                case "up": firstFrameIdx = 6; break;
            }
        }
        this.frameIdx = new TimedValue([
            { ms: randomIntInclusive(500, 2000), value: firstFrameIdx },
            { ms: randomIntInclusive(250, 1000), value: firstFrameIdx + 1 }
        ]);
        this.frameIdx.startPhase(randomIntInclusive(0, 1));
        this.addChild(this.frameIdx);
        this.addChild(this.sprite);
    }

    update(deltaTimeMs)
    {
        this.updateChildren(deltaTimeMs);
        this.sprite.currFrameIndex = this.frameIdx.value();
    }
    
    draw(drawingContext) { this.drawChildren(drawingContext); }
}

class Machine extends GameObject
{
    static colorsAtIndex = 3;
    static lightsAtIndex = 1;

    constructor(images, args)
    {
        super(new Vector2(0, 0), "Machine");
        this.body = new Sprite({
            sourceImage: images.machine,
            frameSize: new Vector2(32, 32),
            numColumns: 12,
        });
        this.lights = new Sprite({
            sourceImage: images.machine,
            frameSize: new Vector2(32, 32),
            numColumns: 12,
        });
        this.color = new Sprite({
            sourceImage: images.machine,
            frameSize: new Vector2(32, 32),
            numColumns: 12,
        });
        if (args !== undefined) {
            switch(args.color) {
                case "petrol": this.color.currFrameIndex = Machine.colorsAtIndex + 0; break;
                case "orange": this.color.currFrameIndex = Machine.colorsAtIndex + 1; break;
                case "onyx": this.color.currFrameIndex = Machine.colorsAtIndex + 2; break;
                case "violet": this.color.currFrameIndex = Machine.colorsAtIndex + 3; break;
                case "red": this.color.currFrameIndex = Machine.colorsAtIndex + 4; break;
                case "gray": this.color.currFrameIndex = Machine.colorsAtIndex + 5; break;
            }
        }
        this.lightsFrameIdx = new TimedValue([
            { ms: randomIntInclusive(100, 1000), value: Machine.lightsAtIndex },
            { ms: randomIntInclusive(100, 1000), value: Machine.lightsAtIndex + 1 }
        ]);
        this.lightsFrameIdx.startPhase(randomIntInclusive(0, 1));
        this.addChild(this.body);
        this.addChild(this.color);
        this.addChild(this.lights);
        this.addChild(this.lightsFrameIdx);
    }

    update(deltaTimeMs)
    {
        this.updateChildren(deltaTimeMs);
        this.lights.currFrameIndex = this.lightsFrameIdx.value();
    }
    
    draw(drawingContext) { this.drawChildren(drawingContext); }
}

export class OfficeObjects
{
    constructor(images)
    {
        this.classes = { Desk, Plant, TableCake, Human, Machine };
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