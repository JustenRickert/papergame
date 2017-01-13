class CollisionBucket {

    lines: { x: number[], y: number[] };
    collisionBucket: Vertex[][];
    bucketCount: number;

    constructor(graph) {
        this.lines = { x: [], y: [] };
        this.bucketCount = 10;
        for (let i = 1; i <= this.bucketCount; i++) {
            this.lines.x.push(i * graph.size.width / this.bucketCount);
            this.lines.y.push(i * graph.size.height / this.bucketCount);
        }

        this.collisionBucket = []
        for (let i = 0; i < this.bucketCount ** 2; i++) {
            let nilVertex: Vertex[];
            this.collisionBucket[i] = nilVertex;
        }

        for (let v of graph.vertexes) {
            let index = this.gridIndexToCollisionBucket(
                graph.gridIndexOf(v, this.lines));
            !this.collisionBucket[index]
                ? this.collisionBucket[index] = [v]
                : this.collisionBucket[index].push(v);
        }
    }
    // TODO: This works perfectly for the bucketcount being 10, but I don't
    // think it will be efficient if the bucketcount is lower, and it won't work
    // if the bucketcount is greater.
    gridIndexToCollisionBucket = (bucketIndex: { x: string, y: string }): number =>
         10 * Number(bucketIndex.x) + Number(bucketIndex.y);
}
