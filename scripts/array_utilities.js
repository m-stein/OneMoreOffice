import { randomIntInclusive } from "./math.js";

export function removeItem(array, item)
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
        console.warn("Warning: Number of items to select is greater than number of available items");
    }
    while (selectedItems.length < numItems) {
        const idx = randomIntInclusive(0, unselectedItems.length - 1);
        selectedItems.push(unselectedItems[idx]);
        unselectedItems.splice(idx, 1);
    }
    return selectedItems;
}