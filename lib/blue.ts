// -*- mode:typescript -*-

import { Vector } from './vector'
import { Circle } from './circle'
import { Behavior } from './behavior'

export class BlueCircle extends Circle {
    public timeAlive: number;
    public behaviors: Behavior[];

    constructor(id: number, ...behaviors: Behavior[]) {
        super(id, 20, new Vector(200, 300))
        this.behaviors = behaviors;
        this.id = id;
        this.teamColor = "blue";
        this.color = "blue";
        this.timeAlive = 0

        this.life.maxHealth = 10;
        this.life.health = this.life.maxHealth;
    }
}