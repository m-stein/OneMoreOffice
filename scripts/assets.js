export class Assets
{
    constructor(onAllLoaded)
    {
        this.htmlElement = {src: "assets"};
        this.onAllLoaded = onAllLoaded;
        this.images = {
            desk: { src: "../sprites/desk.png" },
            plant: { src: "../sprites/plant.png" },
            floor: { src: "../sprites/floor.png" },
            sky: { src: "../sprites/sky.png" },
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
            this.onAllLoaded(this);
        }
    }
};