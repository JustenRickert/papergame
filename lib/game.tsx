// -*-mode:typescript-*-

class Game {
    public running: boolean = true;
    public won: boolean = false;
    public lost: boolean = false;

    public frame: number;
    public gameCount: number;

    public graph: Graph;
    public circles: Circle[];   // this might not be necessary... uses more ram

    constructor(player: Player) {
        this.circles = player.allCircles();
        this.graph = new Graph(player);
        this.graph;
        this.frame = 0;
    }

    public increment = (): void => { this.frame++ }
    public run = (): void => {
        this.increment();
    }
}
