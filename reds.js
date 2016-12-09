/* These are to be the place to have all of the red circles and things */
var Reds = (function () {
    function Reds(count) {
        this.count = count;

        for (var i = 0; i < this.count; i++) {
            this.all.push(new RedCircle());
        }
    }
    Reds.prototype.positionAll = function () {
        for (var i = 0; i < this.count; i++) {
            this.all[i].move(322 + 20 * i, 322 + 20 * i);
        }
    };
    Reds.prototype.draw = function () {
        for (var i = 0; i < this.count; i++) {
            this.all[i].draw();
        }
    };
    return Reds;
}());
