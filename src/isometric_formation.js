import { GameObject } from "./game_object";
import { Vector2 } from './vector_2.js';

export class IsometricFormationTile extends GameObject
{
    constructor(position, label) { super(position, label); }

    update(deltaTimeMs) { this.updateChildren(deltaTimeMs); }

    draw(drawingContext) { this.drawChildren(drawingContext); }
}

export class IsometricFormation1 extends GameObject
{
    constructor(position, label, tileQuartIsoWidth)
    {
        super(position, label);
        this.tileQuartIsoWidth = tileQuartIsoWidth;
    }

    insert(object, at)
    {
        let child = this.childAt(at);
        if (typeof child === 'undefined') {

            child = new IsometricFormationTile(
                new Vector2(at * this.tileQuartIsoWidth * 4, 0),
                this.label, this.tileQuartIsoWidth);

            this.addChild(child, at);
        }
        child.addChild(object);
    }
    
    update(deltaTimeMs) { this.updateChildren(deltaTimeMs); }

    draw(drawingContext) { this.drawChildren(drawingContext); }
}

export class IsometricFormation2 extends GameObject
{
    constructor(position, label, tileHeight, tileQuartIsoWidth)
    {
        super(position, label);
        this.tileHeight = tileHeight;
        this.tileQuartIsoWidth = tileQuartIsoWidth;
    }

    insert(object, at)
    {
        let child = this.childAt(at.y);
        if (typeof child === 'undefined') {

            child = new IsometricFormation1(
                new Vector2(0, at.y * -this.tileHeight),
                this.label, this.tileQuartIsoWidth);

            this.addChild(child, at.y);
        }
        child.insert(object, at.x);
    }
    
    update(deltaTimeMs) { this.updateChildren(deltaTimeMs); }

    draw(drawingContext) { this.drawChildren(drawingContext); }
}

export class IsometricFormation3 extends GameObject
{
    constructor(position, label, tileHeight, tileQuartIsoWidth)
    {
        super(position, label);
        this.tileHeight = tileHeight;
        this.tileQuartIsoWidth = tileQuartIsoWidth;
    }

    insert(object, at)
    {
        at.y += at.x;
        let child = this.childAt(at.y);
        if (typeof child === 'undefined') {

            child = new IsometricFormation2(
                new Vector2(at.y * -this.tileQuartIsoWidth * 2,
                            at.y * this.tileQuartIsoWidth),
                this.label, this.tileHeight, this.tileQuartIsoWidth);

            this.addChild(child, at.y);
        }
        child.insert(object, new Vector2(at.x, at.z));
    }

    update(deltaTimeMs) { this.updateChildren(deltaTimeMs); }

    draw(drawingContext) { this.drawChildren(drawingContext); }
}