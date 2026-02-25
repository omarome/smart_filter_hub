## React Query Builder Advanced Filters

A React demo application that showcases a collapsible **advanced filters panel** built on top of `react-querybuilder`, with an **autocomplete value editor** and a live-updating results table.

![Query Builder component preview](./public/images/filters_with_suggestions.png)

### Features

- **Collapsible advanced filters panel** with dynamic rule count in the toggle button
- **Autocomplete value editor** for fields with predefined values (e.g. status, names)
- **Keyboard and mouse friendly UX** (arrow navigation, Enter to select, click outside to close)
- **React Query Builder integration** with custom value editor controls
- **Results table** that updates in real time as filters change
- **Modern LESS-based styling** with smooth layout for suggestions and panel transitions

### Setup

1. **Install dependencies**

```bash
pnpm install
```

2. **Start the development server**

```bash
pnpm start
```

The app will be available at `http://localhost:5173` (or the port shown in the terminal).

### Usage

1. Click the **"Advanced filters [X selected]"** button to expand or collapse the query builder panel.
2. Add rules using the **"Add rule"** and **"Add group"** buttons from `react-querybuilder`.
3. For fields with predefined values, start typing to see **autocomplete suggestions**, then:
   - Use arrow keys + Enter, or
   - Click a suggestion to select it.
4. The button label automatically updates to show the number of selected rules.
5. The **results table below** automatically filters and displays matching records based on your rules.

Example filters to try:

- `age > 30` to see users older than 30  
- `status = Active` to see only active users  
- `email contains example` to filter by email domain  
- Combine multiple rules with AND/OR logic

### Project Structure (high level)

```text
├── CollapsibleList.js                 # Page-level shell: query builder + results table
├── src/
│   ├── App.js                         # Top-level app component
│   ├── config/
│   │   └── queryConfig.js             # Base fields and default operators
│   ├── components/
│   │   ├── QueryBuilderController/    # Collapsible query builder controller
│   │   ├── AutocompleteValueEditor/   # Autocomplete value editor + hooks/subcomponents
│   │   └── ResultsTable/              # Simple results table for mock data
│   ├── data/
│   │   └── mockData.js                # Mock users dataset
│   ├── utils/
│   │   ├── queryFilter.js             # Applies query rules to data
│   │   ├── fieldUtils.js              # Enhances fields with values for autocomplete
│   │   └── queryUtils.js              # Helper utilities (e.g., rule counting)
│   └── styles/
│       ├── App.less
│       ├── CollapsibleList.less
│       ├── AutocompleteValueEditor.less
│       ├── QueryBuilderController.less
│       ├── QueryBuilderController.query-builder.less
│       └── index.less                 # Global styles and layout
├── public/
│   └── images/filter_with_suggestions.png
├── package.json
└── vite.config.js (or similar tooling config)
```
