import { IsometricFormation3 } from "./isometric_formation.js";
import { Matrix2 } from "./matrix_2.js";
import { Vector2 } from "./vector_2.js";
import { Vector3 } from "./vector_3.js";
import { Office } from "./office.js";
import { rotateQuadrMatrix2CoordClockwise } from "./math.js";

export class OfficeMatrix extends IsometricFormation3
{
    static size = 3;
    static officeMargin = 2;
    static tileHeight = Office.tileHeight * OfficeMatrix.size + OfficeMatrix.officeMargin;
    static tileIsoQuartWidth = Office.tileIsoQuartWidth * OfficeMatrix.size + OfficeMatrix.officeMargin;

    constructor(images, position, numRotations)
    {
        super(position, "OfficeLevel", OfficeMatrix.tileHeight, OfficeMatrix.tileIsoQuartWidth);
        const v1 = new Vector2(OfficeMatrix.size - 1, OfficeMatrix.size - 1);
        const v2 = rotateQuadrMatrix2CoordClockwise(v1, OfficeMatrix.size, numRotations);
        this.missingOfficePosition = new Vector3(v2.x, v2.y, 0);
        this.offices = new Matrix2();
        for (let y = 0; y < OfficeMatrix.size; y++) {
            for (let x = 0; x < OfficeMatrix.size; x++) {
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