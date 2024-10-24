import { Matrix2 } from "./matrix_2.js";
import { Vector2 } from "./vector_2.js";

export class LevelDatabase
{
    constructor()
    {
        this.db = new Matrix2();
        this.addLevel(0, 0, {
            "solution": [
                [0,2,0], [2,0,0], [0,0,0],
                [0,1,0], [0,1,0], [2,1,0],
                [0,0,0], [0,0,0], [0,0,0],
    
                [0,0,0], [0,0,0], [0,0,2],
                [0,1,0], [0,1,2], [0,1,0],
                [0,0,2], [0,0,0], [0,0,0],
                
                [0,0,0], [0,0,0], [0,0,0],
                [2,1,0], [0,1,0], [0,1,0],
                [0,0,0], [2,0,0], [0,2,0],
            ],
            "baddies": [
                [0,0,0], [2,0,0], [0,0,2],
                [0,1,0], [0,1,0], [0,1,0],
                [0,0,2], [0,0,0], [0,0,0],
            ]
        });
        this.addLevel(0, 1, {
            "solution": [
                [2,0,1], [2,0,1], [2,0,1],
                [0,0,0], [2,0,1], [0,0,0],
                [2,0,1], [2,0,0], [2,0,0],
    
                [2,0,0], [0,0,1], [0,0,0],
                [2,0,1], [2,0,1], [2,0,1],
                [0,0,1], [0,0,1], [2,0,1],
                
                [2,0,1], [0,0,0], [0,0,0],
                [0,0,1], [2,0,1], [0,0,1],
                [0,0,0], [0,0,1], [2,0,0],
            ],
            "baddies": [
                [0,0,1], [0,0,1], [2,0,1],
                [0,0,0], [0,0,1], [0,0,0],
                [2,0,1], [2,0,0], [0,0,1],
            ]
        });
    }

    addLevel(degree, index, config)
    {
        this.db.insert(config, new Vector2(degree, index));
    }

    withLevel(degree, index, fn)
    {
        fn(this.db.item(new Vector2(degree, index)));
    }
}