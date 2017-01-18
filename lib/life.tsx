// -*- mode:typescript -*-

class Life {
    public health: number;
    public maxHealth: number;
    public buff: Effect[];
    constructor(maxHealth: number) {
        this.maxHealth = maxHealth;
    }
    public damage = (d: number): void => {
        if (this.health - d < 0) this.health = 0;
        else this.health -= d;
    }
    public heal = (h: number): void => {
        if (this.health + h < this.maxHealth) this.health += h;
        else this.health = this.maxHealth;
    }
}

class BasicAttack {
    public damage: number;
    public lastAttack: number;
    public attackRate: number = 360;
    constructor(d: number) {
        this.damage = d;
        this.lastAttack = 0;
    }
    public canAttack = (game: Game): boolean =>
        game.frame - this.lastAttack > this.attackRate;
    public attack = (c: Circle, game: Game): void => {
        c.life.damage(this.damage);
        this.lastAttack = game.frame;
    }
}

class BasicShoot {
    public damage: number;
    public lastAttack: number;
    public attackRate: number = 500;
    public canAttack = (game: Game): boolean =>
        game.frame - this.lastAttack > this.attackRate;
    public attack = (c: Circle, game: Game): void => {
        c.life.damage(this.damage);
        this.lastAttack = game.frame;
    }
}

class Effect {
}
