# Feature Plan: 04 - Improved Door & Key Placement

## Objective
Ensure the locked door is never placed on a "corridor" (a path with no side branches) that leads from the start. The key must always be located on a side path, and the door should only be placed once at least one such side path is available behind it.

## Key Files & Context
- `src/maze.ts`: Update `placeDoorAndKey` to search for a valid door location that has at least one side branch before it.
- `src/maze.test.ts`: Add a test case to verify the key is never placed on the solution path.

## Proposed Solution

### 1. Refined Placement Algorithm
Update `placeDoorAndKey` in `src/maze.ts`:
- Start the initial `doorIndex` at a reasonable minimum (e.g., 30% of the solution path).
- Use a loop to find the first `doorIndex` that satisfies the requirement:
    1. Collect all side branches for cells from `solutionPath[0]` to `solutionPath[doorIndex]`.
    2. If the number of side branches is greater than 0:
        - This is a valid location. Stop searching.
    3. If not:
        - Increment `doorIndex` and try again.
- Once a valid `doorIndex` is found, place the **Door** at that index.
- Place the **Key** in one of the discovered side branches.

### 2. Safeguards
- If no side branches are found even after checking the entire path (very rare in a recursive backtracking maze), we will log a warning and fallback to the middle of the path, but the priority is always to find a side branch.

## Phased Implementation Plan

### Phase 1: Update Placement Logic
1. Modify `placeDoorAndKey` to include the search loop.
2. Ensure the key is only placed if `sideBranchCells.length > 0`.

### Phase 2: Verification
1. Run `npm test` to ensure existing tests still pass.
2. Add a new test in `src/maze.test.ts` specifically checking that `maze.grid[y][x].hasKey` is never true for any cell that is part of `maze.findPath(start, goal, true)`.

## Verification & Testing
- **Key Location Test:** Assert that the key cell is NOT in the `solutionPath` array.
- **Door Reachability Test:** Assert that a path exists to the key without passing the door.
