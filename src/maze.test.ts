import { describe, it, expect } from 'vitest';
import { Maze } from './maze';

describe('Maze Generation', () => {
  it('should generate a maze of the correct size', () => {
    const rows = 10;
    const cols = 10;
    const maze = new Maze(rows, cols);

    expect(maze.grid.length).toBe(rows);
    expect(maze.grid[0].length).toBe(cols);
  });

  it('should mark all cells as visited (meaning it is a spanning tree)', () => {
    const maze = new Maze(10, 10);
    
    for (let y = 0; y < maze.rows; y++) {
      for (let x = 0; x < maze.cols; x++) {
        expect(maze.grid[y][x].visited).toBe(true);
      }
    }
  });

  it('should start generation at the top-left corner', () => {
    const maze = new Maze(10, 10);
    expect(maze.grid[0][0].visited).toBe(true);
  });

  it('should have a win condition at the bottom-right corner', () => {
    const maze = new Maze(10, 10);
    const winCell = maze.grid[maze.rows - 1][maze.cols - 1];
    expect(winCell.x).toBe(9);
    expect(winCell.y).toBe(9);
  });

  it('should initialize all cells as undiscovered', () => {
    const maze = new Maze(10, 10);
    for (let y = 0; y < maze.rows; y++) {
      for (let x = 0; x < maze.cols; x++) {
        expect(maze.grid[y][x].discovered).toBe(false);
      }
    }
  });
});
