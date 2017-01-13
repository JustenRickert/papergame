/*-*-mode:typescript-*-*/
class Player {
    redCircles: Circle[] = [];
    blueCircles: Circle[] = [];
    circles: Circle[];

    constructor() {
        for (let i = 0; i < 25; i++) {
            this.redCircles.push(new RedCircle(i));
            this.redCircles[i].position(40, 40);
        }
        for (let i = 0; i < 25; i++) {
            this.blueCircles.push(new BlueCircle(10+i));
            this.blueCircles[i].position(600, 600);
        }
        this.circles = this.allCircles();
        this.circles.map((circle) => circle.behaviors.push(new AttackBehavior()));
    }

    allCircles = () => this.redCircles.concat(this.blueCircles);
}