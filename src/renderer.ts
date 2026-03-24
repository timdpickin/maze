import { Maze, Cell } from './maze';

export class Renderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private cellSize: number;

  constructor(canvas: HTMLCanvasElement, maze: Maze) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.cellSize = Math.min(window.innerWidth, window.innerHeight) * 0.8 / maze.cols;
    this.canvas.width = maze.cols * this.cellSize;
    this.canvas.height = maze.rows * this.cellSize;
  }

  public draw(maze: Maze, playerPos: { x: number, y: number }) {
    // Fill background with fog color
    this.ctx.fillStyle = '#333';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    for (let y = 0; y < maze.rows; y++) {
      for (let x = 0; x < maze.cols; x++) {
        const cell = maze.grid[y][x];
        const isCurrent = playerPos.x === x && playerPos.y === y;
        
        if (cell.discovered) {
          // Draw revealed cell background
          this.ctx.fillStyle = '#000';
          this.ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
          
          this.drawCellWalls(cell);

          // Draw Key if present
          if (cell.hasKey) {
            this.drawKey(x, y);
          }
          
          // Draw goal only if discovered
          if (x === maze.cols - 1 && y === maze.rows - 1) {
            this.drawGoal(x, y);
          }
        } else if (isCurrent) {
          // Draw walls of current cell even if not discovered yet
          this.drawCellWalls(cell);
        }
      }
    }

    this.drawPlayer(playerPos);
  }

  private drawCellWalls(cell: Cell) {
    const x = cell.x * this.cellSize;
    const y = cell.y * this.cellSize;

    const drawWall = (dir: keyof typeof cell.walls, startX: number, startY: number, endX: number, endY: number) => {
      if (!cell.walls[dir] && cell.doorDirection !== dir) return;

      this.ctx.beginPath();
      this.ctx.moveTo(startX, startY);
      this.ctx.lineTo(endX, endY);

      if (cell.isDoor && cell.doorDirection === dir) {
        this.ctx.strokeStyle = '#f00'; // Red for door
        this.ctx.lineWidth = 6;
      } else {
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 2;
      }
      this.ctx.stroke();
    };

    drawWall('top', x, y, x + this.cellSize, y);
    drawWall('right', x + this.cellSize, y, x + this.cellSize, y + this.cellSize);
    drawWall('bottom', x, y + this.cellSize, x + this.cellSize, y + this.cellSize);
    drawWall('left', x, y, x, y + this.cellSize);
  }

  private drawKey(kx: number, ky: number) {
    const x = (kx + 0.5) * this.cellSize;
    const y = (ky + 0.5) * this.cellSize;
    const size = this.cellSize * 0.2;

    this.ctx.fillStyle = '#ff0'; // Yellow for key
    this.ctx.beginPath();
    this.ctx.arc(x, y, size, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Draw a small handle to make it look like a key
    this.ctx.fillRect(x - size, y + size * 0.5, size * 2, size * 0.5);
  }

  private drawPlayer(pos: { x: number, y: number }) {
    const x = (pos.x + 0.5) * this.cellSize;
    const y = (pos.y + 0.5) * this.cellSize;
    const radius = this.cellSize * 0.3;

    this.ctx.fillStyle = '#fff';
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private drawGoal(gx: number, gy: number) {
    const x = (gx + 0.5) * this.cellSize;
    const y = (gy + 0.5) * this.cellSize;
    const size = this.cellSize * 0.4;

    this.ctx.strokeStyle = '#0f0'; // Light green for goal
    this.ctx.lineWidth = 4;
    this.ctx.strokeRect(x - size/2, y - size/2, size, size);
  }
}
