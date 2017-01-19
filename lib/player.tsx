/*-*-mode:typescript-*-*/
class Player {

    redCircles: Circle[] = [];
    blueCircles: Circle[] = [];
    circles: Circle[];

    constructor() {
        for (let i = 0; i < 30; i++) {
            this.redCircles.push(new RedCircle(i));
            this.redCircles[i].position(40, 40);
        }
        for (let i = 0; i < 25; i++) {
            this.blueCircles.push(new BlueCircle(10 + i));
            this.blueCircles[i].position(600, 600);
        }
        this.circles = this.allCircles();
        for (let i = 0; i < 15; i++)
            this.redCircles[i].behaviors.push(new SimpleAimShootBehavior());
        for (let i = 15; i < 30; i++)
            this.redCircles[i].behaviors.push(new AttackBehavior());

        for (let i = 0; i < 25; i++)
            this.blueCircles[i].behaviors.push(new AttackBehavior());
    }

    allCircles = () => this.redCircles.concat(this.blueCircles);
}

class UnitCard {
    circle: Circle;
    experience: number;

    constructor(circle: Circle) {
        this.circle = circle;
        this.experience = 0;
    }
}
