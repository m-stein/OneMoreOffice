import { GameEngine } from './game_engine.js';
import { GameObject } from './game_object.js';
import { Vector2 } from './vector_2.js';
import { Camera } from './camera.js';
import { OfficeMatrix } from './office_matrix.js';
import { Vector3 } from './vector_3.js';
import { Rectangle } from './rectangle.js';
import { Menu } from './menu.js';
import { JsonFile } from './json_file.js';
import { AudioFile } from './audio_file.js';
import { ImageFile } from './image_file.js';
import { removeItem } from './array_utilities.js';
import { createEnum } from './enum.js';
import { KeyCode } from './keycode.js';
import { SelectionFeedback } from './selection_feedback.js';
import { Office } from "./office.js";
import { OfficeObjects } from './office_objects.js';
import { floorVec2, randomIntInclusive, rotateQuadrMatrix2CoordClockwise } from './math.js';
import { Credits } from './credits.js';
import { TextFile } from './text_file.js';
import { RunningGame } from './running_game.js';
import { GameOverScreen } from './game_over_screen.js';
import { MusicPlayer } from './music_player.js';
import { Server } from './server.js';

class Main extends GameObject
{
    static officeArraySize = 4;
    static drawButtonAlphaMaps = false;
    static hoverAlphaThreshold = 128;
    static availableLevels = [
        "1a", "1b",
        "2a", "2b",
        "3a", "3b",
        "11a", "11b",
        "12a", "12b",
        "13a", "13b",
        "14a", "14b",
        "15a", "15b",
        "16a", "16b",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11"
    ];
    static happyLofiCollection = [
        "poor_but_happy",
        "blue_skies",
        "new_shoes",
        "happy_but_a_little_off",
        "clouds",
        "letting_go_of_the_past",
    ];

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
        removeItem(this.loadingAssets, asset);
        if (this.loadingAssets.length == 0) {
            this.onAllAssetsLoaded();
        }
    }

    startLoadingLevelAssets(levelName)
    {
        this.levelConfig = new JsonFile(
            this.window.document, this.jsonParser,
            this.rootPath + "/levels/" + levelName + ".json",
            this.onAssetLoaded
        );
        this.loadingAssets.push(this.levelConfig);
    }

    onKeyDown = (event) =>
    {
        if (this.loadingAssets.length > 0 ||
            this.gameOverScreen.enabled)
        {
            return;
        }
        if (this.credits.enabled && event.keyCode == KeyCode.Escape) {
            this.credits.disable();
            this.menu.enable();
            return;
        }
        if (this.runningGame !== undefined && event.keyCode == KeyCode.Escape) {
            if (this.menu.enabled) {
                this.menu.disable();
                return;
            } else {
                this.menu.enable();
                return;
            }
        }
    }

    leaveCredits = () =>
    {
        this.menu.enable();
        this.credits.disable();
    }

    onMouseDown = (event) =>
    {
        if (this.loadingAssets.length > 0 ||
            this.credits.enabled)
        {
            return;
        }
        if (this.gameOverScreen.enabled) {
            this.runningGame = undefined;
            this.gameOverScreen.disable();
            this.menu.enable();
            return;
        }
        if (this.menu.enabled) {
            this.updateRawMousePosition(event);
            this.mouseDownHandlers.forEach((handler) => { handler(); });
        } else {
            if (this.state == Main.State.SelectionApplied) {
                this.runningGame.endLevel();
                if (!this.gameOverScreen.enabled) {
                    this.startLoadingLevelAssets(this.runningGame.currentLevelName());
                    this.onAllAssetsLoaded = () => {
                        this.unloadLevel();
                        this.loadLevel(this.levelConfig.data);
                    }
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
            this.officeArray.forEach((office, idx) => {
                const officeBoundingRect = new Rectangle(
                    office.position.copy().add(office.boundingRect.position),
                    office.boundingRect.width,
                    office.boundingRect.height
                );
                if (officeBoundingRect.isInside(mousePosition)) {
                    const offset = mousePosition.copy().subtract(officeBoundingRect.position);
                    const imgData = office.alphaMap.getContext('2d').getImageData(offset.x, offset.y, 1, 1).data;
                    if (imgData[0] >= Main.hoverAlphaThreshold) {
                        this.selectedOfficeIdx = idx;
                        this.selectionMousePosition = mousePosition;
                        this.state = Main.State.SelectionRequested;
                        return;
                    }
                }
            });
        }
    }

    startNewGame = () =>
    {
        if (this.menu.enabled) {
            this.runningGame = new RunningGame(this.onGameOver, Main.availableLevels);
            this.startLoadingLevelAssets(this.runningGame.currentLevelName());
            this.onAllAssetsLoaded = () =>
            { 
                this.unloadLevel();
                this.loadLevel(this.levelConfig.data);
                this.backgroundMusic.play();
                this.menu.enabled = false;
                this.env.logGameStart();
            }
        }
    }

    onGameOver = (points) =>
    {
        this.env.logGameEnd(points);
        this.gameOverScreen.enable(points);
        this.selectionFeedback.disable();
    }

    showCredits = () =>
    {
        if (this.menu.enabled) {
            this.backgroundMusic.play();
            this.menu.enabled = false;
            this.credits.enable();
        }
    }

    constructor(mainWindow, jsonParser, scriptElemId)
    {
        super(new Vector2(0, 0), 'Main');
        const scriptElem = mainWindow.document.getElementById(scriptElemId);
        this.window = mainWindow;
        this.env = new Server(Server.Type[scriptElem.getAttribute('serverType')]);
        this.rootPath = scriptElem.getAttribute('rootPath');
        this.jsonParser = jsonParser;
        this.canvas = this.window.document.getElementById(scriptElem.getAttribute('canvasId'));
        this.canvasRect = new Rectangle(new Vector2(0, 0), this.canvas.width, this.canvas.height);
        this.backgroundMusic = new MusicPlayer();

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
        this.backgroundMusicFiles = [];
        Main.happyLofiCollection.forEach((name) => {
            this.backgroundMusicFiles.push(new AudioFile(
                this.window.document, this.rootPath + "/audio/happy_lofi_collection/" + name + ".ogg", this.onAssetLoaded));
        });
        this.buttonHoverSound = new AudioFile(this.window.document, this.rootPath + "/audio/soft_keypress.ogg", this.onAssetLoaded);
        this.images = {
            sky: new ImageFile(this.window.document, this.rootPath + "/images/sky.png", this.onAssetLoaded),
            objects: new ImageFile(this.window.document, this.rootPath + "/images/objects.png", this.onAssetLoaded),
        };
        this.readme = new TextFile(this.window.document, this.rootPath + "/readme.md", this.onAssetLoaded);

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
        this.loadingAssets.push(...this.backgroundMusicFiles);
        this.loadingAssets.push(this.buttonHoverSound);
        this.loadingAssets.push(this.readme);
        Object.values(this.images).forEach((image) => { this.loadingAssets.push(image); });

        this.startLoadingLevelAssets("title_background");
        this.selectionFeedback = new SelectionFeedback(new Vector2(this.canvas.width / 2, 30));
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
                this.canvasRect,
                this.mousePosition, this.mouseDownHandlers, this.buttonHoverSound.htmlElement,
                this.startNewGame,
                this.showCredits
            );
            this.credits = new Credits(
                this.canvasRect,
                this.leaveCredits,
                this.readme.text.split('## Credits')[1] // remove everything that preceeds the credits body
                                .replace(/\\/g, "") // remove markdown line-breaks
                                .replace(/\[/g, "").replace(/\](.*)/g, "") // of each link keep only the label
                                .split(/\r?\n/) // create array of lines
                                .splice(2) // remove first two lines as they are expected to be empty
            );
            this.gameOverScreen = new GameOverScreen(this.canvasRect);
            this.loadLevel(this.levelConfig.data);
            this.gameEngine.start();
            this.backgroundMusicFiles.forEach((file) => { this.backgroundMusic.addItem(file.htmlElement); });
        }
    }

    unloadLevel()
    {
        this.removeAllChildren();
        this.selectionFeedback.disable();
    }

    parseLevelSolutionConfig(objectsConfig, solutionConfig, numRotations)
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
            const rotatedOfficeCoord =
                rotateQuadrMatrix2CoordClockwise(officeCoord, OfficeMatrix.size, numRotations);

            this.officeObjects.withNewObject(objectsConfig[char], numRotations, (obj) => {

                const rotatedTileCoord =
                    rotateQuadrMatrix2CoordClockwise(tileCoord, Office.size, numRotations);

                const objCoord = new Vector3(rotatedTileCoord.x, rotatedTileCoord.y, 1);
                if (officeCoord.x < OfficeMatrix.size - 1 ||
                    officeCoord.y < OfficeMatrix.size - 1)
                {
                    this.officeLevel.offices.item(rotatedOfficeCoord).insert(obj, objCoord);
                } else if (
                    officeCoord.x == OfficeMatrix.size - 1 &&
                    officeCoord.y == OfficeMatrix.size - 1)
                {
                    this.officeArray[this.correctOfficeIdx].insert(obj, objCoord);

                } else {
                    console.warn("Warning: Malformed level config");
                }
            });
            currToken = Token.TileDescriptor;
        }
    }

    parseLevelBaddiesConfig(objectsConfig, baddiesConfig, numRotations)
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
            if (officeIdx == this.correctOfficeIdx) {
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
            this.officeObjects.withNewObject(objectsConfig[char], numRotations, (obj) => {

                const rotatedTileCoord =
                    rotateQuadrMatrix2CoordClockwise(tileCoord, Office.size, numRotations);

                this.officeArray[officeIdx].insert(
                    obj, new Vector3(rotatedTileCoord.x, rotatedTileCoord.y, 1));
            });
            currToken = Token.TileDescriptor;
        }
    }

    loadLevel(levelConfig)
    {
        this.correctOfficeIdx = randomIntInclusive(0, Main.officeArraySize - 1);
        this.state = Main.State.NoSelection;
        this.officeArray = [];
        const officeMargin = 2;
        const officeLevelX = this.canvas.width / 2 - 2 * Office.tileIsoQuartWidth;
        const officeWidth = Office.tileIsoQuartWidth * 4 * Office.size;
        const officeArrayWidth = Main.officeArraySize * officeWidth + (Main.officeArraySize - 1) * officeMargin;
        const officeArrayX = officeLevelX + (Office.tileIsoQuartWidth * 2) - officeArrayWidth / 2;
        const officeOffset = Office.tileIsoQuartWidth * 4 * Math.floor(Office.size / 2);
        for (let idx = 0; idx < Main.officeArraySize; idx++) {
            const office = new Office(new Vector2(officeArrayX + idx * (officeWidth + officeMargin) + officeOffset, 230), this.images);
            this.officeArray.push(office);
        }

        const numRotations = randomIntInclusive(0, 3);
        this.officeLevel = new OfficeMatrix(this.images, new Vector2(officeLevelX, 50), numRotations);
        this.parseLevelSolutionConfig(levelConfig.objects, levelConfig.solution, numRotations);
        this.parseLevelBaddiesConfig(levelConfig.objects, levelConfig.baddies, numRotations);
        this.officeArray.forEach((office) => {
            office.createAlphaMap(this.window.document);
        });
        this.addChild(this.camera);
        this.addChild(this.officeLevel);
        this.officeArray.forEach((office) => { this.addChild(office); });
        this.addChild(this.selectionFeedback);
        this.addChild(this.menu);
        this.addChild(this.credits);
        this.addChild(this.gameOverScreen);
        if (this.runningGame !== undefined) {
            this.addChild(this.runningGame);
        }
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
            this.selectOffice(this.selectedOfficeIdx);
            this.selectionFeedback.enable(
                this.selectedOfficeIdx == this.correctOfficeIdx,
                this.runningGame.obtainPoints(this.selectedOfficeIdx == this.correctOfficeIdx),
                floorVec2(this.selectionMousePosition)
            );
            this.state = Main.State.SelectionApplied;
        }
        this.camera.position = new Vector2(0,0);
    }

    selectOffice(idx)
    {
        const office = this.officeArray.splice(idx, 1)[0];
        this.removeChild(office);
        this.officeLevel.addMissingOffice(office);
    }

    draw(drawingContext)
    {
        this.drawChildren(drawingContext);
        if (Main.drawButtonAlphaMaps) {
            drawingContext.canvasContext.globalAlpha = 0.5;
            this.officeArray.forEach((office) => {
                drawingContext.canvasContext.drawImage(
                    office.alphaMap,
                    office.position.x + office.boundingRect.position.x,
                    office.position.y + office.boundingRect.position.y);
            });
            drawingContext.canvasContext.globalAlpha = 1;
        }
    }
}

const main = new Main(window, JSON, 'mainScript');