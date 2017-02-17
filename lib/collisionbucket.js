//-*-mode:typescript-*-
"use strict";
var CollisionBucket = (function () {
    function CollisionBucket(graph) {
        var _this = this;
        this.recalculateBucket = function (graph) {
            // I wonder how taxing this is to initialize. Initialization shouldn't
            // need to be done here.
            _this.bucket = [];
            for (var i = 0; i <= Math.pow(_this.bucketCount, 2); i++) {
                var nilVertex = void 0;
                _this.bucket[i] = nilVertex;
            }
            for (var _i = 0, _a = graph.vertexes; _i < _a.length; _i++) {
                var v = _a[_i];
                var index = CollisionBucket.gridIndexToCollisionBucketIndex(_this.gridIndexOf(v.circle.pos));
                !_this.bucket[index]
                    ? _this.bucket[index] = [v]
                    : _this.bucket[index].push(v);
            }
        };
        this.gridIndexOf = function (vector) {
            var x;
            var y;
            for (var i in _this.lines.x) {
                if (_this.lines.x[i] > vector.x) {
                    x = i;
                    break;
                }
            }
            for (var i in _this.lines.y) {
                if (_this.lines.y[i] > vector.y) {
                    y = i;
                    break;
                }
            }
            if (x === undefined)
                x = String(_this.lines.x.length);
            if (y === undefined)
                y = String(_this.lines.y.length);
            return { x: x, y: y };
        };
        this.neighborsOfIndex = function (index) {
            var neighbors = _this.indexesAroundRegion(index).map(_this.vertexesAtIndex);
            // just return all the vertexes in a single array
            return [].concat.apply([], neighbors);
        };
        this.vertexesAtIndex = function (index) {
            return _this.bucket[CollisionBucket.gridIndexToCollisionBucketIndex(index)] || [];
        };
        // TODO: There must be an elegant way to do this...
        this.indexesAroundRegion = function (i) {
            var vOffset = _this.bucketCount;
            return [
                { x: Number(i.x) - 1, y: Number(i.y) - vOffset }, { x: Number(i.x), y: Number(i.y) - vOffset }, { x: Number(i.x) + 1, y: Number(i.y) - vOffset },
                { x: Number(i.x) - 1, y: Number(i.y) }, { x: Number(i.x) + 1, y: Number(i.y) },
                { x: Number(i.x) - 1, y: Number(i.y) }, { x: Number(i.x), y: Number(i.y) + vOffset }, { x: Number(i.x) + 1, y: Number(i.y) + vOffset }
            ].map(CollisionBucket.stringifyIndex);
        };
        this.lines = { x: [], y: [] };
        this.bucketCount = 10; // there is actually this.bucketCount ** 2 buckets
        for (var i = 0; i < this.bucketCount; i++) {
            this.lines.x.push(i * graph.size.width / this.bucketCount);
            this.lines.y.push(i * graph.size.height / this.bucketCount);
        }
        this.bucket = [];
        for (var i = 0; i < Math.pow(this.bucketCount, 2); i++) {
            var nilVertex = [];
            this.bucket[i] = nilVertex;
        }
        for (var _i = 0, _a = graph.vertexes; _i < _a.length; _i++) {
            var v = _a[_i];
            var index = CollisionBucket
                .gridIndexToCollisionBucketIndex(this.gridIndexOf(v.circle.pos));
            !this.bucket[index]
                ? this.bucket[index] = [v]
                : this.bucket[index].push(v);
        }
    }
    return CollisionBucket;
}());
CollisionBucket.stringifyIndex = function (index) {
    return { x: String(index.x), y: String(index.y) };
};
// TODO: This works perfectly for the bucketcount being 10, but I don't
// think it will be efficient if the bucketcount is lower, and it won't work
// if the bucketcount is greater. May not even need to care, though.
CollisionBucket.gridIndexToCollisionBucketIndex = function (bucketIndex) {
    return 10 * Number(bucketIndex.x) + Number(bucketIndex.y);
};
exports.CollisionBucket = CollisionBucket;
