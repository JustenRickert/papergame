/*-*-mode:typescript-*-*/
class Player {
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

class UnitCard {
    circle: Circle;
    behavior: Behavior[];
    experience: number;

    constructor(circle: Circle, ...behavior: Behavior[]) {
        this.circle = circle;
        this.behavior = behavior;
        this.experience = 0;
    }
}
