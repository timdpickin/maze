export interface Walls {
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
}

export class Cell {
  readonly x: number;
  readonly y: number;
  visited: boolean = false;
  discovered: boolean = false;
  walls: Walls = {
    top: true,
    right: true,
    bottom: true,
    left: true,
  };

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export class Maze {
  readonly rows: number;
  readonly cols: number;
  grid: Cell[][] = [];

  constructor(rows: number, cols: number) {
    this.rows = rows;
    this.cols = cols;
    this.setup();
    this.generate();
  }

  private setup() {
    for (let y = 0; y < this.rows; y++) {
      const row: Cell[] = [];
      for (let x = 0; x < this.cols; x++) {
        row.push(new Cell(x, y));
      }
      this.grid.push(row);
    }
  }

  private generate() {
    const startCell = this.grid[0][0]; // Start generation from top-left
    this.visit(startCell);
  }

  private visit(current: Cell) {
    current.visited = true;

    const neighbors = this.getUnvisitedNeighbors(current);
    while (neighbors.length > 0) {
      const randomIndex = Math.floor(Math.random() * neighbors.length);
      const next = neighbors.splice(randomIndex, 1)[0];

      if (!next.visited) {
        this.removeWalls(current, next);
        this.visit(next);
      }
    }
  }

  private getUnvisitedNeighbors(cell: Cell): Cell[] {
    const neighbors: Cell[] = [];
    const { x, y } = cell;

    if (y > 0 && !this.grid[y - 1][x].visited) neighbors.push(this.grid[y - 1][x]);
    if (x < this.cols - 1 && !this.grid[y][x + 1].visited) neighbors.push(this.grid[y][x + 1]);
    if (y < this.rows - 1 && !this.grid[y + 1][x].visited) neighbors.push(this.grid[y + 1][x]);
    if (x > 0 && !this.grid[y][x - 1].visited) neighbors.push(this.grid[y][x - 1]);

    return neighbors;
  }

  private removeWalls(a: Cell, b: Cell) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;

    if (dx === 1) {
      a.walls.left = false;
      b.walls.right = false;
    } else if (dx === -1) {
      a.walls.right = false;
      b.walls.left = false;
    }

    if (dy === 1) {
      a.walls.top = false;
      b.walls.bottom = false;
    } else if (dy === -1) {
      a.walls.bottom = false;
      b.walls.top = false;
    }
  }
}
