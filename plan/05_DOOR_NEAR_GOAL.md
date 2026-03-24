# Feature Plan: 05 - Door Near Goal

## Objective
Update the maze generation logic to ensure the locked door is placed within 5 steps of the goal (bottom-right corner) along the solution path. This prevents the door from being placed too close to the start and forces the player to explore most of the maze before finding the barrier.

## Key Files & Context
- `src/maze.ts`: Update `placeDoorAndKey` to search for a door location starting from the end of the solution path (near the goal).
- `src/maze.test.ts`: Add a test case to verify the door's position on the solution path relative to the goal.

## Proposed Solution

### 1. Refined Placement Algorithm
Update `placeDoorAndKey` in `src/maze.ts`:
- Define `maxIndex = solutionPath.length - 2` (the last possible cell before the goal).
- Define `minIndex = Math.max(1, solutionPath.length - 6)` (the cell 5 steps back from the goal).
- Loop `i` from `maxIndex` down to `1`:
    1. Calculate all side branches for cells from `solutionPath[0]` to `solutionPath[i]`.
    2. If the number of side branches is greater than 0:
        - If `i >= minIndex`, this is a perfect spot (within 5 squares). Use it and stop.
        - If `i < minIndex`, this is the *best possible* spot even if it's further than 5 squares. Use it and stop.
- This ensures we pick the valid door location that is **closest to the goal**.

### 2. Safeguards
- If no side branches are found in the entire maze, we will fallback to the middle of the path as before, though this is logically impossible in a 10x10 recursive backtracking maze.

## Phased Implementation Plan

### Phase 1: Update Placement Logic
1. Modify `placeDoorAndKey` to search backwards from the goal.
2. Prioritize valid spots that are within the last 5 steps of the path.

### Phase 2: Verification
1. Run `npm test` to ensure existing tests still pass.
2. Add a new test in `src/maze.test.ts` to verify the `doorIndex` is within the last few steps of the `solutionPath`.

## Verification & Testing
- **Door Proximity Test:** Assert that the door is at an index in `solutionPath` that is `path.length - 6` or higher (if possible).
- **Correct Placement Test:** Verify the door still blocks the path and the key is reachable.
