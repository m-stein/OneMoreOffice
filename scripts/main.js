import { GameEngine } from './game_engine.js';
import { GameObject } from './game_object.js';
import { Vector2 } from './vector_2.js';
import { Camera } from './camera.js';
import { OfficeLevel } from './office_level.js';
import { Vector3 } from './vector_3.js';
import { Rectangle } from './rectangle.js';
import { Menu } from './menu.js';
import { JsonFile } from './json_file.js';
import { AudioFile } from './audio_file.js';
import { ImageFile } from './image_file.js';
import { removeFromArray } from './array_utilities.js';
import { createEnum } from './enum.js';
import { KeyCode } from './keycode.js';
import { SelectionFeedback } from './selection_feedback.js';
import { Office } from "./office.js";
import { OfficeObjects } from './office_objects.js';
import { randomIntInclusive } from './math.js';

class Main extends GameObject
{
    static numOfficeOptions = 4;
    static drawButtonAlphaMaps = false;
    static hoverAlphaThreshold = 128;
    static numLevelsPerDifficulty = 6;

    static State = createEnum({
        NoSelection: 0,
        SelectionRequested: 1,
        SelectionApplied: 2,
    });

    onMouseMove = (event) => { this.updateRawMousePosition(event); }

    updateRawMousePosition(event)
    {
        this.rawMouseX = event.clientX;
        this.rawMouseY = event.clientY;
        this.mousePositionOutdated = true;
    }

    onAssetLoaded = (asset) =>
    {
        removeFromArray(this.loadingAssets, asset);
        if (this.loadingAssets.length == 0) {
            this.onAllAssetsLoaded();
        }
    }

    startLoadingLevelAssets(levelId)
    {
        this.levelConfig = new JsonFile(
            this.window.document, this.jsonParser,
            this.rootPath + "/levels/difficulty_" + levelId.difficulty + "/" + levelId.index + ".json",
            this.onAssetLoaded
        );
        this.loadingAssets.push(this.levelConfig);
    }

    onKeyDown = (event) =>
    {
        if (event.keyCode == KeyCode.Escape && this.backgroundMusicPlaying) {
            this.menu.enabled = !this.menu.enabled;
        }
    }

    onMouseDown = (event) =>
    {
        if (this.menu.enabled) {
            this.updateRawMousePosition(event);
            this.mouseDownHandlers.forEach((handler) => { handler(); });
        } else {
            if (this.state == Main.State.SelectionApplied) {
                this.levelId.index = (this.levelId.index + 1) % Main.numLevelsPerDifficulty;
                this.startLoadingLevelAssets(this.levelId);
                this.onAllAssetsLoaded = () =>
                { 
                    this.unloadLevel();
                    this.loadLevel(this.levelConfig.data);
                }
                return;
            }
            if (this.state != Main.State.NoSelection) {
                return;
            }
            const canvasRect = this.canvas.getBoundingClientRect();
            const mousePosition = new Vector2(
                (event.clientX - canvasRect.left) * (this.canvas.width / canvasRect.width),
                (event.clientY - canvasRect.top) * (this.canvas.height / canvasRect.height)
            );
            this.officeOptions.forEach((office, idx) => {
                const officeBoundingRect = new Rectangle(
                    office.position.copy().add(office.boundingRect.position),
                    office.boundingRect.width,
                    office.boundingRect.height
                );
                if (officeBoundingRect.isInside(mousePosition)) {
                    const offset = mousePosition.copy().subtract(officeBoundingRect.position);
                    const imgData = office.alphaMap.getContext('2d').getImageData(offset.x, offset.y, 1, 1).data;
                    if (imgData[0] >= Main.hoverAlphaThreshold) {
                        this.selectedAnswerIdx = idx;
                        this.state = Main.State.SelectionRequested;
                        return;
                    }
                }
            });
        }
    }

    ensureBackgroundMusicPlaying()
    {
        if (this.backgroundMusicPlaying) {
            return;
        }
        const htmlElem = this.backgroundMusic.htmlElement;
        htmlElem.volume = 0.1;
        htmlElem.loop = true;
        htmlElem.play();
        this.backgroundMusicPlaying = true;
    }

    startNewGame = () =>
    {
        if (this.menu.enabled) {
            this.levelId = { difficulty: 0, index: Main.numLevelsPerDifficulty - 1 };
            this.startLoadingLevelAssets(this.levelId);
            this.onAllAssetsLoaded = () =>
            { 
                this.unloadLevel();
                this.loadLevel(this.levelConfig.data);
                this.ensureBackgroundMusicPlaying();
                this.menu.enabled = false;
            }
        }
    }

    constructor(mainWindow, jsonParser, configTagId, canvasTagId)
    {
        super(new Vector2(0, 0), 'Main');
        this.window = mainWindow;
        this.rootPath = this.window.document.getElementById(configTagId).getAttribute('rootPath');
        this.jsonParser = jsonParser;
        this.backgroundMusicPlaying = false;
        this.canvas = this.window.document.getElementById(canvasTagId);

        /* Initialize mouse position tracking */
        this.mouseDown = false;
        this.mousePosition = new Vector2(-1, -1);
        this.mousePositionOutdated = false;
        this.canvas.addEventListener("mousemove", this.onMouseMove);

        /* Initialize handling of mouse clicks */
        this.mouseDownHandlers = [];
        this.canvas.addEventListener("mousedown", this.onMouseDown);
        this.window.addEventListener('keydown', this.onKeyDown);

        /* Start loading common assets */
        this.loadingAssets = [];
        this.backgroundMusic = new AudioFile(this.window.document, this.rootPath + "/audio/poor_but_happy.ogg", this.onAssetLoaded);
        this.buttonHoverSound = new AudioFile(this.window.document, this.rootPath + "/audio/soft_keypress.ogg", this.onAssetLoaded);
        this.images = {
            desk: new ImageFile(this.window.document, this.rootPath + "/images/desk.png", this.onAssetLoaded),
            plant: new ImageFile(this.window.document, this.rootPath + "/images/plant.png", this.onAssetLoaded),
            floor: new ImageFile(this.window.document, this.rootPath + "/images/floor.png", this.onAssetLoaded),
            sky: new ImageFile(this.window.document, this.rootPath + "/images/sky.png", this.onAssetLoaded),
            machine: new ImageFile(this.window.document, this.rootPath + "/images/machine.png", this.onAssetLoaded),
            humanShadow: new ImageFile(this.window.document, this.rootPath + "/images/human_shadow.png", this.onAssetLoaded),
            tableCake: new ImageFile(this.window.document, this.rootPath + "/images/table_cake.png", this.onAssetLoaded),
        };
        /* Register images for male characters */
        for (let idx = 1; idx <= 12; idx++) {
            this.images["man" + idx] = new ImageFile(
                this.window.document,
                this.rootPath + "/images/men/M_" + idx.toString().padStart(2, '0') + ".png",
                this.onAssetLoaded);
        }
        /* Register images for female characters */
        for (let idx = 1; idx <= 12; idx++) {
            this.images["woman" + idx] = new ImageFile(
                this.window.document,
                this.rootPath + "/images/women/F_" + idx.toString().padStart(2, '0') + ".png",
                this.onAssetLoaded);
        }
        this.loadingAssets.push(this.backgroundMusic);
        this.loadingAssets.push(this.buttonHoverSound);
        Object.values(this.images).forEach((image) => { this.loadingAssets.push(image); });

        /* Start loading level-specific assets */
        this.levelId = { difficulty: 0, index: 3 };
        this.startLoadingLevelAssets(this.levelId);

        this.selectionFeedback = new SelectionFeedback(
            new Vector2(this.canvas.width / 2, 30),
            () => { return this.selectedAnswerIdx == this.correctAnswerIdx }
        );
        this.camera = new Camera(this.images.sky, this.canvas.width, this.canvas.height);
        this.gameEngine = new GameEngine
        ({
            rootGameObj: this,
            camera: this.camera,
            canvas: this.canvas,
            updatePeriodMs: 1000 / 60,
        });
        this.officeObjects = new OfficeObjects(this.images);
        this.onAllAssetsLoaded = () =>
        {
            this.buttonHoverSound.htmlElement.volume = 0.2;
            this.menu = new Menu(
                new Rectangle(new Vector2(0, 0), this.canvas.width, this.canvas.height),
                this.mousePosition, this.mouseDownHandlers, this.buttonHoverSound.htmlElement,
                this.startNewGame
            );
            this.loadLevel(this.levelConfig.data);
            this.gameEngine.start();
        }
    }

    unloadLevel()
    {
        this.removeAllChildren();
        this.selectionFeedback.enabled = false;
    }

    parseLevelSolutionConfig(objectsConfig, solutionConfig)
    {
        const Token = createEnum({
            Misc: 0,
            TileDescriptor: 1,
            VerticalSeparator: 2,
        });
        const solutionConfigStr = solutionConfig.join('\n');
        let officeCoord = new Vector2(0, 0);
        let tileCoord = new Vector2(0, 0);
        let currToken = Token.Misc
        for (const char of solutionConfigStr) {
            if (currToken == Token.VerticalSeparator) {
                if (char != '\n') {
                    continue;
                }
                officeCoord.x = 0;
                officeCoord.y++;
                tileCoord.x = 0;
                tileCoord.y = 0;
                currToken = Token.Misc;
                continue;
            }
            if (char == ' ') {
                if (currToken == Token.TileDescriptor) {
                    tileCoord.x++;
                    currToken = Token.Misc;
                }
                continue;
            }
            if (char == '|') {
                officeCoord.x++;
                tileCoord.x = 0;
                currToken = Token.Misc;
                continue;
            }
            if (char == '\n') {
                officeCoord.x = 0;
                tileCoord.x = 0;
                tileCoord.y++;
                currToken = Token.Misc;
                continue;
            }
            if (char == '-') {
                currToken = Token.VerticalSeparator;
                continue;
            }
            this.officeObjects.withNewObject(objectsConfig[char], (obj) => {
                const objCoord = new Vector3(tileCoord.x, tileCoord.y, 1);
                if (officeCoord.x < OfficeLevel.size - 1 ||
                    officeCoord.y < OfficeLevel.size - 1)
                {
                    this.officeLevel.offices.item(officeCoord).insert(obj, objCoord);

                } else if (officeCoord.x == OfficeLevel.size - 1 &&
                        officeCoord.y == OfficeLevel.size - 1)
                {
                    this.officeOptions[this.correctAnswerIdx].insert(obj, objCoord);

                } else {
                    console.warn("Warning: Malformed level config");
                }
            });
            currToken = Token.TileDescriptor;
        }
    }

    parseLevelBaddiesConfig(objectsConfig, baddiesConfig)
    {
        const Token = createEnum({
            Misc: 0,
            TileDescriptor: 1,
        });
        const baddiesConfigStr = baddiesConfig.join('\n');
        let officeIdx = 0;
        let tileCoord = new Vector2(0, 0);
        let currToken = Token.Misc
        for (const char of baddiesConfigStr) {
            if (officeIdx == this.correctAnswerIdx) {
                officeIdx++;
            }
            if (char == ' ') {
                if (currToken == Token.TileDescriptor) {
                    tileCoord.x++;
                    currToken = Token.Misc;
                }
                continue;
            }
            if (char == '|') {
                officeIdx++;
                tileCoord.x = 0;
                currToken = Token.Misc;
                continue;
            }
            if (char == '\n') {
                officeIdx = 0;
                tileCoord.x = 0;
                tileCoord.y++;
                currToken = Token.Misc;
                continue;
            }
            this.officeObjects.withNewObject(objectsConfig[char], (obj) => {
                this.officeOptions[officeIdx].insert(obj, new Vector3(tileCoord.x, tileCoord.y, 1));
            });
            currToken = Token.TileDescriptor;
        }
    }

    loadLevel(levelConfig)
    {
        this.correctAnswerIdx = randomIntInclusive(0, Main.numOfficeOptions - 1);
        this.state = Main.State.NoSelection;
        this.officeOptions = [];
        const officeMargin = 2;
        const officeLevelX = this.canvas.width / 2 - 2 * Office.tileIsoQuartWidth;
        const officeWidth = Office.tileIsoQuartWidth * 4 * Office.size;
        const officeOptionsWidth = Main.numOfficeOptions * officeWidth + (Main.numOfficeOptions - 1) * officeMargin;
        const officeOptionsX = officeLevelX + (Office.tileIsoQuartWidth * 2) - officeOptionsWidth / 2;
        const officeOffset = Office.tileIsoQuartWidth * 4 * Math.floor(Office.size / 2);
        for (let idx = 0; idx < Main.numOfficeOptions; idx++) {
            const office = new Office(new Vector2(officeOptionsX + idx * (officeWidth + officeMargin) + officeOffset, 230), this.images);
            this.officeOptions.push(office);
        }

        this.officeLevel = new OfficeLevel(this.images, new Vector2(officeLevelX, 50));
        this.parseLevelSolutionConfig(levelConfig.objects, levelConfig.solution);
        this.parseLevelBaddiesConfig(levelConfig.objects, levelConfig.baddies);
        this.officeOptions.forEach((office) => {
            office.createAlphaMap(this.window.document);
        });
        this.addChild(this.camera);
        this.addChild(this.officeLevel);
        this.officeOptions.forEach((office) => { this.addChild(office); });
        this.addChild(this.selectionFeedback);
        this.addChild(this.menu);
    }

    update(deltaTimeMs)
    {
        /* Update mouse position if necessary */
        if (this.mousePositionOutdated) {
            const canvasRect = this.canvas.getBoundingClientRect();
            this.mousePosition.x = (this.rawMouseX - canvasRect.left) * (this.canvas.width / canvasRect.width);
            this.mousePosition.y = (this.rawMouseY - canvasRect.top) * (this.canvas.height / canvasRect.height);
            this.mousePositionOutdated = false;
        }
        this.updateChildren(deltaTimeMs);
        if (this.state == Main.State.SelectionRequested) {
            this.selectOfficeOption(this.selectedAnswerIdx);
            this.selectionFeedback.enabled = true;
            this.state = Main.State.SelectionApplied;
        }
        this.camera.position = new Vector2(0,0);
    }

    selectOfficeOption(idx)
    {
        const office = this.officeOptions.splice(idx, 1)[0];
        this.removeChild(office);
        this.officeLevel.addMissingOffice(office);
    }

    draw(drawingContext)
    {
        this.drawChildren(drawingContext);
        if (Main.drawButtonAlphaMaps) {
            drawingContext.canvasContext.globalAlpha = 0.5;
            this.officeOptions.forEach((office) => {
                drawingContext.canvasContext.drawImage(
                    office.alphaMap,
                    office.position.x + office.boundingRect.position.x,
                    office.position.y + office.boundingRect.position.y);
            });
            drawingContext.canvasContext.globalAlpha = 1;
        }
    }
}

const main = new Main(window, JSON, 'mainScript', 'mainCanvas');