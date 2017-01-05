// -*- mode:typescript -*-
var Life = (function () {
    function Life(maxHealth) {
        var _this = this;
        this.damage = function (d) {
            if (_this.health - d < 0)
                _this.health = 0;
            else
                _this.health -= d;
            console.log(_this.health);
        };
        this.heal = function (h) {
            if (_this.health + h < _this.maxHealth)
                _this.health += h;
            else
                _this.health = _this.maxHealth;
        };
        this.maxHealth = maxHealth;
    }
    return Life;
}());
var BasicAttack = (function () {
    function BasicAttack(d) {
        var _this = this;
        this.attackRate = 90;
        this.canAttack = function () { return game.frame - _this.lastAttack > _this.attackRate; };
        this.attack = function (c) {
            c.life.damage(_this.damage);
            _this.lastAttack = game.frame;
        };
        this.damage = d;
        this.lastAttack = 0;
    }
    return BasicAttack;
}());
var Effect = (function () {
    function Effect() {
    }
    return Effect;
}());
