export class Assets
{
    constructor(onAllLoaded)
    {
        this.onAllLoaded = onAllLoaded;
        this.images = {
            desk: { src: "../public/sprites/desk.png" },
            plant: { src: "../public/sprites/plant.png" },
            floor: { src: "../public/sprites/floor.png" },
            sky: { src: "../public/sprites/sky.png" },
        };
        Object.values(this.images).forEach((asset) => {
            asset.isLoaded = false;
            asset.htmlElement = document.createElement("img");
            asset.htmlElement.onload = () => {
                asset.isLoaded = true;
                this.onAssetLoaded();
            };
            asset.htmlElement.src = asset.src;
        });
    }

    onAssetLoaded()
    {    
        let allLoaded = true;
        Object.values(this.images).forEach(asset => {
            if (!asset.isLoaded) {
                allLoaded = false;
            }
        });
        if (allLoaded) {
            this.onAllLoaded();
        }
    }
};