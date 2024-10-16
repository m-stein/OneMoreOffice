export class Resources
{
    constructor()
    {
        this.imageRegistry = {
            desk: { src: "/sprites/desk.png" },
            plant: { src: "/sprites/plant.png" },
            floor: { src: "/sprites/floor.png" },
            sky: { src: "/sprites/sky.png" },
        };
        Object.values(this.imageRegistry).forEach(entry => {
            entry.image = new Image();
            entry.isLoaded = false;
            entry.image.onload = () => { entry.isLoaded = true; };
            entry.image.src = entry.src;
        });
    }
};