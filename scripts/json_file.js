export class JsonFile
{
    constructor(htmlDocument, jsonParser, relPath, onLoaded)
    {
        this.relPath = relPath;
        this.onLoaded = onLoaded;
        this.jsonParser = jsonParser;
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
                this.data = this.jsonParser.parse(this.httpRequest.responseText);
                this.onLoaded(this);
            }
        }
    };
}