export class FontStyle
{
    constructor(size, lineHeight, topMargin, alpha)
    {
        this.size = size;
        this.lineHeight = lineHeight;
        this.topMargin = topMargin;
        this.alpha = alpha;
    }
}

export class FontStyles
{
    constructor()
    {
        this.normal = new FontStyle(14, 16, 0, 0.8);
        this.h3 = new FontStyle(14, 16, 0, 1);
        this.h2 = new FontStyle(18, 20, 32, 1);
        this.h1 = new FontStyle(26, 28, 72, 1);
    }
}