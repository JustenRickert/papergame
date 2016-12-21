// -*- mode:typescript -*-

class Life {
    public health: number;
    public maxHealth: number;
    public buff: Effect[];
    constructor(maxHealth: number) {
        this.maxHealth = maxHealth;
    }
    public damage(d: number): void {
        if (this.health - d < 0) this.health = 0;
        else this.health -= d;
    }
    public heal(h: number): void {
        if (this.health + h < this.maxHealth) this.health += h;
        else this.health = this.maxHealth;
    }
}

class BasicAttack {
    public damage: number;
    constructor(d:number) {
        this.damage = d;
    }
}

class Effect {
}
