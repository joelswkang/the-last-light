# The Last Light

A mobile-first hand-painted 2D exploration, restoration and settlement game.

## Stack
- Phaser 3.90 + TypeScript
- Vite build tool
- GitHub Pages deployment via GitHub Actions
- Local save data via browser localStorage (cloud sync planned, not yet implemented)

## Run locally
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## Deploy to GitHub Pages
1. Push this project to its `main` branch.
2. In Settings → Pages, select **GitHub Actions** as the deployment source.
3. Pushes to `main` will build and deploy automatically.

## Prototype 0.1
- Responsive mobile-first game shell
- Phaser-rendered illustrated clearing
- Tap-to-gather wood and provisions
- Repair shelter and kindle the beacon
- Persistent local progress
- Placeholder chapter/world/journal navigation

## Roadmap
- 0.2: Real illustrated asset pack, character portraits, richer environment animation
- 0.3: Expedition map, branching events and discoveries
- 0.4: Villagers, needs, relationships and settlement buildings
- 0.5: Night survival, light radius, creatures and tactical encounters
- 0.6: Inventory, equipment, crafting and quests
- 0.7: Save migration, export/import and optional cloud sync
