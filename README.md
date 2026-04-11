# HumintFlow — Frontend

HumintFlow is a full-stack, production-ready Customer Relationship Management (CRM) workspace designed to streamline sales operations and team collaboration. It centralizes customer data, deal tracking, and team activity into a single, cohesive platform.

## Product Overview
Built with a modern tech stack (React, Spring Boot, PostgreSQL, and Firebase), HumintFlow provides:
- **Unified Sales Workspace** — Manage Organizations, Contacts, and Pipelines in one place.
- **Advanced Segmentation** — Powerful nested filtering (AND/OR logic) via React Query Builder.
- **No-Code Automation** — Trigger-based workflows to handle repetitive tasks automatically.
- **Real-Time Insights** — Dynamic dashboards and push notifications (FCM) to keep the team aligned.

## Target Audience
- **Sales Teams** — For managing daily outreach and visualizing sales pipeline progression.
- **Sales Managers** — For monitoring performance via KPI cards and managing deal ownership.
- **Growth & Ops Teams** — For building advanced customer segments and automating cross-entity workflows.
- **SMBs** — For a modern, scalable, and responsive CRM solution that grows with their business.

---

## Tech Stack

| Concern | Library |
|---------|---------|
| UI Framework | React 18 / Vite 5 |
| Component Library | Material UI v5 (`@mui/material`) |
| Query Builder | `react-querybuilder` v7 |
| Icons | `lucide-react` |
| Styling | LESS + CSS variables (light/dark theming) |
| Auth | Firebase Authentication |
| Push Notifications | Firebase Cloud Messaging (FCM) |
| Routing | React Router v6 |
| Toasts | `react-hot-toast` |
| Package Manager | pnpm |

---

## Setup

```bash
pnpm install
pnpm dev          # http://localhost:5174
pnpm build        # production build → dist/
pnpm preview      # preview production build
```

---

## Environment Variables

Create a `.env` file (never commit it):

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_API_USERNAME=admin
VITE_API_PASSWORD=your_password
VITE_BANNER_DURATION=3000
```

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `/api` |
| `VITE_API_USERNAME` | HTTP Basic auth username | — |
| `VITE_API_PASSWORD` | HTTP Basic auth password | — |
| `VITE_BANNER_DURATION` | Live/mock banner dismiss time (ms) | `3000` |

---

## Routes

| Path | Page | Description |
|------|------|-------------|
| `/team` | TeamPage | Default landing — sales rep directory |
| `/directory` | CollapsibleList | Employee directory with full RQB filter engine |
| `/sales/organizations` | OrganizationsList | Company accounts table |
| `/sales/contacts` | ContactsList | People/contacts table |
| `/sales/pipeline` | PipelinePage | Multi-view pipeline (Table / Board / Calendar / Dashboard) |
| `/sales/dashboard` | SalesDashboard | KPI dashboard |
| `/segments` | CrmQueryPage | Advanced CRM segmentation query builder |
| `/automations` | AutomationsPage | No-code automation rules |
| `/settings/account` | ProfileView | User profile & account settings |

---

## Key Components

### Layout & Navigation
- **`Layout/`** — App shell (header, sidebar, content area, banner slot)
- **`Sidebar/SidebarNavigation`** — Left nav with section groups, user profile footer, theme toggle
- **`Sidebar/QuickFilterBuilder`** — Filter sidebar for Employee Directory (status checkboxes, department, RQB panel, saved views)
- **`Sidebar/SalesSidebarSavedViews`** — Saved Views card for Sales pages (Organizations / Contacts / Pipeline)

### Filter Bar
- **`InlineFilterBar/`** — Context-aware horizontal filter bar rendered above each table
  - `variant="directory"` — Status pills, Department dropdown, Build Custom Filter (RQB)
  - `variant="organizations"` — Industry dropdown, Country dropdown, Employee count buckets
  - `variant="contacts"` — Lifecycle Stage pills, Organization dropdown
  - `variant="pipeline"` — Pipeline Stage pills, Owner dropdown, Deal value buckets
- Uses `createPortal` for dropdowns to escape `overflow` clipping contexts

### Tables & Data
- **`ResultsTable/`** — Shared paginated data table with column sorting, bulk select, email, delete, export, save view, and clear filters
- **`CollapsibleList/`** — Employee Directory page shell (data fetch, RQB query state, fields, pagination)

### Sales Entities
- **`Sales/SalesDetailView`** — Inline-expandable or modal entity detail panel with About + Activity Timeline tabs
- **`Sales/CreateOrganizationModal`**, **`CreateContactModal`**, **`CreateOpportunityModal`** — Entity creation forms
- **`Sales/SalesSaveViewModal`** — MUI Dialog for naming and saving current Sales page filters (mirrors `SavedViewModal` styling)

### Query Builder
- **`QueryBuilderController/`** — Collapsible wrapper around `react-querybuilder`
- **`AutocompleteValueEditor/`** — Custom RQB value editor with type-ahead suggestions from live data

### Modals & Overlays
- **`SavedViewModal/`** — MUI Dialog for saving Employee Directory RQB query views
- **`EmailModal/`** — Bulk email composer
- **`ConfirmationModal/`** — Generic confirm/cancel dialog

### Other
- **`KanbanBoard/`** — Drag-and-drop pipeline board by deal stage
- **`CalendarView/`** — Meetings and tasks on a calendar grid
- **`SalesDashboard/`** — Revenue, win rate, and pipeline KPI charts
- **`AutomationsPage/`** — No-code automation rule builder and list
- **`DataSourceBanner/`** — Live vs. mock data status notification
- **`ErrorBoundary/`** — React error boundary with fallback UI

---

## Project Structure

```
src/
├── App.js                          # Root shell: routing, global state (query, savedViews, users)
├── components/
│   ├── CollapsibleList/            # Employee directory page component
│   ├── InlineFilterBar/            # Horizontal filter bar (multi-variant)
│   ├── Layout/                     # App shell
│   ├── ResultsTable/               # Shared paginated table
│   ├── Sales/
│   │   ├── SalesDetailView.js      # Entity detail panel (inline + modal)
│   │   ├── SalesSaveViewModal.js   # Save view dialog for Sales pages
│   │   ├── CreateOrganizationModal.js
│   │   ├── CreateContactModal.js
│   │   └── CreateOpportunityModal.js
│   ├── SavedViewModal/             # Save view dialog for Employee Directory
│   ├── Sidebar/
│   │   ├── SidebarNavigation.js    # Main nav + user profile footer
│   │   ├── QuickFilterBuilder.js   # Filter sidebar (directory only)
│   │   └── SalesSidebarSavedViews.js  # Saved views card for sales routes
│   ├── SalesSavedViews/            # (legacy inline strip — superseded by sidebar pattern)
│   ├── AutomationsPage/
│   ├── EmailModal/
│   ├── ConfirmationModal/
│   ├── DataSourceBanner/
│   └── ErrorBoundary/
├── pages/
│   ├── Sales/
│   │   ├── OrganizationsList.js    # Organizations table page
│   │   ├── ContactsList.js         # Contacts table page
│   │   ├── OpportunitiesList.js    # Opportunities table (used inside PipelinePage)
│   │   ├── PipelinePage.js         # Multi-view shell (Table/Board/Calendar/Dashboard)
│   │   ├── KanbanBoard.js
│   │   ├── CalendarView.js
│   │   └── SalesDashboard.js
│   ├── Segments/
│   │   └── CrmQueryPage.js         # Advanced CRM segmentation query builder
│   └── Team/
│       └── TeamPage.js             # Sales team management
├── services/
│   ├── userApi.js                  # Users, variables, saved views API
│   ├── organizationApi.js
│   ├── contactApi.js
│   └── opportunityApi.js
├── utils/
│   ├── queryFilter.js              # Client-side RQB-compatible filter engine
│   ├── salesFilterUtils.js         # Sales page filter constants, builders, option derivers
│   ├── exportUtils.js              # CSV export helpers
│   ├── fieldUtils.js               # Field enhancement (autocomplete values)
│   └── validators/                 # Input validation + sanitization
├── config/
│   └── queryConfig.js              # RQB field definitions built from variables
├── context/
│   ├── AuthProvider.js             # Firebase auth state + JWT handling
│   ├── ThemeContext.js             # Dark/light mode engine
│   └── NotificationContext.js      # In-app notification state
├── hooks/
│   └── useFcmToken.js              # Firebase Cloud Messaging token registration
├── data/
│   ├── mockData.js                 # Fallback user data (no backend)
│   └── mockVariables.js            # Fallback field definitions
└── styles/
    ├── variables.less              # CSS custom properties (colors, spacing, shadows)
    ├── App.less
    ├── InlineFilterBar.less
    ├── QuickFilterBuilder.less
    ├── ResultsTable.less
    ├── CollapsibleList.less
    └── ...                         # Per-component style files
```

---

## Filter Architecture

### Employee Directory (`/directory`)
- Uses `react-querybuilder` with a full nested logic engine
- Global `query` state lives in `App.js`, passed down to `CollapsibleList`
- Sidebar `QuickFilterBuilder` reads/writes the same `query` state
- `filterData(users, query)` performs client-side matching
- Saved views stored as serialized RQB query JSON via `saveView()` API

### Sales Pages (Organizations / Contacts / Pipeline)
- Each page owns its own flat `filters` state (e.g., `{ industry, country, employeeBucket }`)
- `buildSalesQuery(filters, variant)` converts flat state → RQB-compatible query for `filterData()`
- `deriveFilterOptions(allData, variant)` extracts unique dropdown values from the full dataset
- All records fetched at once (`size=500`), filtered and paginated client-side
- Saved views: stored with `{ entityType, filters }` in `queryJson`; sidebar widget (`SalesSidebarSavedViews`) applies via `?applyView=ID` URL param; each page listens on `location.search`

---

## Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| **Flat filter state for Sales pages** | RQB query objects are complex for simple dropdowns/pills; flat objects are easier to serialize, diff, and display in save dialogs |
| **Client-side pagination for Sales** | Server-side page-by-page is incompatible with client-side filtering; `size=500` fetch + local slice is the pragmatic solution until a proper filter API exists |
| **`createPortal` for dropdowns** | `overflow-x: auto` on the filter bar creates a stacking context that clips `position: absolute` menus; portal + `getBoundingClientRect` escapes it |
| **Variant prop on InlineFilterBar** | One component handles all pages via a `variant` switch; avoids duplicating the toolbar shell, active filter count, and clear button |
| **URL param for applying saved views** | Sales page `filters` state is local; the sidebar can't write to it directly. Navigate with `?applyView=ID` → page `useEffect` fetches + applies → clears URL. No context or prop-drilling needed |
| **`salesViewSaved` DOM event** | After a save, the Sales page dispatches a custom event; `SalesSidebarSavedViews` listens and re-fetches its list. Avoids lifting state to App.js |
| **`entityType` encoded in `queryJson`** | The backend `saved_views` table has no entity type column; encoding `{ entityType, filters }` in the JSON blob allows client-side scoping per page |

---

## License

MIT
