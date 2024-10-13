import './style.css';
import { Resources } from './resources.js';
import { GameEngine } from './game_engine.js';
import { GameObject } from './game_object.js';
import { Vector2 } from './vector_2.js';
import { Camera } from './camera.js';
import { Sprite } from './sprite.js';
import { LevelFloor, OfficeFloor } from './floor.js';

class Main extends GameObject
{
    constructor()
    {
        super(new Vector2(0, 0), 'Main');
        this.resources = new Resources();
        this.canvas = document.querySelector('#gameCanvas');
        this.camera = new Camera(this.resources.imageRegistry.sky, this.canvas.width, this.canvas.height);
        this.levelFloor = new LevelFloor(this.resources, new Vector2(200, 100), 3);
        this.plantPositions = [
            { office: [2, 1], tile: [0, 0] },
            { office: [2, 1], tile: [0, 1] },
            { office: [0, 2], tile: [2, 1] },
        ];
        this.plants = [];
        this.plantPositions.forEach((plantPos) => {
            this.plants.push(
                new Sprite({
                    sourceImage: this.resources.imageRegistry.plant,
                    position: this.levelFloor.tilePosition(plantPos.office, plantPos.tile).add([0, -12]),
                })
            );
        });
        this.addChild(this.camera);
        this.addChild(this.levelFloor);
        this.plants.forEach((plant) => {
            this.addChild(plant);
        });
        this.gameEngine = new GameEngine
        ({
            rootGameObj: this,
            camera: this.camera,
            canvas: this.canvas,
            updatePeriodMs: 1000 / 60
        });
        this.gameEngine.start();
    }

    update(deltaTimeMs)
    {
        this.updateChildren(deltaTimeMs);
        this.camera.position = new Vector2(0,0);
    }

    draw(drawingContext)
    {
        this.drawChildren(drawingContext);
        /*
        this.levelFloor.tileMap.map.forEach((officeRow, row0) => {
            officeRow.forEach((office, col0) => {

                let pos0 = this.levelFloor.position.copy().add(office.position).add([10, 6]);
                drawingContext.canvasContext.fillStyle = "rgba(255, 255, 255, 0.6)";
                drawingContext.drawText(row0 + "." + col0, pos0);
                drawingContext.canvasContext.fillStyle = "rgba(255, 255, 255, 0.3)";

                
                office.tileMap.map.forEach((tileRow, row1) => {
                    tileRow.forEach((tile, col1) => {

                        let pos1 = this.levelFloor.position.copy().add(office.position).add(tile.position).add([10, 16]);
                        drawingContext.drawText(row1 + "." + col1, pos1);
                    });
                });
            });
        });
        */
    }
}

const main = new Main();