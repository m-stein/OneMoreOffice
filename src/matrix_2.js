export class Matrix2
{
    constructor() { }

    insert(object, at)
    {
        if (typeof this.array === 'undefined') {
            this.array = [];
        }
        if (typeof this.array[at.x] === 'undefined') {
            this.array[at.x] = [];
        }
        this.array[at.x][at.y] = object;
    }

    item(at)
    {
        if (typeof this.array === 'undefined') {
            return undefined;
        }
        if (typeof this.array[at.x] === 'undefined') {
            return undefined;
        }
        return this.array[at.x][at.y];
    }
}