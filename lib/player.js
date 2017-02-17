/*-*-mode:typescript-*-*/
"use strict";
var Player = (function () {
    function Player(units) {
        var _this = this;
        this.circles = function () {
            var circles = [];
            _this.units.forEach(function (u) { return circles.push(u.circle); });
            return circles;
        };
        this.units = units;
        this.circle = this.circles();
    }
    return Player;
}());
exports.Player = Player;
var UnitCard = (function () {
    function UnitCard(circle) {
        var behavior = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            behavior[_i - 1] = arguments[_i];
        }
        this.circle = circle;
        this.behavior = behavior;
        this.experience = 0;
    }
    return UnitCard;
}());
exports.UnitCard = UnitCard;
