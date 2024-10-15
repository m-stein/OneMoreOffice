import './style.css';
import { Resources } from './resources.js';
import { GameEngine } from './game_engine.js';
import { GameObject } from './game_object.js';
import { Vector2 } from './vector_2.js';
import { Camera } from './camera.js';
import { Sprite } from './sprite.js';
import { OfficeLevel, Office } from './office_level.js';
import { IsometricFormation3 } from './isometric_formation.js';
import { Vector3 } from './vector_3.js';

class Main extends GameObject
{
    constructor()
    {
        super(new Vector2(0, 0), 'Main');
        this.resources = new Resources();
        this.canvas = document.querySelector('#gameCanvas');
        this.camera = new Camera(this.resources.imageRegistry.sky, this.canvas.width, this.canvas.height);
        this.officeLevel = new OfficeLevel(this.resources, new Vector2(200, 100));
        this.addChild(this.camera);
        this.addChild(this.officeLevel);
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