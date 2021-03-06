//-*-mode:typescript-*-
// Local Variables:
// eval: (setq typescript-indent-level 2)
// End:

import { Circle } from './circle'
import { Game } from './game'
import { Sound } from './sound'

const hitFartSound = Sound.playHitFartSound;

export class Life {
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

export class BasicAttack {
  damage: number;
  lastAttack: number;
  attackRate: number = 360;
  constructor(d: number) {
    this.damage = d;
    this.lastAttack = -Infinity;
  }
  canAttack = (game: Game): boolean =>
    game.frame - this.lastAttack > this.attackRate;

  attack = (c: Circle, game: Game): void => {
    c.life.damage(this.damage);
    this.lastAttack = game.frame;
    hitFartSound();
  }
}

export class BasicShoot {
  damage: number;
  lastAttack: number = 0;
  attackRate: number = 500;

  constructor(damage: number) {
    this.lastAttack = -Infinity;
    this.damage = damage;
  }

  canAttack = (game: Game): boolean => {
    return game.frame - this.lastAttack > this.attackRate;
  }

  resetAttack = (game: Game): void => {
    this.lastAttack = game.frame;
  }
}

export class Effect {
}
