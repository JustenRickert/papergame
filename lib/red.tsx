// -*- mode:typescript -*-

/* These are to be the place to have all of the red circles and things */

/* RedCircle is going to be the base class for all friendly circles. The default
 * behavior of red circles will be to wander closely to the nearest five
 * friendly units. Otherwise, this circle is just fucking bag of meat awaiting
 * death. */
class RedCircle extends Circle {

    constructor(id: number, ...behaviors: Behavior[]) {
        super(id, 20, new Vector(200, 300))
        this.behaviors = behaviors;
        this.id = id;
        this.color = "Red";
        this.timeAlive = 0

        this.speed = 1.0,
        this.turnRate = 0.04

        this.life.maxHealth = 10;
        this.life.health = this.life.maxHealth;
    }
}
