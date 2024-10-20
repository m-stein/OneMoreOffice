import { Vector2 } from "./vector_2";

export class Vector3
{
    constructor(x, y, z)
    {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    copy()
    {
        return new Vector3(this.x, this.y, this.z);
    }

    equals(other)
    {
        return this.x == other.x && this.y == other.y && this.z == other.z;
    }

    add(other)
    {
        if (other instanceof Array) {
            this.x += other[0];
            this.y += other[1];
            this.z += other[2];
        } else {
            this.x += other.x;
            this.y += other.y;
            this.z += other.z;
        }
        return this;
    }

    to2d()
    {
        return new Vector2(this.x, this.y);
    }
    
    negate()
    {
        return new Vector3(-this.x, -this.y, -this.z);
    }
}