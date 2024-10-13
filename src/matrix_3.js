export class Matrix3
{
    constructor() { }

    insert(object, x, y, z)
    {
        if (typeof this.array === 'undefined') {
            this.array = [];
        }
        if (typeof this.array[x] === 'undefined') {
            this.array[x] = [];
        }
        if (typeof this.array[x][y] === 'undefined') {
            this.array[x][y] = [];
        }
        this.array[x][y][z] = object;
    }

    item(x, y, z)
    {
        if (typeof this.array === 'undefined') {
            return undefined;
        }
        if (typeof this.array[x] === 'undefined') {
            return undefined;
        }
        if (typeof this.array[x][y] === 'undefined') {
            return undefined;
        }
        return this.array[x][y][z];
    }
} 