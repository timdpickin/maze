import { Maze } from './maze';
import { Renderer } from './renderer';

class Game {
  private maze: Maze;
  private renderer: Renderer;
  private playerPos = { x: 0, y: 0 };
  private canvas: HTMLCanvasElement;
  private overlay: HTMLElement;
  private overlayText: HTMLElement;
  private startButton: HTMLButtonElement;
  private toast: HTMLElement;
  private isGameOver = false;
  private hasKey = false;
  private toastTimeout: number | null = null;

  constructor() {
    this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    this.overlay = document.getElementById('overlay')!;
    this.overlayText = document.getElementById('overlay-text')!;
    this.startButton = document.getElementById('start-button') as HTMLButtonElement;
    this.toast = document.getElementById('toast')!;

    this.maze = new Maze(10, 10);
    this.maze.grid[0][0].discovered = true; // Mark start as discovered for initial preview
    this.renderer = new Renderer(this.canvas, this.maze);

    this.startButton.onclick = () => this.start();
    window.onkeydown = (e) => this.handleKey(e);
    
    this.render();
  }

  private start() {
    this.maze = new Maze(10, 10);
    this.playerPos = { x: 0, y: 0 };
    this.maze.grid[0][0].discovered = true; // Mark start as discovered
    this.isGameOver = false;
    this.hasKey = false;
    this.overlay.classList.add('hidden');
    this.render();
  }

  private showToast(message: string) {
    if (this.toastTimeout) {
      window.clearTimeout(this.toastTimeout);
    }
    this.toast.innerText = message;
    this.toast.classList.remove('hidden');
    this.toastTimeout = window.setTimeout(() => {
      this.toast.classList.add('hidden');
    }, 3000);
  }

  private handleKey(e: KeyboardEvent) {
    if (this.isGameOver) return;

    const cell = this.maze.grid[this.playerPos.y][this.playerPos.x];
    let moved = false;
    let nextX = this.playerPos.x;
    let nextY = this.playerPos.y;
    let dir: keyof Walls | null = null;

    if (e.key === 'ArrowUp' && !cell.walls.top) {
      nextY--;
      dir = 'top';
    } else if (e.key === 'ArrowRight' && !cell.walls.right) {
      nextX++;
      dir = 'right';
    } else if (e.key === 'ArrowDown' && !cell.walls.bottom) {
      nextY++;
      dir = 'bottom';
    } else if (e.key === 'ArrowLeft' && !cell.walls.left) {
      nextX--;
      dir = 'left';
    }

    if (dir) {
      // Check for door
      if (cell.isDoor && cell.doorDirection === dir) {
        if (this.hasKey) {
          cell.isDoor = false; // Unlock!
          this.showToast('Door Unlocked!');
          moved = true;
        } else {
          this.showToast('The door is locked! Find the key.');
        }
      } else {
        moved = true;
      }
    }

    if (moved) {
      this.playerPos.x = nextX;
      this.playerPos.y = nextY;
      const newCell = this.maze.grid[this.playerPos.y][this.playerPos.x];
      newCell.discovered = true;

      if (newCell.hasKey) {
        this.hasKey = true;
        newCell.hasKey = false;
        this.showToast('You found the key!');
      }

      this.checkWin();
      this.render();
    }
  }

  private checkWin() {
    if (this.playerPos.x === this.maze.cols - 1 && this.playerPos.y === this.maze.rows - 1) {
      this.isGameOver = true;
      this.overlayText.innerText = 'YOU WIN!';
      this.startButton.innerText = 'PLAY AGAIN';
      this.overlay.classList.remove('hidden');
    }
  }

  private render() {
    this.renderer.draw(this.maze, this.playerPos);
  }
}

new Game();
