import { GameObject } from "./game_object";
import { Matrix3 } from "./matrix_3";
import { Sprite } from "./sprite";
import { Vector2 } from "./vector_2";

export class Tile
{
    constructor(position, row, col)
    {
        this.position = position;
        this.row = row;
        this.col = col;
    }
}

export class TiledRectangle
{
    constructor(tileWidth, tileHeight, size)
    {
        this.size = size;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.tiles = [];
        const screenRowsOff = new Vector2(this.tileWidth / 2, this.tileHeight / 2);
        const numScreenRows = size * 2 - 1;
        let matrixRow = 0;
        let matrixCol = 0;
        let screenRowPos = new Vector2(0, 0);
        let tilePos = screenRowPos.copy();
        let numCols = 1;
        for (let screenRow = 0; screenRow < numScreenRows; screenRow++) {
            for (let screenCol = 0; screenCol < numCols; screenCol++) {
                this.tiles.push(new Tile(tilePos.copy(), matrixRow, matrixCol));
                tilePos.x += this.tileWidth;
                matrixCol++;
                matrixRow--;
            }
            if (screenRow < (numScreenRows - 1) / 2) {
                numCols++;
                screenRowPos.x -= screenRowsOff.x;
                matrixRow = matrixCol;
                matrixCol = 0;
            } else {
                numCols--;
                screenRowPos.x += screenRowsOff.x;
                matrixRow = size - 1;
                matrixCol = size - numCols;
            }
            screenRowPos.y += screenRowsOff.y;
            tilePos = screenRowPos.copy();
        }
    }
}

export class FloorTile extends Sprite
{
    constructor(tile, image)
    {
        super({sourceImage: image, position: tile.position });
        this.tile = tile;
    }
}

export class OfficeFloor extends GameObject
{
    constructor(tile, image, tileWidth, tileHeight, size)
    {

        super(tile.position, "OfficeFloor");
        this.tileMap = new Matrix3();
        this.tiledRect = new TiledRectangle(tileWidth, tileHeight, size);
        this.tiles = [];
        this.tiledRect.tiles.forEach((tile) => {
            let floorTile = new FloorTile(tile, image);
            this.tiles.push(floorTile);
            this.tileMap.insert(floorTile, tile.row, tile.col, 0);
        });
        this.tiles.forEach((tile) => {
            this.addChild(tile);
        });
        this.tile = tile;
    }

    update(deltaTimeMs)
    {
        this.updateChildren(deltaTimeMs);
    }

    draw(drawingContext)
    {
        this.drawChildren(drawingContext);
    }
}

export class LevelFloor extends GameObject
{
    constructor(resources, position, size)
    {
        super(position, "LevelFloor")
        this.officeSize = 3;
        this.size = size;
        this.tileMap = new Matrix3();
        this.floorTileWidth = 32;
        this.floorTileHeight = 16;
        this.officeMargin = 6;

        this.tiledRect = new TiledRectangle(
            this.floorTileWidth * this.officeSize + this.officeMargin,
            this.floorTileHeight * this.officeSize + this.officeMargin, 3);

        this.offices = [];
        this.tiledRect.tiles.forEach((tile) => {
            let office = new OfficeFloor(
                tile, resources.imageRegistry.floor, this.floorTileWidth, this.floorTileHeight,
                this.officeSize);

            this.offices.push(office);
            this.tileMap.insert(office, tile.row, tile.col, 0);
        });
        this.offices.forEach((office) => {
            this.addChild(office);
        });
    }

    tilePosition(office, tile)
    {
        const officeTile = this.tileMap.item(office[0], office[1], 0);
        const floorTile = officeTile.tileMap.item(tile[0], tile[1], 0);
        return this.position.copy().add(officeTile.position).add(floorTile.position);
    }

    update(deltaTimeMs)
    {
        this.updateChildren(deltaTimeMs);
    }

    draw(drawingContext)
    {
        this.drawChildren(drawingContext);
    }
}