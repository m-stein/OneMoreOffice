import { GameObject } from "./game_object.js";
import { randomIntInclusive } from "./math.js";
import { ObjectsSpritesheet } from "./objects_spritesheet.js";
import { Sprite } from "./sprite.js";
import { TimedValue } from "./timed_value.js";
import { Vector2 } from "./vector_2.js";

function rotateHeadingClockwise(heading, numRotations)
{
    const headingsClockwise = ["down", "left", "up", "right"];
    let idx = headingsClockwise.indexOf(heading);
    idx = (idx + numRotations) % headingsClockwise.length;
    return headingsClockwise[idx];
}

class Human extends GameObject
{
    static types = [
        { imgPrefix: "woman", numImages: 12 },
        { imgPrefix: "man", numImages: 12 }
    ];

    constructor(images, numRotations, args)
    {
        super(new Vector2(0, 0), "Human");
        const type = Human.types[randomIntInclusive(0, 1)];
        this.humanSprite = new Sprite({
            position: new Vector2(8, 8),
            sourceImage: images[type.imgPrefix + randomIntInclusive(1, type.numImages)],
            frameSize: new Vector2(16, 17),
            numColumns: 4,
            numRows: 3,
            drawFrameIndex: 0,
        });
        this.shadowSprite = new ObjectsSpritesheet(images.objects);
        this.shadowSprite.currFrameIndex = 34;
        let animationIdx = randomIntInclusive(0, 3);
        if (args !== undefined) {
            switch (rotateHeadingClockwise(args.heading, numRotations)) {
                case "down": animationIdx = 0; break;
                case "right": animationIdx = 1; break;
                case "up": animationIdx = 2; break;
                case "left": animationIdx = 3; break;
            }
        }
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

class Cake extends GameObject
{
    constructor(images, numRotations, args)
    {
        super(new Vector2(0, 0), "Cake");
        this.table = new ObjectsSpritesheet(images.objects);
        this.cake = new ObjectsSpritesheet(images.objects);
        this.cake.currFrameIndex = args.numCandles;
        this.addChild(this.table);
        this.addChild(this.cake);
    }

    update(deltaTimeMs) { this.updateChildren(deltaTimeMs); }

    draw(drawingContext) { this.drawChildren(drawingContext); }
}

class Plant extends GameObject
{
    constructor(images, numRotations)
    {
        super(new Vector2(0, 0), "Plant");
        this.sprite = new ObjectsSpritesheet(images.objects);
        this.sprite.currFrameIndex = 35;
        this.addChild(this.sprite);
    }

    update(deltaTimeMs) { this.updateChildren(deltaTimeMs); }

    draw(drawingContext) { this.drawChildren(drawingContext); }
}

class Desk extends GameObject
{
    constructor(images, numRotations, args)
    {
        super(new Vector2(0, 0), "Desk");
        this.sprite = new ObjectsSpritesheet(images.objects);
        let firstFrameIdx = 15;
        let heading = "right";
        if (args !== undefined) {
            heading = args.heading;
        }
        switch(rotateHeadingClockwise(heading, numRotations)) {
            case "right": firstFrameIdx += 0; break;
            case "down": firstFrameIdx += 2; break;
            case "left": firstFrameIdx += 4; break;
            case "up": firstFrameIdx += 6; break;
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

class CoffeeMaker extends GameObject
{
    static animationAt = 10;

    constructor(images, numRotations)
    {
        super(new Vector2(0, 0), "CoffeeMaker");
        this.table = new ObjectsSpritesheet(images.objects);
        this.Server = new ObjectsSpritesheet(images.objects);
        this.animation = new ObjectsSpritesheet(images.objects);
        this.Server.currFrameIndex = 9;
        const durations = [randomIntInclusive(1000, 2000), 300];
        this.animationFrameIdx = new TimedValue([
            { ms: durations[0], value: CoffeeMaker.animationAt },
            { ms: durations[1], value: CoffeeMaker.animationAt + 1 },
            { ms: durations[1], value: CoffeeMaker.animationAt + 2 },
            { ms: durations[1], value: CoffeeMaker.animationAt + 3 },
            { ms: durations[0], value: CoffeeMaker.animationAt + 4 },
        ]);
        this.animationFrameIdx.startPhase(randomIntInclusive(0, 4));
        this.addChild(this.table);
        this.addChild(this.Server);
        this.addChild(this.animation);
        this.addChild(this.animationFrameIdx);
    }

    update(deltaTimeMs)
    {
        this.updateChildren(deltaTimeMs);
        this.animation.currFrameIndex = this.animationFrameIdx.value();
    }
    
    draw(drawingContext) { this.drawChildren(drawingContext); }
}

class Server extends GameObject
{
    static bodyAtIndex = 23;
    static colorsAtIndex = 26;
    static lightsAtIndex = 24;

    constructor(images, numRotations, args)
    {
        super(new Vector2(0, 0), "Server");
        this.body = new ObjectsSpritesheet(images.objects);
        this.lights = new ObjectsSpritesheet(images.objects);
        this.color = new ObjectsSpritesheet(images.objects);
        this.body.currFrameIndex = Server.bodyAtIndex;
        if (args !== undefined) {
            switch(args.color) {
                case "petrol": this.color.currFrameIndex = Server.colorsAtIndex + 0; break;
                case "orange": this.color.currFrameIndex = Server.colorsAtIndex + 1; break;
                case "onyx": this.color.currFrameIndex = Server.colorsAtIndex + 2; break;
                case "violet": this.color.currFrameIndex = Server.colorsAtIndex + 3; break;
                case "red": this.color.currFrameIndex = Server.colorsAtIndex + 4; break;
                case "gray": this.color.currFrameIndex = Server.colorsAtIndex + 5; break;
                case "mint": this.color.currFrameIndex = Server.colorsAtIndex + 6; break;
            }
        }
        this.lightsFrameIdx = new TimedValue([
            { ms: randomIntInclusive(100, 1000), value: Server.lightsAtIndex },
            { ms: randomIntInclusive(100, 1000), value: Server.lightsAtIndex + 1 }
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
        this.classes = { Desk, Plant, Cake, Human, Server, CoffeeMaker };
        this.images = images;
    }

    withNewObject(objDescriptor, numRotations, lambda)
    {
        if (objDescriptor === undefined) {
            return;
        }
        lambda(new this.classes[objDescriptor.class](this.images, numRotations, objDescriptor.args));
    }
}