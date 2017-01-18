// I DO NEED THIS I think.
class CollisionBucket {

    lines: { x: number[], y: number[] };
    bucket: Vertex[][];
    bucketCount: number;

    constructor(graph) {
        this.lines = { x: [], y: [] };
        this.bucketCount = 10;  // there is actually this.bucketCount ** 2 buckets
        for (let i = 1; i <= this.bucketCount; i++) {
            this.lines.x.push(i * graph.size.width / this.bucketCount);
            this.lines.y.push(i * graph.size.height / this.bucketCount);
        }

        this.bucket = []
        for (let i = 0; i < this.bucketCount ** 2; i++) {
            let nilVertex: Vertex[];
            this.bucket[i] = nilVertex;
        }

        for (let v of graph.vertexes) {
            let index = CollisionBucket.gridIndexToCollisionBucket(
                graph.gridIndexOf(v, this.lines));
            !this.bucket[index]
                ? this.bucket[index] = [v]
                : this.bucket[index].push(v);
        }
    }

    recalculateBucket = (graph) => {
        this.bucket = []
        for (let i = 0; i < this.bucketCount ** 2; i++) {
            let nilVertex: Vertex[];
            this.bucket[i] = nilVertex;
        }
        for (let v of graph.vertexes) {
            let index = CollisionBucket.gridIndexToCollisionBucketIndex(
                graph.gridIndexOf(v, this.lines));
            !this.bucket[index]
                ? this.bucket[index] = [v]
                : this.bucket[index].push(v);
        }
    }

    neighborsOfIndex = (index: { x: string, y: string }): Vertex[] => {
        let neighbors = this.indexesAroundRegion(index).map(this.vertexesAtIndex);
        // just return all the vertexes in a single array
        return [].concat.apply([], neighbors);
    }

    vertexesAtIndex = (index: { x: string, y: string }): Vertex[] =>
        this.bucket[CollisionBucket.gridIndexToCollisionBucketIndex(index)];


    private indexesAroundRegion = (i: { x: string, y: string }): { x: string, y: string }[] => {
        let vOffset = this.bucketCount;
        return [
            { x: Number(i.x) - 1, y: Number(i.y) - vOffset }, { x: Number(i.x), y: Number(i.y) - vOffset }, { x: Number(i.x) + 1, y: Number(i.y) - vOffset },
            { x: Number(i.x) - 1, y: Number(i.y) }, { x: Number(i.x) + 1, y: Number(i.y) },
            { x: Number(i.x) - 1, y: Number(i.y) }, { x: Number(i.x), y: Number(i.y) + vOffset }, { x: Number(i.x) + 1, y: Number(i.y) + vOffset }
        ].map(CollisionBucket.stringifyIndex);
    }

    gridIndexOf = (vector: Vector): { x: string, y: string } => {
        let x: string;
        let y: string;
        for (let i = 1; i <= this.lines.x.length; i++) {
            if (vector.x < this.lines.x[i]) {
                x = String(i - 1);
                break;
            }
        }
        for (let i = 1; i <= this.lines.y.length; i++) {
            if (vector.y < this.lines.y[i]) {
                y = String(i - 1);
                break;
            }
        }
        if (!x) x = String(this.lines.x.length);
        if (!y) y = String(this.lines.y.length);
        return { x, y }
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
