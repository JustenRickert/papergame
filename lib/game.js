// -*-mode:typescript-*-
var Game = (function () {
    function Game(redCount, blueCount) {
        var _this = this;
        this.won = false;
        this.lost = false;
        this.redBlueIsThenClipping = function () {
            for (var _i = 0, _a = _this.red.all; _i < _a.length; _i++) {
                var r = _a[_i];
                for (var _b = 0, _c = _this.blue.all; _b < _c.length; _b++) {
                    var b = _c[_b];
                    Circle.isThenClipping(r, b);
                }
            }
        };
        this.increment = function () { _this.frame++; };
        this.run = function () {
            _this.increment();
            _this.red.increment();
            _this.blue.increment();
            _this.behave();
        };
        this.draw = function () {
            _this.red.draw();
            _this.blue.draw();
        };
        this.spawnRed = function () {
            // spawns red dudes and then tells them what to do.
            _this.red.positionAll();
        };
        this.spawnBlue = function () {
            // spawns red dudes and then tells them what to do.
            _this.blue.positionAll();
        };
        this.markDead = function () {
            for (var _i = 0, _a = _this.red.all; _i < _a.length; _i++) {
                var r = _a[_i];
                if (r.isDead())
                    r.markDead();
            }
            for (var _b = 0, _c = _this.blue.all; _b < _c.length; _b++) {
                var b = _c[_b];
                if (b.isDead())
                    b.markDead();
            }
        };
        this.losing = function () { _this.lost = true; };
        this.winning = function () { _this.won = true; };
        this.checkWinLose = function () {
            if (_this.red.all.every(Circle.isDead))
                _this.losing();
            else if (_this.blue.all.every(Circle.isDead))
                _this.winning();
        };
        this.collision = function () {
            _this.red.isThenClipping();
            _this.blue.isThenClipping();
            _this.redBlueIsThenClipping();
        };
        this.closestCircle = function (c, color) {
            if (color) {
                var group = {
                    'Red': _this.red.all,
                    'Blue': _this.blue.all
                }[color];
            }
            var minC;
            var dist;
            for (var _i = 0, group_1 = group; _i < group_1.length; _i++) {
                var otherC = group_1[_i];
                if (c !== otherC) {
                    if (!minC && otherC.alive)
                        minC = otherC;
                    dist = Vector.dist(c.pos, otherC.pos);
                }
                else
                    dist = Infinity;
                if (otherC.alive && dist && Vector.dist(c.pos, minC.pos) > dist)
                    minC = otherC;
            }
            return minC;
        };
        this.bottomFiveDistance = function (c, color) {
            var distance = {
                'Red': _this.distanceRed[c.id],
                'Blue': _this.distanceBlue[c.id]
            }[color];
            var id = [];
            if (distance.length <= 5) {
                for (var j in distance) {
                    id.push(j);
                }
                return zip(id, distance);
            }
            var dist = [];
            for (var j = 0; j < 5; j++) {
                id.push(j);
                dist.push(distance[j]);
            }
            var smallest = dist.indexOf(min(dist));
            for (var j = 5; j < distance.length; j++) {
                if (distance[j] > dist[smallest]) {
                    dist[smallest] = distance[j];
                    id[smallest] = j;
                    smallest = dist.indexOf(min(dist));
                }
            }
            return zip(id, dist);
        };
        /* Returns the center of mass of closest five circles to the circle
         * argument. */
        this.momentClosestFive = function (c, color) {
            var clstFivePos = [];
            var botmFive = _this.bottomFiveDistance(c, color);
            for (var _i = 0, botmFive_1 = botmFive; _i < botmFive_1.length; _i++) {
                var e = botmFive_1[_i];
                var all = {
                    'Red': _this.red.all,
                    'Blue': _this.blue.all
                }[color];
                clstFivePos.push(all[e[0]].pos);
            }
            return Game.moment(clstFivePos);
        };
        this.behave = function () {
            for (var _i = 0, _a = _this.red.all; _i < _a.length; _i++) {
                var r = _a[_i];
                if (r.alive)
                    r.behave(r, _this);
            }
            for (var _b = 0, _c = _this.blue.all; _b < _c.length; _b++) {
                var b = _c[_b];
                if (b.alive)
                    b.behave(b, _this);
            }
        };
        this.gameCount = redCount + blueCount;
        this.red = new Reds(redCount, this.gameCount);
        this.blue = new Blues(blueCount, this.gameCount);
        this.frame = 0;
    }
    Game.prototype.updateDistanceTable = function () {
        this.distanceRed = this.red.distanceTable();
        this.distanceBlue = this.blue.distanceTable();
    };
    return Game;
}());
/* Returns the center of mass. All of the circles have the same mass, so
 * it's a little silly to call it by that name (it is rather, the center of
 * all the points), but it's convenient anyways now that you know what I'm
 * talking about, hopefully. */
Game.moment = function (pos) {
    var sum = new Vector(0, 0);
    for (var _i = 0, pos_1 = pos; _i < pos_1.length; _i++) {
        var p = pos_1[_i];
        sum = Vector.plus(sum, p);
    }
    return Vector.times(1 / pos.length, sum);
};
/* HELPER FUNCTIONS
 *
 *     These are functions I use for conveniency and cause it makes me look cool
 *     that I ask for help. */
var min = function (arr) { return arr.reduce(function (a, b, i, arr) {
    if (a !== undefined && b !== undefined)
        return Math.min(a, b);
    else
        return a === undefined ? b : a;
}); };
var combin2 = function (arr) {
    var combs = [];
    for (var i = 0; i < arr.length; i++)
        for (var j = i + 1; j < arr.length; j++)
            if (i !== j) {
                combs.push(arr[i], arr[j]);
            }
    return combs;
};
var zip = function (a1, a2) { return a1.map(function (x, i) { return [x, a2[i]]; }); };
var combine = function (a) {
    var fn = function (n, src, got, all) {
        if (n == 0) {
            if (got.length > 0) {
                all[all.length] = got;
            }
            return;
        }
        for (var j = 0; j < src.length; j++) {
            fn(n - 1, src.slice(j + 1), got.concat([src[j]]), all);
        }
        return;
    };
    var all = [];
    for (var i = 0; i < a.length; i++) {
        fn(i, a, [], all);
    }
    all.push(a);
    return all;
};
