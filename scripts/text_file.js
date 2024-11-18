export class TextFile
{
    constructor(htmlDocument, relPath, onLoaded)
    {
        this.relPath = relPath;
        this.onLoaded = onLoaded;
        this.httpRequest = new XMLHttpRequest();
        this.httpRequest.onreadystatechange = this.onReadyStateChange;
        this.url = new URL(relPath, htmlDocument.baseURI);
        this.httpRequest.open('GET', this.url.href);
        this.httpRequest.send();
    }

    onReadyStateChange = () =>
    {
        if (this.httpRequest.readyState === 4) {
            if (this.httpRequest.status === 200) {
                this.text = this.httpRequest.responseText;
                this.onLoaded(this);
            }
        }
    };
}