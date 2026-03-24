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

  it('should find a path from start to goal (ignoring doors)', () => {
    const maze = new Maze(10, 10);
    const start = maze.grid[0][0];
    const goal = maze.grid[9][9];
    const path = maze.findPath(start, goal, true);

    expect(path.length).toBeGreaterThan(0);
    expect(path[0]).toBe(start);
    expect(path[path.length - 1]).toBe(goal);
  });

  it('should place exactly one door and one key', () => {
    const maze = new Maze(10, 10);
    let doorCount = 0;
    let keyCount = 0;

    for (let y = 0; y < maze.rows; y++) {
      for (let x = 0; x < maze.cols; x++) {
        if (maze.grid[y][x].isDoor) doorCount++;
        if (maze.grid[y][x].hasKey) keyCount++;
      }
    }

    expect(doorCount).toBe(1);
    expect(keyCount).toBe(1);
  });

  it('should place the door on the solution path', () => {
    const maze = new Maze(10, 10);
    const start = maze.grid[0][0];
    const goal = maze.grid[9][9];
    const path = maze.findPath(start, goal, true);
    
    let doorOnPath = false;
    for (let y = 0; y < maze.rows; y++) {
      for (let x = 0; x < maze.cols; x++) {
        if (maze.grid[y][x].isDoor) {
          if (path.includes(maze.grid[y][x])) {
            doorOnPath = true;
          }
        }
      }
    }
    expect(doorOnPath).toBe(true);
  });

  it('should not find a path if the door is blocking and ignoreDoors is false', () => {
    const maze = new Maze(10, 10);
    const start = maze.grid[0][0];
    const goal = maze.grid[9][9];
    
    // Find path with ignoreDoors = false (default)
    const path = maze.findPath(start, goal, false);
    
    // The path should be blocked by the door
    expect(path.length).toBe(0);
  });

  it('should find a path if ignoreDoors is true', () => {
    const maze = new Maze(10, 10);
    const start = maze.grid[0][0];
    const goal = maze.grid[9][9];
    
    const path = maze.findPath(start, goal, true);
    expect(path.length).toBeGreaterThan(0);
  });
});
