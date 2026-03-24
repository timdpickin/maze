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
  hasKey: boolean = false;
  isDoor: boolean = false;
  doorDirection: keyof Walls | null = null;
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
    this.placeDoorAndKey();
  }

  public findPath(start: Cell, end: Cell, ignoreDoors: boolean = false): Cell[] {
    const queue: Cell[] = [start];
    const visited = new Set<Cell>([start]);
    const parent = new Map<Cell, Cell | null>();
    parent.set(start, null);

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current === end) {
        const path: Cell[] = [];
        let temp: Cell | null = end;
        while (temp !== null) {
          path.push(temp);
          temp = parent.get(temp)!;
        }
        return path.reverse();
      }

      for (const neighbor of this.getConnectedNeighbors(current, ignoreDoors)) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          parent.set(neighbor, current);
          queue.push(neighbor);
        }
      }
    }
    return [];
  }

  private getConnectedNeighbors(cell: Cell, ignoreDoors: boolean = false): Cell[] {
    const neighbors: Cell[] = [];
    const { x, y } = cell;

    const canMove = (dir: keyof Walls) => {
      if (cell.walls[dir]) return false;
      if (!ignoreDoors && cell.isDoor && cell.doorDirection === dir) return false;
      return true;
    };

    if (y > 0 && canMove('top')) neighbors.push(this.grid[y - 1][x]);
    if (x < this.cols - 1 && canMove('right')) neighbors.push(this.grid[y][x + 1]);
    if (y < this.rows - 1 && canMove('bottom')) neighbors.push(this.grid[y + 1][x]);
    if (x > 0 && canMove('left')) neighbors.push(this.grid[y][x - 1]);

    return neighbors;
  }

  private placeDoorAndKey() {
    const start = this.grid[0][0];
    const goal = this.grid[this.rows - 1][this.cols - 1];
    const solutionPath = this.findPath(start, goal, true); // Ignore doors for placement

    if (solutionPath.length < 5) return; // Too short to meaningfully place things

    const solutionSet = new Set(solutionPath);
    let doorIndex = Math.floor(solutionPath.length * 0.3);
    let sideBranchCells: Cell[] = [];

    // Search for a door position that has side branches before it
    while (doorIndex < solutionPath.length - 2) {
      sideBranchCells = [];
      const preDoorCells = solutionPath.slice(0, doorIndex + 1);
      for (const cell of preDoorCells) {
        this.collectSideBranches(cell, solutionSet, sideBranchCells);
      }

      if (sideBranchCells.length > 0) {
        break; // Found a valid spot
      }
      doorIndex++;
    }

    const doorCell = solutionPath[doorIndex];
    const nextCell = solutionPath[doorIndex + 1];

    // Determine direction
    if (nextCell.y < doorCell.y) doorCell.doorDirection = 'top';
    else if (nextCell.x > doorCell.x) doorCell.doorDirection = 'right';
    else if (nextCell.y > doorCell.y) doorCell.doorDirection = 'bottom';
    else if (nextCell.x < doorCell.x) doorCell.doorDirection = 'left';

    doorCell.isDoor = true;

    if (sideBranchCells.length > 0) {
      const keyCell = sideBranchCells[Math.floor(Math.random() * sideBranchCells.length)];
      keyCell.hasKey = true;
    } else {
      // Very rare fallback: place key on the path (this should almost never happen in a maze)
      const fallbackIndex = Math.floor(doorIndex / 2);
      solutionPath[fallbackIndex].hasKey = true;
    }
  }

  private collectSideBranches(current: Cell, solutionSet: Set<Cell>, branchList: Cell[]) {
    for (const neighbor of this.getConnectedNeighbors(current)) {
      if (!solutionSet.has(neighbor) && !branchList.includes(neighbor)) {
        this.traverseBranch(neighbor, solutionSet, branchList);
      }
    }
  }

  private traverseBranch(current: Cell, solutionSet: Set<Cell>, branchList: Cell[]) {
    branchList.push(current);
    for (const neighbor of this.getConnectedNeighbors(current)) {
      if (!solutionSet.has(neighbor) && !branchList.includes(neighbor)) {
        this.traverseBranch(neighbor, solutionSet, branchList);
      }
    }
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
