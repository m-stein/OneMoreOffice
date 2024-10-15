import { GameObject } from "./game_object";
import { Vector2 } from './vector_2.js';

export class IsometricFormation1 extends GameObject
{
    constructor(position, label, tileQuarterIsoWidth)
    {
        super(position, label);
        this.tileQuarterIsoWidth = tileQuarterIsoWidth;
    }

    insert(object, at)
    {
        object.position.x += at * this.tileQuarterIsoWidth * 4;
        this.addChild(object, at);
    }
    
    update(deltaTimeMs) { this.updateChildren(deltaTimeMs); }

    draw(drawingContext) { this.drawChildren(drawingContext); }
}

export class IsometricFormation2 extends GameObject
{
    constructor(position, label, tileQuarterIsoWidth)
    {
        super(position, label);
        this.tileQuarterIsoWidth = tileQuarterIsoWidth;
    }

    insert(object, at)
    {
        let child = this.child(at.y);
        if (typeof child === 'undefined') {
            child = new IsometricFormation1(
                new Vector2(at.y * -this.tileQuarterIsoWidth * 2, at.y * this.tileQuarterIsoWidth),
                this.label, this.tileQuarterIsoWidth);

            this.addChild(child, at.y);
        }
        child.insert(object, at.x);
    }
    
    update(deltaTimeMs) { this.updateChildren(deltaTimeMs); }

    draw(drawingContext) { this.drawChildren(drawingContext); }
}

export class IsometricFormation3 extends GameObject
{
    constructor(position, label, tileHeight, tileQuarterIsoWidth)
    {
        super(position, label);
        this.tileHeight = tileHeight;
        this.tileQuarterIsoWidth = tileQuarterIsoWidth;
    }

    insert(object, at)
    {
        at.y += at.x;
        let child = this.child(at.z);
        if (typeof child === 'undefined') {
            child = new IsometricFormation2(
                new Vector2(0, at.z * -this.tileHeight),
                this.label, this.tileQuarterIsoWidth);

            this.addChild(child, at.z);
        }
        child.insert(object, new Vector2(at.x, at.y));
    }

    update(deltaTimeMs) { this.updateChildren(deltaTimeMs); }

    draw(drawingContext) { this.drawChildren(drawingContext); }
}