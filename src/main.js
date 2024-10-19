import './style.css';
import { Resources } from './resources.js';
import { GameEngine } from './game_engine.js';
import { GameObject } from './game_object.js';
import { Vector2 } from './vector_2.js';
import { Camera } from './camera.js';
import { OfficeLevel, Office, Desk, Plant } from './office_level.js';
import { Vector3 } from './vector_3.js';

function randomIntInclusive(min, max)
{
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}

class Main extends GameObject
{
    static numOfficeOptions = 4;

    onMouseDown = (event) =>
    {
        let rect = this.canvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        console.log("MouseDown at: (" + x + ", " + y + ")");
    }

    constructor()
    {
        super(new Vector2(0, 0), 'Main');
        this.resources = new Resources();
        this.canvas = document.querySelector('#gameCanvas');
        this.camera = new Camera(this.resources.imageRegistry.sky, this.canvas.width, this.canvas.height);
        this.officeLevelObjects = [];
        this.officeOptionsObjects = [];
 
        this.canvas.addEventListener("mousedown", this.onMouseDown);

        this.levelConfig = {
            "solution": [
                [1,0,0], [0,0,0], [0,0,0],
                [0,1,0], [0,2,0], [0,0,0],
                [2,0,0], [0,0,2], [0,0,1],
    
                [0,0,0], [0,0,0], [0,0,0],
                [0,0,0], [0,2,1], [0,0,0],
                [0,0,0], [0,0,1], [0,0,2],
                
                [0,1,0], [0,0,0], [1,1,0],
                [2,0,0], [0,0,0], [0,2,0],
                [2,0,0], [0,0,2], [0,1,1],
            ],
            "baddies": [
                [0,1,0], [1,0,0], [0,0,0],
                [0,1,0], [0,1,0], [1,1,1],
                [0,1,0], [0,0,1], [0,0,0],
            ]
        };

        const correctAnswerIdx = randomIntInclusive(0, Main.numOfficeOptions - 1);
        let officeX = 0;
        this.levelConfig["solution"].forEach((outerItem, outerIdx) => {
            outerItem.forEach((innerItem, innerIdx) => {
                if (innerItem == 0) {
                    return;
                }
                const y = Math.floor(outerIdx / OfficeLevel.size);
                const tileY = y % OfficeLevel.size;
                const officeY = Math.floor(y / OfficeLevel.size);
                if (officeX < OfficeLevel.size - 1 ||
                    officeY < OfficeLevel.size - 1)
                {
                    switch (innerItem) {
                        case 1: this.officeLevelObjects.push([ "plant", officeX, officeY, innerIdx, tileY ]); break;
                        case 2: this.officeLevelObjects.push([ "desk", officeX, officeY, innerIdx, tileY ]); break;
                    }
                } else if (officeX == OfficeLevel.size - 1 &&
                           officeY == OfficeLevel.size - 1)
                {
                    switch (innerItem) {
                        case 1: this.officeOptionsObjects.push([ "plant", correctAnswerIdx, innerIdx, tileY ]); break;
                        case 2: this.officeOptionsObjects.push([ "desk", correctAnswerIdx, innerIdx, tileY ]); break;
                    }
                } else {
                    console.log("Warning: Malformed level config!");
                }
            });
            officeX = (officeX + 1) % OfficeLevel.size;
        });
        const officeLevelX = 200;
        this.officeLevel = new OfficeLevel(this.resources, new Vector2(officeLevelX, 50), this.officeLevelObjects);

        this.officeOptions = [];
        const officeMargin = 2;
        const officeWidth = Office.tileIsoQuartWidth * 4 * Office.size;
        const officeOptionsWidth = Main.numOfficeOptions * officeWidth + (Main.numOfficeOptions - 1) * officeMargin;
        const officeOptionsX = officeLevelX + (Office.tileIsoQuartWidth * 2) - officeOptionsWidth / 2;
        const officeOffset = Office.tileIsoQuartWidth * 4 * Math.floor(Office.size / 2);
        for (let i = 0; i < Main.numOfficeOptions; i++) {
            const office = new Office(new Vector2(officeOptionsX + i * (officeWidth + officeMargin) + officeOffset, 230), this.resources);
            this.officeOptions.push(office);
        }
        const numBaddies = Main.numOfficeOptions - 1;
        this.baddieConfigs = [];
        this.levelConfig["baddies"].forEach((item, idx) => {
            if (typeof this.baddieConfigs[idx % numBaddies] === "undefined") {
                this.baddieConfigs[idx] = [];
            }
            this.baddieConfigs[idx % numBaddies].push(item);
        });
        
        let officeIdx = correctAnswerIdx == 0 ? 1 : 0;
        this.baddieConfigs.forEach((baddie) => {
            baddie.forEach((row, y) => {
                row.forEach((cell, x) => {
                    switch (cell) {
                        case 1: this.officeOptionsObjects.push([ "plant", officeIdx, x, y ]); break;
                        case 2: this.officeOptionsObjects.push([ "desk", officeIdx, x, y ]); break;
                    }
                });
            });
            officeIdx++;
            if (officeIdx == correctAnswerIdx) {
                officeIdx++;
            }
        });
        this.officeOptionsObjects.forEach((obj) => {
            switch(obj[0]) {
                case "plant":
                    this.officeOptions[obj[1]].insert(new Plant(this.resources), new Vector3(obj[2], obj[3], 1));
                    break;
                case "desk":
                    this.officeOptions[obj[1]].insert(new Desk(this.resources), new Vector3(obj[2], obj[3], 1));
                    break;
            }
        });
        this.addChild(this.camera);
        this.addChild(this.officeLevel);
        this.officeOptions.forEach((office) => { this.addChild(office); });
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