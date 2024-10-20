export class Resources
{
    constructor(onAllLoaded)
    {
        this.onAllLoaded = onAllLoaded;
        this.imageRegistry = {
            desk: { src: "/sprites/desk.png" },
            plant: { src: "/sprites/plant.png" },
            floor: { src: "/sprites/floor.png" },
            sky: { src: "/sprites/sky.png" },
        };
        Object.values(this.imageRegistry).forEach(entry => {
            entry.image = new Image();
            entry.isLoaded = false;
            entry.image.onload = () => {
                entry.isLoaded = true;
                let allLoaded = true;
                Object.values(this.imageRegistry).forEach(otherEntry => {
                    if (!otherEntry.isLoaded) {
                        allLoaded = false;
                    }
                });
                if (allLoaded) {
                    onAllLoaded();
                }
            };
            entry.image.src = entry.src;
        });
    }
};