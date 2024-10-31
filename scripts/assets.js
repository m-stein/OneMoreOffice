export class Assets
{
    constructor(onAllLoaded, level)
    {
        this.onAllLoaded = onAllLoaded;
        this.images = {
            desk: { src: "../sprites/desk.png" },
            plant: { src: "../sprites/plant.png" },
            floor: { src: "../sprites/floor.png" },
            sky: { src: "../sprites/sky.png" },
        };
        this.music = {
            poorButHappy: { src: "../music/poor_but_happy.ogg" },
            softKeyPress: { src: "../music/soft_keypress.ogg" },
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
        Object.values(this.music).forEach((asset) => {
            asset.isLoaded = false;
            asset.htmlElement = new Audio(asset.src);
            const onCanPlayThrough = (event) => {
                asset.htmlElement.removeEventListener('canplaythrough', onCanPlayThrough);
                asset.isLoaded = true;
                this.onAssetLoaded();
            }
            asset.htmlElement.addEventListener('canplaythrough', onCanPlayThrough);
            asset.htmlElement.load();
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
        Object.values(this.music).forEach(asset => {
            if (!asset.isLoaded) {
                allLoaded = false;
            }
        });
        if (allLoaded) {
            this.onAllLoaded();
        }
    }
};