# Implementation Plan: Procedural Maze in TypeScript

## Objective
Create a procedurally generated 10x10 maze game in TypeScript, where a user navigates a dot through a black screen with white walls using arrow keys.

## Technical Stack
- **Language:** TypeScript
- **Runtime:** Node.js (with a development server)
- **Frontend/UI:** HTML5 Canvas (recommended for better performance and visual control)
- **Bundler:** Vite (fast, modern development server for TypeScript)

## Proposed Architecture
- `src/maze.ts`: Logic for procedural maze generation (Recursive Backtracking).
- `src/game.ts`: Main game loop, user input handling (Arrow keys), and state management.
- `src/renderer.ts`: Logic for drawing the grid, walls, and the player dot.

## Procedural Generation Algorithm
We will use the **Recursive Backtracking (Depth-First Search)** algorithm:
1. Start at a random cell.
2. Mark it as visited.
3. While there are unvisited cells:
   - Pick a random unvisited neighbor.
   - If found:
     - Remove the wall between the current cell and the neighbor.
     - Move to the neighbor and repeat.
   - If not found:
     - Backtrack to the previous cell and repeat.

## Game Rules & Conditions
- **Start Tile:** The player always starts at the top-left corner (Cell 0, 0).
- **Win Condition:** Reaching the bottom-right corner (Cell 9, 9).
- **Startup:** The game will launch in a web browser. To ensure user interaction (required by some browsers for audio or focus), a "Click to Start" overlay will be displayed. Double-clicking a desktop shortcut to the local URL (or a script) can be used to launch the browser and start the session.

## Phased Implementation Plan

### Phase 1: Project Setup
1. Initialize `npm` project in `schnappt`.
2. Install `typescript` and `vite` as development dependencies.
3. Configure `tsconfig.json` and `index.html`.
4. Create a basic launch script (e.g., `start.bat`) so the user can "double-click" to open the game in their default browser.

### Phase 2: Maze Generation Logic
1. Define the `Cell` and `Maze` classes.
2. Implement the Recursive Backtracking algorithm.
3. Ensure the result is a 10x10 grid with exactly one path between any two points.

### Phase 3: Rendering & Movement
1. Implement the Canvas renderer for the black background and white walls.
2. Implement the player state, initialized at the **top-left corner (0, 0)**.
3. Draw the player as a dot in the center of the current cell.
4. Add event listeners for `keydown` (Arrow keys) to move the player if a wall is not in the way.

### Phase 4: Game Loop & Refinement
1. Implement the "Start Screen" overlay.
2. Add a "Win" condition (reaching the bottom-right corner) with a victory message and a "Play Again" button.
3. Ensure the maze regenerates for each new game.

## Verification & Testing
- **Visual Check:** Verify the 10x10 grid is correctly rendered with white walls.
- **Pathing Check:** Verify that the maze is solvable and contains no isolated areas.
- **Input Check:** Confirm Arrow keys move the player correctly without passing through walls.
