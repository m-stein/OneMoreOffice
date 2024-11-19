import { randomIntInclusive } from "./math.js";

export function removeFromArray(array, item)
{
    const index = array.indexOf(item);
    if (index < 0) {
        return;
    }
    array.splice(index, 1);
}

export function getRandomItem(array)
{
    return array[randomIntInclusive(0, array.length - 1)];
}