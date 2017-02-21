var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "./vector", "./circle"], function (require, exports, vector_1, circle_1) {
    "use strict";
    var RedCircle = (function (_super) {
        __extends(RedCircle, _super);
        function RedCircle(id) {
            var behaviors = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                behaviors[_i - 1] = arguments[_i];
            }
            var _this = _super.call(this, id, 20, new vector_1.Vector(200, 300)) || this;
            _this.behaviors = behaviors;
            _this.id = id;
            _this.teamColor = "red";
            _this.dColor = "gold";
            _this.color = _this.dColor;
            _this.timeAlive = 0;
            _this.speed = 1.0,
                _this.turnRate = 0.04;
            _this.life.maxHealth = 10;
            _this.life.health = _this.life.maxHealth;
            return _this;
        }
        return RedCircle;
    }(circle_1.Circle));
    exports.RedCircle = RedCircle;
});
//# sourceMappingURL=red.js.map