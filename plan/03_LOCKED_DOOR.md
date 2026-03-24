# Feature Plan: 03 - Locked Door & Key

## Objective
Add a locked door that blocks the mandatory path from the start to the goal. A key must be placed on a side path (not the direct route) that the player must collect to unlock and remove the door.

## Key Files & Context
- `src/maze.ts`: 
    - Add pathfinding logic (BFS) to find the "solution path."
    - Add `door: boolean` and `key: boolean` properties to `Cell`.
    - Implement logic to place the door on the solution path and the key on a non-solution branch.
- `src/renderer.ts`:
    - Draw the Key (e.g., a yellow symbol) if the cell is discovered.
    - Draw the Door (e.g., a thick red wall) between two cells.
- `src/game.ts`:
    - Track `hasKey: boolean` in the game state.
    - Update movement logic to check for doors and key collection.
    - Display status messages ("Locked!", "Key Collected!").

## Proposed Solution

### 1. State Management & Architecture
- **Cell Class:** Add `isDoor`, `hasKey`, and `doorDirection` properties.
- **Maze Class:** Add a list of `doors` and `keys` to support future expansion (multiple sets).
- **Game State:** Maintain an `inventory` (e.g., a set of collected keys).

### 2. Door Placement Logic
- After generating the maze, run **Breadth-First Search (BFS)** from (0,0) to (9,9) to identify the "Solution Path."
- Pick a random cell on the **Solution Path** (excluding the start and the goal).
- Place a **Door** on one of the exit walls of that cell that leads further down the solution path.

### 3. Key Placement Logic
- **Reachability Check:** The key MUST be placed in a section of the maze that is reachable from the start *without* passing through the door.
- **Algorithm:**
    1. Identify all cells on the "Start-side" of the door (cells that come before the door cell on the Solution Path).
    2. For each of these cells, find all connected side-branches (cells not on the Solution Path).
    3. Pick a random cell from these "pre-door" side-branches to place the **Key**.
- This guarantees the player can always find the key before they are blocked by the door.

### 4. Rendering Logic
- Fill the entire canvas with a "Fog Gray" (`#333`) before drawing anything else.
- When looping through cells:
    - If a cell is `discovered`:
        - Draw its floor (black).
        - If it has a **Key**, draw a yellow icon.
        - If it has a **Door**, draw it as a thick red wall.
- **Door Interaction:** If the player tries to move through a wall marked as a `door`, check the player's inventory.
    - If they have the key: **Remove the door** permanently and allow movement.
    - If they don't: Show a temporary **Toast Message** ("Door is Locked! Find the key.") and block movement.

### 5. Messaging (Toast System)
- Add a temporary "Toast" system in `Game` that shows a message for a few seconds before fading out.

## Phased Implementation Plan

### Phase 1: State & Tests
1. Implement a BFS helper in `Maze` to find the solution path.
2. Add `isDoor`, `hasKey`, and `doorDirection` properties to the `Cell` class.
3. Add a test to verify the door is on the path and the key is not.

### Phase 2: Placement Logic
1. Implement the algorithm to select the door cell and key cell.
2. Ensure the door is placed between two specific cells.

### Phase 3: Rendering & Toast
1. Update `Renderer` to draw a yellow circle/icon for the key and a thick Red line for the door (only if `discovered`).
2. Implement a simple "Toast" message UI (temporary text).

### Phase 4: Interaction
1. Update `Game.handleKey` to handle door collisions and key collection.
2. Ensure unlocking the door removes it entirely from the maze.

## Verification & Testing
- **Pathing Test:** Verify that without the key, the goal is unreachable.
- **Key Test:** Verify that entering the key cell updates the player's inventory.
- **Unlocking Test:** Verify that with the key, the door wall is ignored/removed.
