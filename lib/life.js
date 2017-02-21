define(["require", "exports", "./sound"], function (require, exports, sound_1) {
    "use strict";
    var hitFartSound = sound_1.Sound.playHitFartSound;
    var Life = (function () {
        function Life(maxHealth) {
            var _this = this;
            this.damage = function (d) {
                if (_this.health - d < 0)
                    _this.health = 0;
                else
                    _this.health -= d;
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
    exports.Life = Life;
    var BasicAttack = (function () {
        function BasicAttack(d) {
            var _this = this;
            this.attackRate = 360;
            this.canAttack = function (game) {
                return game.frame - _this.lastAttack > _this.attackRate;
            };
            this.attack = function (c, game) {
                c.life.damage(_this.damage);
                _this.lastAttack = game.frame;
                hitFartSound();
            };
            this.damage = d;
            this.lastAttack = -Infinity;
        }
        return BasicAttack;
    }());
    exports.BasicAttack = BasicAttack;
    var BasicShoot = (function () {
        function BasicShoot(damage) {
            var _this = this;
            this.lastAttack = 0;
            this.attackRate = 500;
            this.canAttack = function (game) {
                return game.frame - _this.lastAttack > _this.attackRate;
            };
            this.resetAttack = function (game) {
                _this.lastAttack = game.frame;
            };
            this.lastAttack = -Infinity;
            this.damage = damage;
        }
        return BasicShoot;
    }());
    exports.BasicShoot = BasicShoot;
    var Effect = (function () {
        function Effect() {
        }
        return Effect;
    }());
    exports.Effect = Effect;
});
//# sourceMappingURL=life.js.map