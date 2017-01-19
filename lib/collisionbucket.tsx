// I DO NEED THIS I think.
class CollisionBucket {

    lines: { x: number[], y: number[] };
    bucket: Vertex[][];
    bucketCount: number;

    constructor(graph) {
        this.lines = { x: [], y: [] };
        this.bucketCount = 10;  // there is actually this.bucketCount ** 2 buckets
        for (let i = 0; i < this.bucketCount; i++) {
            this.lines.x.push(i * graph.size.width / this.bucketCount);
            this.lines.y.push(i * graph.size.height / this.bucketCount);
        }

        this.bucket = []
        for (let i = 0; i < this.bucketCount ** 2; i++) {
            let nilVertex: Vertex[] = [];
            this.bucket[i] = nilVertex;
        }

        for (let v of graph.vertexes) {
            let index = CollisionBucket.gridIndexToCollisionBucketIndex(this.gridIndexOf(v.circle.pos));
            !this.bucket[index]
                ? this.bucket[index] = [v]
                : this.bucket[index].push(v);
        }
    }

    recalculateBucket = (graph) => {
        // I wonder how taxing this is to initialize. Initialization shouldn't
        // need to be done here.
        this.bucket = []
        for (let i = 0; i <= this.bucketCount ** 2; i++) {
            let nilVertex: Vertex[];
            this.bucket[i] = nilVertex;
        }
        for (let v of graph.vertexes) {
            let index = CollisionBucket.gridIndexToCollisionBucketIndex(this.gridIndexOf(v.circle.pos));
            !this.bucket[index]
                ? this.bucket[index] = [v]
                : this.bucket[index].push(v);
        }
    }

    gridIndexOf = (vector: Vector): { x: string, y: string } => {
        var x: string;
        var y: string;
        for (let i in this.lines.x) {
            if (this.lines.x[i] > vector.x) {
                x = i;
                break;
            }
        }
        for (let i in this.lines.y) {
            if (this.lines.y[i] > vector.y) {
                y = i;
                break;
            }
        }
        if (x === undefined) x = String(this.lines.x.length);
        if (y === undefined) y = String(this.lines.y.length);
        return { x, y };
    }

    neighborsOfIndex = (index: { x: string, y: string }): Vertex[] => {
        let neighbors = this.indexesAroundRegion(index).map(this.vertexesAtIndex);
        // just return all the vertexes in a single array
        return [].concat.apply([], neighbors);
    }

    vertexesAtIndex = (index: { x: string, y: string }): Vertex[] => {
        return this.bucket[CollisionBucket.gridIndexToCollisionBucketIndex(index)] || [];
    }

    private indexesAroundRegion = (i: { x: string, y: string }): { x: string, y: string }[] => {
        let vOffset = this.bucketCount;
        return [
            { x: Number(i.x) - 1, y: Number(i.y) - vOffset }, { x: Number(i.x), y: Number(i.y) - vOffset }, { x: Number(i.x) + 1, y: Number(i.y) - vOffset },
            { x: Number(i.x) - 1, y: Number(i.y) }, { x: Number(i.x) + 1, y: Number(i.y) },
            { x: Number(i.x) - 1, y: Number(i.y) }, { x: Number(i.x), y: Number(i.y) + vOffset }, { x: Number(i.x) + 1, y: Number(i.y) + vOffset }
        ].map(CollisionBucket.stringifyIndex);
    }

    static stringifyIndex = (index: { x: number, y: number }): { x: string, y: string } => {
        return { x: String(index.x), y: String(index.y) };
    }

    // TODO: This works perfectly for the bucketcount being 10, but I don't
    // think it will be efficient if the bucketcount is lower, and it won't work
    // if the bucketcount is greater. May not even need to care, though.
    static gridIndexToCollisionBucketIndex = (bucketIndex: { x: string, y: string }): number =>
        10 * Number(bucketIndex.x) + Number(bucketIndex.y);
}
