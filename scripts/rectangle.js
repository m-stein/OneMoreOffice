export class Rectangle
{
    constructor(position, width, height)
    {
        this.position = position;
        this.width = width;
        this.height = height;
    }

    isInside(position)
    {
        return position.x >= this.position.x &&
               position.x < this.position.x + this.width &&
               position.y >= this.position.y &&
               position.y < this.position.y + this.height;
    }
}