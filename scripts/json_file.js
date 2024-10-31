export class JsonFile
{
    constructor(doc, parser, relPath, onLoaded)
    {
        this.onLoaded = onLoaded;
        this.parser = parser;
        this.httpRequest = new XMLHttpRequest();
        this.httpRequest.onreadystatechange = this.onreadystatechange;
        this.url = new URL(relPath, doc.baseURI);
        this.httpRequest.open('GET', this.url.href);
        this.httpRequest.send();
    }

    onreadystatechange = () =>
    {
        if (this.httpRequest.readyState === 4) {
            if (this.httpRequest.status === 200) {
                this.data = this.parser.parse(this.httpRequest.responseText);
                this.onLoaded();
            }
        }
    };
}