/*-*-mode:typescript-*-*/

import { Circle } from './circle'
import { Behavior } from './behavior'

export class Player {
    units: UnitCard[];
    circle: Circle[];

    constructor(units: UnitCard[]) {
        this.units = units;
        this.circle = this.circles();
    }

    circles = (): Circle[] => {
        let circles: Circle[] = [];
        this.units.forEach((u) => circles.push(u.circle));
        return circles;
    }
}

export class UnitCard {
    circle: Circle;
    behavior: Behavior[];
    experience: number;

    constructor(circle: Circle, ...behavior: Behavior[]) {
        this.circle = circle;
        this.behavior = behavior;
        this.experience = 0;
    }
}
