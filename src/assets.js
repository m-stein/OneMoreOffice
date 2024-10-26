export class Assets
{
    constructor(onAllLoaded, level)
    {
        this.onAllLoaded = onAllLoaded;
        this.images = {
            desk: { src: "../public/sprites/desk.png" },
            plant: { src: "../public/sprites/plant.png" },
            floor: { src: "../public/sprites/floor.png" },
            sky: { src: "../public/sprites/sky.png" },
        };
        this.json = {
            level: { src: "../public/levels/difficulty_" + level.difficulty + "/" + level.index + ".json" },
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
        Object.values(this.json).forEach((asset) => {
            asset.isLoaded = false;
            asset.httpRequest = new XMLHttpRequest();
            asset.httpRequest.onreadystatechange = () => {
                if (asset.httpRequest.readyState === 4) {
                    if (asset.httpRequest.status === 200) {
                        asset.data = JSON.parse(asset.httpRequest.responseText);
                        asset.isLoaded = true;
                        this.onAssetLoaded();
                    }
                }
            };
            asset.url = new URL(asset.src, document.baseURI);
            asset.httpRequest.open('GET', asset.url.href);
            asset.httpRequest.send();
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
        Object.values(this.json).forEach(asset => {
            if (!asset.isLoaded) {
                allLoaded = false;
            }
        });
        if (allLoaded) {
            this.onAllLoaded();
        }
    }
};