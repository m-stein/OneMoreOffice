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

export function shuffleArray(array)
{
    let currentIndex = array.length;
    while (currentIndex != 0) {

        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] =
            [array[randomIndex], array[currentIndex]];
    }
}

export function cloneArray(array)
{
    return array.slice();
}