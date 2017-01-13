// -*-mode:typescript-*-

/* With this class I'm using the sort of outline they have for disjoint set data
 * structures and operations. */

// I'm not sure if Information is a good name or not. Anyways, my first addition
// to this was this matrix called distance.

// DISTANCE

//   Holds the distances between all of the circles its considering. There are
//   going to be three different considerations, namely red to red
//   considerations, blue to blue considerations, and red to blue
//   considerations. Having the distances is rather useful, as the distance
//   between two circles is used in a lot of interactions. Having the table
//   results in a memory to computational complexity trade-off. Having the table
//   also allows for higher order functions like for example the
//   bottomFiveDistance function, which extracts the bottom five distances as a
//   list, treating each row as an array of distances.

// ANOTHER POTENTIAL DISTANCE MEASUREMENT

//   A minimum spanning tree could be used instead of the previous
//   distance-based thinking above. Clusters of close circles can be found
//   easily by simply erasing the maximum-weight edges of the minimum spanning
//   tree, then collecting the associated trees of the new forest. The above
//   distance table is an O(n^2) function, and results in new functions on the
//   arrays to be O(n). A minimum spanning tree algorithm could be O(n^2 +
//   lg(n)) which is only slightly worse, however, the forest (collections of
//   trees) could support a lot more interesting underlying functions, and the
//   O(n) functions from the distance ideas could be slightly improved to be a
//   function of O(n/a) for some a >= 1.

class Game {
    public won: boolean = false;
    public lost: boolean = false;

    public frame: number;
    public gameCount: number;

    public graph: Graph;
    public circles: Circle[];   // this might not be necessary... uses more ram

    constructor(player: Player) {
        this.circles = player.allCircles();
        this.graph = new Graph(player);
        this.graph
        this.frame = 0
    }
    public increment = (): void => { this.frame++ }
    public run = (): void => {
        this.increment()
    }
}
