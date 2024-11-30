import { createEnum } from "./enum.js";
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

const Color = createEnum({
    petrol: 0,
    orange: 1,
    onyx: 2,
    violet: 3,
    red: 4,
    gray: 5,
    mint: 6,
    count: 7
});

class Human extends GameObject
{
    static types = [
        { imgPrefix: "woman", numImages: 12 },
        { imgPrefix: "man", numImages: 12 }
    ];

    constructor(images, numRotations, configArgs)
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
        if (configArgs !== undefined) {
            switch (rotateHeadingClockwise(configArgs.heading, numRotations)) {
                case "down": animationIdx = 0; break;
                case "right": animationIdx = 1; break;
                case "up": animationIdx = 2; break;
                case "left": animationIdx = 3; break;
            }
        }
        const ms = randomIntInclusive(200, 500);
        this.frameIdx = new TimedValue([
            { ms: ms, value: animationIdx + 0 },
            { ms: ms, value: animationIdx + 4 },
            { ms: ms, value: animationIdx + 0 },
            { ms: ms, value: animationIdx + 8 }
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
    constructor(images, numRotations, configArgs)
    {
        super(new Vector2(0, 0), "Cake");
        this.table = new ObjectsSpritesheet(images.objects);
        this.cake = new ObjectsSpritesheet(images.objects);
        this.cake.currFrameIndex = configArgs.numCandles;
        this.addChild(this.table);
        this.addChild(this.cake);
    }

    update(deltaTimeMs) { this.updateChildren(deltaTimeMs); }

    draw(drawingContext) { this.drawChildren(drawingContext); }
}

class Plant extends GameObject
{
    constructor(images, numRotations, configArgs)
    {
        super(new Vector2(0, 0), "Plant");
        this.sprite = new ObjectsSpritesheet(images.objects);
        this.sprite.currFrameIndex = 35;
        this.addChild(this.sprite);
    }

    update(deltaTimeMs) { this.updateChildren(deltaTimeMs); }

    draw(drawingContext) { this.drawChildren(drawingContext); }
}

class Present extends GameObject
{
    static firstFrame = 36;

    constructor(images, numRotations, configArgs)
    {
        super(new Vector2(0, 0), "Present");
        this.body = new ObjectsSpritesheet(images.objects);
        if (configArgs === undefined) {
            this.body.currFrameIndex = Present.firstFrame + randomIntInclusive(0, Color.count - 1);
        } else {
            this.body.currFrameIndex = Present.firstFrame + Color[configArgs.color];
        }
        this.bodyYBase = this.body.position.y;
        this.shadow = new ObjectsSpritesheet(images.objects);
        this.shadow.currFrameIndex = Present.firstFrame + Color.count;
        this.bodyYOffset = new TimedValue([
            { ms: randomIntInclusive(2000, 8000), value: 0 },
            { ms: 40, value: -4 },
            { ms: 40, value: -6 },
            { ms: 40, value: -7 },
            { ms: 40, value: -6 },
            { ms: 40, value: -4 }
        ]);
        this.bodyYOffset.startPhaseWithRandomTimeOffset(0);
        this.addChild(this.shadow);
        this.addChild(this.body);
        this.addChild(this.bodyYOffset);
    }

    update(deltaTimeMs)
    {
        this.updateChildren(deltaTimeMs);
        this.body.position.y = this.bodyYBase + this.bodyYOffset.value();
    }

    draw(drawingContext) { this.drawChildren(drawingContext); }
}

class Desk extends GameObject
{
    constructor(images, numRotations, configArgs)
    {
        super(new Vector2(0, 0), "Desk");
        this.sprite = new ObjectsSpritesheet(images.objects);
        let firstFrameIdx = 15;
        let heading = "right";
        if (configArgs !== undefined) {
            heading = configArgs.heading;
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

    constructor(images, numRotations, configArgs)
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

    constructor(images, numRotations, configArgs)
    {
        super(new Vector2(0, 0), "Server");
        this.body = new ObjectsSpritesheet(images.objects);
        this.lights = new ObjectsSpritesheet(images.objects);
        this.color = new ObjectsSpritesheet(images.objects);
        this.body.currFrameIndex = Server.bodyAtIndex;
        if (configArgs === undefined) {
            this.color.currFrameIndex = Server.colorsAtIndex + randomIntInclusive(0, Color.count - 1);
        } else {
            this.color.currFrameIndex = Server.colorsAtIndex + Color[configArgs.color];
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
        this.classes = { Desk, Plant, Cake, Human, Server, CoffeeMaker, Present };
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