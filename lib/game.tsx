// -*-mode:typescript-*-

class Game {
    public running: boolean = true;
    public won: boolean = false;
    public lost: boolean = false;

    public frame: number;
    public gameCount: number;

    public graph: Graph;
    public circles: Circle[];   // this might not be necessary... uses more ram

    constructor(player: Player, enemy: Player) {
        this.circles = player.circles().concat(enemy.circles());
        this.graph = new Graph(player, enemy);
        this.frame = 0;
    }

    reinitialize = (winOrLoss: string): void => {
        if (winOrLoss === 'win') {
            let newCircle = new BlueCircle(this.graph.enemy.units.length
                + this.graph.player.units.length);
            newCircle.behaviors = [new SimpleAimShootBehavior(), new AttackBehavior()];
            let newCard = cardifyOne(newCircle);
            this.graph.enemy.units.push(newCard);
            this.graph.enemy.circle.push(newCircle);
        } else if (winOrLoss === 'loss') {
            this.graph.enemy.units.pop();
        }
        this.frame = 0;
        this.graph.clearBullets();
        this.graph.player.circle.forEach((c) => c.teamColor = "red");
        this.graph.enemy.circle.forEach((c) => c.teamColor = "blue");
        this.graph.player.circle.forEach((c) => c.life.health = c.life.maxHealth);
        this.graph.enemy.circle.forEach((c) => c.life.health = c.life.maxHealth);
        this.graph.player.circle.forEach((c) => c.pos = new Vector(0, 0));
        this.graph.enemy.circle.forEach((c) => c.pos = new Vector(canvas.width, canvas.height));
        this.graph.reinitializeBehaviors();
        this.graph = new Graph(this.graph.player, this.graph.enemy);
        this.graph.reinitializeBehaviors();
    }

    increment = (): void => { this.frame++ }

    run = (): void => {
        this.increment();
    }

    circleIsDead = (circle: Circle): boolean => {
        // Vector.equalPosition(v.circle.pos, vertex.circle.pos));
        for (let v of this.graph.dead) {
            if (circle === v.circle) {
                return true;
            }
        }
        return false;
    }

    // The win condition is "Every enemy circle is dead, and some player circle
    // is not dead." This connective statement has a truth identity that is
    // early terminating, i.e. if one enemy circle is found to be alive, then
    // the rest of the algorithm is short circuited and the function instantly
    // returns false.
    winCondition = (): boolean =>
        this.graph.enemy.circle.every((c) => this.circleIsDead(c))
        && this.graph.player.circle.some((c) => !this.circleIsDead(c));

    // Should be obvious after reading the win condition.
    loseCondition = (): boolean =>
        this.graph.player.circle.every((c) => this.circleIsDead(c))
        && this.graph.enemy.circle.some((c) => !this.circleIsDead(c));

}
