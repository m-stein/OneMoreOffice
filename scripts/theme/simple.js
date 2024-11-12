import { Sprite } from "../sprite.js";
import { Vector2 } from "../vector_2.js";

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

export class SimpleTheme
{
    static withNewOfficeObject(images)
    {
        return (id, lambda) => {
            switch (id) {
                case 1: lambda(new Plant(images)); break;
                case 2: lambda(new Desk(images)); break;
                case 'p': lambda(new Plant(images)); break;
                case 'd': lambda(new Desk(images)); break;
            }
        }
    }
}