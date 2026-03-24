# Project Mandates: Schnappt

These rules take absolute precedence over all other instructions.

## Testing Standards
- **Test-Driven Development:** For every new feature or logic change, you MUST write or update corresponding tests in `src/*.test.ts`.
- **Validation:** No task is considered "complete" until you have executed `npm test` and verified that 100% of tests pass.
- **Regression:** If a change causes a test failure, you must fix it immediately before proceeding with other work.

## Architectural Style
- Maintain the procedural generation logic in `src/maze.ts`.
- Keep rendering concerns isolated in `src/renderer.ts`.
