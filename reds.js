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
    return Reds;
}());
