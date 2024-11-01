export class AudioFile
{
    constructor(htmlDocument, relPath, onLoaded)
    {
        this.onLoaded = onLoaded;
        this.htmlElement = htmlDocument.createElement("audio");
        this.htmlElement.src = relPath;
        this.htmlElement.addEventListener('canplaythrough', this.onCanPlayThrough);
        this.htmlElement.load();
        console.log("load " + relPath);
    }

    onCanPlayThrough = () =>
    {
        this.htmlElement.removeEventListener('canplaythrough', this.onCanPlayThrough);
        console.log("canplaythrough " + this.htmlElement.src);
        this.onLoaded(this);
    }
}