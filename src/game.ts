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
  private isGameOver = false;

  constructor() {
    this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    this.overlay = document.getElementById('overlay')!;
    this.overlayText = document.getElementById('overlay-text')!;
    this.startButton = document.getElementById('start-button') as HTMLButtonElement;

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
    this.overlay.classList.add('hidden');
    this.render();
  }

  private handleKey(e: KeyboardEvent) {
    if (this.isGameOver) return;

    const cell = this.maze.grid[this.playerPos.y][this.playerPos.x];
    let moved = false;

    if (e.key === 'ArrowUp' && !cell.walls.top) {
      this.playerPos.y--;
      moved = true;
    } else if (e.key === 'ArrowRight' && !cell.walls.right) {
      this.playerPos.x++;
      moved = true;
    } else if (e.key === 'ArrowDown' && !cell.walls.bottom) {
      this.playerPos.y++;
      moved = true;
    } else if (e.key === 'ArrowLeft' && !cell.walls.left) {
      this.playerPos.x--;
      moved = true;
    }

    if (moved) {
      this.maze.grid[this.playerPos.y][this.playerPos.x].discovered = true;
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
