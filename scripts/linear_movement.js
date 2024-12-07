import { lerpVec2, clamp } from './math.js'

export class LinearMovement
{
    constructor(position)
    {
        this.jumpTo(position);
    }

    update(deltaTimeMs)
    {
        if (this.arrived)
            return;

        let amountOfDist = clamp(this.speed * deltaTimeMs, 0, 1);
        if (this.amountOfDistTraveled < 1 - amountOfDist) {
            this.amountOfDistTraveled += amountOfDist;
            this.at = lerpVec2(this.from, this.to, this.amountOfDistTraveled);
        } else {
            this.at = this.to.copy();
            this.arrived = true;
        }
    }

    jumpTo(position)
    {
        this.speed = 0.0;
        this.from = position.copy();
        this.to = position.copy();
        this.at = position.copy();
        this.amountOfDistTraveled = 0.0;
        this.arrived = true;
    }

    startMovingTowards(to, speed)
    {
        this.speed = speed;
        this.from = this.at.copy();
        this.to = to.copy();
        this.amountOfDistTraveled = 0;
        this.arrived = false;
    }
}