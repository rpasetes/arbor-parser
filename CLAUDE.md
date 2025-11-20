BEFORE ANYTHING ELSE: run 'bd onboard' and follow the instructions

---

# Claude Instructions for Arbor Parser

## Project Context
This is **Arbor Parser** - an interactive AST visualizer that teaches parsing concepts through direct manipulation. Users paste JavaScript or TypeScript code and see the tree structure in real-time.

**Key insight**: Make parsing feel concrete rather than mystical.

**Project History**: Originally named "Compile Time" and positioned as a compiler education tool, but rebranded in November 2025 to "Arbor Parser" with clearer focus on parsing specifically (the botanical metaphor fits parse trees perfectly).

## Core Principles

### 1. MVP-First Mindset
The MVP is deliberately minimal:
- Code input (CodeMirror editor)
- AST tree visualization
- Tree/Rings toggle for different visualization modes
- TypeScript parser (handles both JS and TS)

**Do not add features beyond MVP scope unless explicitly requested.** Every feature should justify its existence by making the core concept clearer.

### 2. Real-World Relevance
We support TypeScript because that's what people actually write in 2025. Users should be able to paste real production code - their own code, AI-generated code, library code - and see how it parses. This isn't about toy examples; it's about understanding the structure of code they encounter daily.

Dogfooding (visualizing our own source) is a nice bonus, but the primary value is relevance to modern development.

### 3. Teaching Through Exploration
The tool teaches by letting users play, not by explaining exhaustively. Visual clarity and interaction are more important than comprehensive documentation within the tool.

### 4. Focus on Parsing, Not Compilation
This tool is NOT teaching compilation end-to-end. We use TypeScript's parser (we don't build a parser). The educational value is in:
- Understanding what parsing is (lexical + syntactic analysis)
- Seeing how code becomes structured data (ASTs)
- Learning why this matters for developer tools (linters, formatters, refactoring, transpilers, IDEs)

## Technical Stack

### Core Dependencies
- **React + TypeScript** (Vite template: `react-ts`)
- **TypeScript Parser** (`typescript` package)
  - Parses both JavaScript and TypeScript
  - Use `ts.createSourceFile()` for parsing
  - We always use `ScriptKind.TS` (it's a superset, handles plain JS too)
- **CodeMirror 6** - Modern code editor with syntax highlighting
- **D3** - Used for radial "rings" visualization

### Parsing Strategy
```typescript
import * as ts from 'typescript';

const ast = ts.createSourceFile(
  'temp.ts',
  sourceCode,
  ts.ScriptTarget.Latest,
  true, // setParentNodes
  ts.ScriptKind.TS
);
```

## Development Workflow

### Issue Tracking with Beads

**Philosophy:** Beads isn't just task tracking - it's building a **knowledge graph** of the project's evolution. Track completed investigative/strategic work retroactively to create decision history, not just implementation history.

#### Session Start Protocol

```bash
# 1. Pull latest changes
git checkout main && git pull origin main

# 2. Import any remote issue updates
bd sync

# 3. See what's ready to work on
bd ready --json
```

#### During Session

```bash
# Create issues for new work discovered
bd create "Description" -t feature -p 1

# Update status as you work
bd update <issue-id> --status in_progress

# Close when complete
bd close <issue-id> --reason "Implemented"

# Link related issues to build dependency graph
bd dep add <new-id> <parent-id> --type discovered-from
bd dep add <blocked-id> <blocker-id> --type blocks
```

**Key behaviors:**
- Create issues proactively as work is discovered
- Link discovered work to maintain context between decisions
- One issue `in_progress` at a time
- Close issues immediately when complete, don't batch
- Track **investigative work** (research, experiments) not just features

#### Session End Protocol (Critical!)

```bash
# 1. Close all finished work
bd close <ids> --reason "..."

# 2. File remaining TODOs as issues
bd create "Remaining work description" -t task -p N

# 3. Force flush everything (bypasses 30s debounce)
bd sync

# 4. Commit Beads state
git add .beads/issues.jsonl
git commit -m "Update issue tracker"

# 5. Push
git push
```

**Why this matters:** Without `bd sync` at session end, changes stay in the database only. The sync protocol ensures:
- Exports DB → JSONL (source of truth for git)
- Commits and pulls latest changes
- Imports remote updates → DB
- Pushes to remote

#### Beads Infrastructure Details

**Architecture:**
- **SQLite DB** (.beads/beads.db) - Local source of truth, gitignored
- **JSONL file** (.beads/issues.jsonl) - Remote source of truth, in git
- **Daemon** - Background process syncing DB ↔ JSONL (30s debounce)
- **Git hooks** - Enforces consistency on git operations

**Installed hooks:**
- `pre-commit` - Flushes pending DB changes to JSONL before commit
- `post-merge` - Imports updated JSONL to DB after pull
- `pre-push` - Exports DB to JSONL before push (prevents stale JSONL)
- `post-checkout` - Imports JSONL after branch changes

**Troubleshooting:**

If daemon won't start:
```bash
bd info  # Check daemon status and reason
bd daemons logs . -n 100  # Read error logs
```

If "snapshot too old" error:
```bash
bd export  # Force re-export, creates fresh snapshot
```

If JSONL/DB diverge:
```bash
# Choose one based on which is more recent:
bd export  # DB → JSONL (use if DB is newer)
bd import  # JSONL → DB (use if JSONL is newer)
```

**Important Notes:**
- Daemon auto-restarts on version upgrades
- Changes batch within 30s window (good for rapid iteration)
- `bd sync` forces immediate flush when needed
- Never manually edit issues.jsonl - always use bd commands

#### Advanced Beads Features (Encouraged to Explore!)

**Issue Type Taxonomy:**
- `epic` - Large multi-session projects spanning multiple features
- `feature` - New functionality or capabilities
- `task` - Investigations, research, documentation work
- `bug` - Fixing broken behavior discovered in testing
- `chore` - Maintenance, refactoring, infrastructure work

**Dependency Types as Semantic Relationships:**
- `blocks` - "Can't implement X until Y is done" (hard blocker)
- `discovered-from` - "While doing X, found we need Y" (captures exploration path)
- `related` - "These solve similar problems" (conceptual link)
- `parent-child` - Breaking down epics into smaller tasks (hierarchical)

**Useful Commands for Exploration:**
```bash
# Visualize decision trees
bd dep tree <issue-id>

# Find all issues discovered during investigation
bd list --json | jq '.[] | select(.dependencies[].type == "discovered-from")'

# Label issues by area
bd label add <issue-id> parser ui docs infra

# Create epics for large projects
bd create "Implement bidirectional highlighting" -t epic -p 1
bd epic list  # View all epics

# View dependency cycles (should be empty!)
bd dep cycles
```

**Philosophy on Exploration:**
Treat Beads as a **living knowledge base**, not just a checklist. Experiment with:
- Different issue types for different work modes
- Dependency relationships to capture "why" decisions were made
- Retroactive issue creation for completed investigative work
- Labels and metadata for organizing by domain
- Epics for tracking multi-session initiatives

The richer the metadata, the better future sessions can understand project history without re-reading all git commits.

### Git Workflow & Pull Requests

**Branch Strategy:**
- Create feature branches with encoded intent (e.g., `feature/ast-visualization`, `fix/parse-errors`, `refactor/rebrand-arbor-parser`)
- Branch name should convey the app-level change being made

**Git Best Practices:**
1. **Always start fresh:**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/descriptive-name
   ```
2. **Commit frequently** - don't let work sit uncommitted
3. **Single-line commit messages only** - no multi-line, no heredocs
4. **Avoid git stash** - prefer WIP commits instead
5. **Use `git status` liberally** - always know your current state
6. **Never use `git reset --hard` or `git clean -fd`** without explicit user approval

**PR Philosophy:**
PRs represent **distinct app-level changes** based on user intent, not just issue completion:
- **PR = user intent** (new feature, bug fix, refactor)
- **Issues = implementation tracking** (work breakdown to achieve that intent)
- One PR might close multiple related issues
- One large issue might span multiple PRs

**PR Creation:**
- Create PRs when we've completed a meaningful app-level change
- PR title: Clear statement of intent
- PR description: Succinct summary - what changed and why (2-4 short bullet points max)
- Reference related Beads issues if relevant
- **Commit messages: SINGLE LINE ONLY** - clear, descriptive, no multi-line
- Always checkout main, pull latest, then create new branch

**Beads + PR Relationship:**
- Use Beads for internal work tracking and memory
- Beads issues track implementation breakdown
- When creating PR, close/update relevant Beads issues
- Sync Beads before PR creation: `bd sync && git add .beads/issues.jsonl && git commit -m "Update issue tracker"`

**Future Note:**
CodeRabbit will eventually handle PR generation - workflow will adjust when that's configured.

### Session-Ending Protocol
Before finishing:
1. File issues for remaining work and TODOs
2. Close completed issues
3. Sync Beads: `bd sync && git add .beads/issues.jsonl && git commit -m "Update issue tracker"`
4. Push all changes
5. Run `bd ready --json` to see next session's options

## Code Style & Patterns

### File Organization
```
src/
  components/
    CodeEditor.tsx           # CodeMirror editor
    ASTTree.tsx              # Tree container + recursive TreeNode
    ASTNode.tsx              # Individual node rendering
    BlobVisualization.tsx    # Radial "rings" view
    SegmentedControl.tsx     # Tree/Rings toggle
  utils/
    parser.ts                # TypeScript parser wrapper
  App.tsx                   # Main component
docs/
  NOV20-WHY-PARSING-MATTERS.md  # Comprehensive parsing research
```

### Component Patterns
- **Functional components** with hooks
- **Props interfaces** explicitly defined
- **Keep components small** - single responsibility
- **Inline styles** currently used (no CSS modules/Tailwind yet)

### AST Node Handling
TypeScript AST nodes are complex. For display, extract:
- `node.kind` (the SyntaxKind enum value)
- Key properties (e.g., `text` for identifiers/literals)
- Position info (`node.pos`, `node.end`) for potential highlighting

Don't try to show every property - overwhelming. Show the essential structure.

### Error Handling
- Parse errors should be caught and displayed gracefully
- TypeScript's parser is fault-tolerant (returns partial AST even with errors)
- Show error message if parsing completely fails
- Currently we always return the AST regardless of errors

## Code Comments Philosophy

All code comments use **"PARSING INSIGHT #N"** format with detailed explanations:
- Explain what the code does in parsing terms
- Connect to real-world developer tools (ESLint, Prettier, VS Code, etc.)
- Use concrete examples (e.g., "const x = 5" → tokens)
- Focus on "why this matters" for the user's understanding

See existing comments in `src/utils/parser.ts`, `src/App.tsx`, and component files for the style.

## Testing Strategy
- **Manual testing** during development
- Test with real-world JavaScript and TypeScript code
- Test error cases (syntax errors, incomplete code)
- Performance: parsing should feel instant (<100ms)

## Performance Considerations
- Parsing is fast (TypeScript's parser is highly optimized)
- Tree rendering may need optimization for very deep trees in the future
- Radial visualization uses D3 (generally performant)
- Target: <100ms parse + <50ms render for typical input

## Accessibility
- Keyboard navigation through tree
- Focus indicators on interactive elements
- Screen reader friendly (aria labels on nodes)
- High contrast support

## What NOT to Do
- Don't write a parser from scratch (use TypeScript's parser)
- Don't add features speculatively beyond MVP
- Don't over-engineer layouts
- Don't create markdown documentation files unless explicitly asked
- Don't use emojis unless explicitly requested
- Don't use terms like "compiler" when we mean "parser"

## Decision-Making Framework

When facing choices, bias toward:
1. **Simpler implementation** over more features
2. **Visual clarity** over information density
3. **Teaching value** over technical completeness
4. **Working software** over perfect architecture

When unsure, ask the user rather than assuming.

## Key Teaching Moments
The tool should make these insights clear through interaction:
1. **Code is not text** - it's structured data (ASTs)
2. **Tree shape = meaning** - structure encodes semantics
3. **Recursive nature** - expressions contain expressions contain expressions
4. **Why this matters** - foundation for every developer tool you use daily

## Current State (November 2025)

✅ **MVP Complete:**
- CodeMirror 6 editor with TypeScript/JavaScript syntax highlighting
- Tree visualization with recursive rendering
- Radial "rings" visualization (experimental D3 implementation)
- Split-pane layout (50/50) with proper viewport handling
- Tree/Rings segmented control toggle
- Real-time parsing as you type
- Educational comments throughout codebase

📝 **Recent Rebrand:**
- Changed from "Compile Time" → "Arbor Parser"
- Updated all references (package.json, HTML title, App header)
- Changed all code comments from "COMPILER INSIGHT" to "PARSING INSIGHT"
- Enhanced comments with detailed parsing explanations
- Created comprehensive research doc: `docs/NOV20-WHY-PARSING-MATTERS.md`
- Branch: `refactor/rebrand-arbor-parser` (pending merge to main)

🎯 **What's Working:**
- TypeScript parser integration (`ts.createSourceFile`)
- AST traversal with `ts.forEachChild`
- Node type display using `ts.SyntaxKind` enum
- Literal/identifier value display
- Fixed viewport sizing (no more overflow issues)

## Potential Future Work (Not Prioritized)

These are ideas mentioned but NOT current priorities:
- Bidirectional highlighting (click node → highlight code, click code → highlight node)
- Preset example snippets
- Better error recovery UI
- Search/filter nodes in tree
- Export AST as JSON
- Node detail panel showing all properties

**Do not implement these unless explicitly requested.**

## Resources
- [TypeScript Compiler API](https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API)
- [TS AST Viewer](https://ts-ast-viewer.com/) - reference for exploring TS ASTs
- [Beads Documentation](https://github.com/steveyegge/beads)
- [docs/NOV20-WHY-PARSING-MATTERS.md](./docs/NOV20-WHY-PARSING-MATTERS.md) - Comprehensive parsing research

---

**Remember**: This tool exists to make parsing feel concrete, not to be a comprehensive IDE or compiler course. Every decision should serve the learning experience. The focus is on **parsing** specifically - how code text becomes structured trees, and why that matters for the tools developers use every day.
