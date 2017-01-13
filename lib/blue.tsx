// -*- mode:typescript -*-


class BlueCircle extends Circle {
    public timeAlive: number;
    public behaviors: Behavior[];
    public wander: Behavior = new WanderCloselyBehavior(); // Default behavior

    constructor(id: number, ...behaviors: Behavior[]) {
        super(id, 20, new Vector(200, 300))
        this.behaviors = behaviors;
        this.id = id;
        this.color = "Blue";
        this.timeAlive = 0

        this.life.maxHealth = 10;
        this.life.health = this.life.maxHealth;
    }
}