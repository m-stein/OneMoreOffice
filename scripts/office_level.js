import { IsometricFormation3 } from "./isometric_formation.js";
import { Matrix2 } from "./matrix_2.js";
import { Vector2 } from "./vector_2.js";
import { Vector3 } from "./vector_3.js";
import { Office } from "./office.js";

export class OfficeLevel extends IsometricFormation3
{
    static size = 3;
    static officeMargin = 2;
    static tileHeight = Office.tileHeight * OfficeLevel.size + OfficeLevel.officeMargin;
    static tileIsoQuartWidth = Office.tileIsoQuartWidth * OfficeLevel.size + OfficeLevel.officeMargin;

    constructor(images, position, objects)
    {
        super(position, "OfficeLevel", OfficeLevel.tileHeight, OfficeLevel.tileIsoQuartWidth);
        this.missingOfficePosition = new Vector3(OfficeLevel.size - 1, OfficeLevel.size - 1, 0);
        this.offices = new Matrix2();
        for (let y = 0; y < OfficeLevel.size; y++) {
            for (let x = 0; x < OfficeLevel.size; x++) {
                const officePosition = new Vector3(x, y, 0);
                if (officePosition.equals(this.missingOfficePosition)) {
                    continue;
                }
                const office = new Office(new Vector2(0, 0), images);
                this.insert(office, officePosition.copy());
                this.offices.insert(office, officePosition.to2d());
            }
        }
    }

    addMissingOffice(office)
    {    
        office.position = new Vector2(0, 0);
        this.insert(office, this.missingOfficePosition);
        this.offices.insert(office, this.missingOfficePosition.to2d());
    }

    update(deltaTimeMs) { this.updateChildren(deltaTimeMs); }

    draw(drawingContext) { this.drawChildren(drawingContext); }
}