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

export function makeRandomSelection(availableItems, numItems)
{
    const selectedItems = [];
    const unselectedItems = cloneArray(availableItems);
    if (numItems > unselectedItems.length) {
        numItems = unselectedItems.length;
        console.error("Warning: Number of items to select is greater than number of available items");
    }
    while (selectedItems.length < numItems) {
        const idx = randomIntInclusive(0, unselectedItems.length - 1);
        selectedItems.push(unselectedItems[idx]);
        unselectedItems.splice(idx, 1);
    }
    return selectedItems;
}