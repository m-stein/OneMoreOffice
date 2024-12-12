import { GameObject } from "./game_object.js";
import { ObjectsSpritesheet } from "./objects_spritesheet.js";
import { Vector2 } from "./vector_2.js";

export class FloorIndicator extends GameObject
{
    static hardFloorArrowFrame = 44;
    static easyFloorArrowFrame = 45;
    static hardFloorBackFrame = 46;
    static hardFloorFrontFrame = 47;
    static easyFloorFrontFrame = 48;

    constructor(position, images, numEasyFloors, numHardFloors)
    {
        super(position, "FloorIndicator");
        this.floorHeight = 4;
        const hardFloorBack = new ObjectsSpritesheet(images.objects, 46);
        this.addChild(hardFloorBack);
        for (let idx = 0; idx < numHardFloors; idx++) {
            const hardFloorFront = new ObjectsSpritesheet(images.objects, 47);
            hardFloorFront.position = new Vector2(0, idx * this.floorHeight);
            this.addChild(hardFloorFront);
        }
        for (let idx = 0; idx < numEasyFloors; idx++) {
            const easyFloorFront = new ObjectsSpritesheet(images.objects, 48);
            easyFloorFront.position = new Vector2(0, (numHardFloors + idx) * this.floorHeight);
            this.addChild(easyFloorFront);
        }
        this.numEasyFloors = numEasyFloors;
        this.numHardFloors = numHardFloors;
        this.arrow = new ObjectsSpritesheet(images.objects, 45);
        this.addChild(this.arrow);
        this.indicateFloor(0);
    }

    indicateFloor(floorIdx)
    {
        if (floorIdx < this.numEasyFloors) {
            this.arrow.currFrameIndex = 45;
        } else {
            this.arrow.currFrameIndex = 44;
        }
        this.arrow.position.y = (this.numEasyFloors + this.numHardFloors - floorIdx - 1) * this.floorHeight;
    }
    
    update(deltaTimeMs)
    {
        this.updateChildren(deltaTimeMs);
    }

    draw(drawingContext)
    {
        this.drawChildren(drawingContext);
    }
}