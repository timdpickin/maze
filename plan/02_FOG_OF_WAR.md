# Feature Plan: 02 - Fog of War

## Objective
Implement a "Fog of War" effect where the maze starts covered in gray. The player can only see the walls of their current cell, and moving into a cell permanently clears the fog for that square.

## Key Files & Context
- `src/maze.ts`: Add a `discovered: boolean` property to the `Cell` class.
- `src/renderer.ts`: Update the `draw` method to only render cells and walls that are "discovered" or inside the player's current cell.
- `src/game.ts`: Update movement logic to mark the new cell as `discovered`.
- `src/maze.test.ts`: Add tests to ensure cells start as undiscovered and are correctly marked when discovered.

## Proposed Solution

### 1. State Management
Update the `Cell` class in `maze.ts` to include:
- `discovered: boolean`: Defaults to `false`.
- The start cell (0, 0) will be set to `discovered: true` upon initialization.

### 2. Rendering Logic
Update `Renderer.draw()` to:
- Fill the entire canvas with a "Fog Gray" (`#333`) before drawing anything else.
- When looping through cells:
    - If a cell is `discovered`:
        - Draw its floor (black).
        - Draw its walls (white).
        - If it's the goal cell (9, 9), draw the Green Goal.
    - If a cell is NOT `discovered` BUT is the **current player position**:
        - Draw its walls (white) so the player knows where they can move.
- The player dot is always drawn at the current position.

### 3. Game Logic
Update `Game.handleKey()`:
- After a successful move, set `maze.grid[playerPos.y][playerPos.x].discovered = true`.
- Update `Game.start()` to ensure the start cell (0,0) is marked `discovered` for each new game.

## Phased Implementation Plan

### Phase 1: State & Tests
1. Add `discovered` property to `Cell`.
2. Add a unit test in `maze.test.ts` to verify the discovery logic.
3. Ensure all cells (except the start) begin as undiscovered.

### Phase 2: Core Fog Rendering
1. Update `Renderer` to handle the gray fog background.
2. Modify `drawCell` to only draw if `discovered` is true.
3. Ensure the player dot is always visible.

### Phase 3: Proximity Visibility (Walls)
1. Update rendering to ensure the walls of the *current* cell are always visible to allow navigation.

### Phase 4: Final Polish
1. Hide the Goal until discovered.
2. Ensure the "Win" condition still works even if the goal is hidden.

## Verification & Testing
- **Unit Test:** `npm test` must pass, verifying the `discovered` state changes.
- **Visual Check:** Confirm that the maze is gray on start, and moving reveals black paths.
- **Navigation Check:** Verify walls are visible enough to see where you *can* move.
