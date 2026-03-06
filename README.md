# WiNKLMAYR Sales Dashboard — React Application

A modern sales dashboard for WiNKLMAYR × Mercedes-Benz Brand Center, Dubai.
Built with React, Chart.js, and PapaParse.

---

## Folder Structure

```
winklmayr-dashboard/
├── public/
│   └── index.html                 # HTML entry point
├── src/
│   ├── components/
│   │   ├── Header.js              # Top navigation bar
│   │   ├── Header.css
│   │   ├── Filters.js             # Date presets + dropdown filters
│   │   ├── Filters.css
│   │   ├── DashboardCards.js       # KPI metric cards
│   │   ├── DashboardCards.css
│   │   ├── Charts.js              # Line, Doughnut, Bar charts
│   │   ├── Charts.css
│   │   ├── SalesTable.js          # Sortable, paginated data table
│   │   └── SalesTable.css
│   ├── data/
│   │   └── config.js              # Constants, Google Sheet URL, helpers
│   ├── styles/
│   │   └── global.css             # CSS variables, base resets
│   ├── App.js                     # Root component (state, data fetching)
│   ├── App.css                    # App-level layout styles
│   └── index.js                   # React DOM entry point
├── package.json
└── README.md
```

---

## Step-by-Step Setup in VS Code

### Prerequisites

- **Node.js** (v18 or later) — download from https://nodejs.org
- **VS Code** — download from https://code.visualstudio.com

### 1. Create the Project Folder

Open VS Code, then open a terminal (`Ctrl + `` ` or `View > Terminal`).

```bash
mkdir winklmayr-dashboard
cd winklmayr-dashboard
```

### 2. Copy All Project Files

Copy every file from the provided project into the matching folder structure above.
You can do this by:
- Extracting the zip file into `winklmayr-dashboard/`, OR
- Manually creating each file and pasting the code

### 3. Install Dependencies

In the VS Code terminal, run:

```bash
npm install
```

This installs:
- `react` & `react-dom` — UI framework
- `react-scripts` — Create React App build tooling
- `chart.js` & `react-chartjs-2` — Charts
- `papaparse` — CSV parsing from Google Sheets
- `lucide-react` — Icon library
- `date-fns` — Date utilities

### 4. Configure Your Google Sheet URL

Open `src/data/config.js` and update the `SHEET_CSV_URL` constant
with your actual Google Sheets published CSV URL:

```js
export const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/YOUR_SHEET_ID/pub?gid=0&single=true&output=csv';
```

Make sure your Google Sheet is:
1. **Shared** → "Anyone with the link" → Viewer
2. **Published** → File → Share → Publish to web → CSV

### 5. Start the Development Server

```bash
npm start
```

This will:
- Start a local dev server at `http://localhost:3000`
- Automatically open it in your browser
- Hot-reload on any code changes

### 6. Build for Production (Optional)

```bash
npm run build
```

This creates an optimized `build/` folder you can deploy to any static hosting
(Netlify, Vercel, AWS S3, etc.).

---

## Key Features

| Feature | Description |
|---|---|
| **Date Presets** | Last 1 Week, Last 1 Month, or Custom Range with calendar pickers |
| **Region & Country Filters** | Pre-populated with Mercedes-Benz Centre / UAE |
| **5 KPI Cards** | Revenue, Orders, AOV, Top Product, Top Material |
| **4 Charts** | Revenue trend line, Category doughnut, Sub-category bar, Material doughnut |
| **Sales Log Table** | Sortable columns, search, pagination |
| **Auto-Refresh** | Polls Google Sheets every 2 minutes |
| **Responsive** | Fully adapts to desktop, tablet, and mobile |

---

## Customization

- **Colors & Branding**: Edit CSS variables in `src/styles/global.css`
- **Filters**: Add new Region/Country entries in `src/data/config.js`
- **Chart Colors**: Modify `CHART_COLORS` array in `src/data/config.js`
- **Poll Interval**: Change `POLL_INTERVAL` in `src/data/config.js` (ms)
