# Modern SaaS Dashboard

A professional, high-performance Full-Stack Admin Dashboard built with Next.js (App Router) and PocketBase. This project features absolute TypeScript safety, generic reusable table layouts, dynamic forms, and centralized error/notification handling.

---

## 📁 Project Structure

```text
modern-dashboard/
├── backend/
│   └── pb_data/         # Pre-seeded database, schemas, and configurations
├── frontend/
│   ├── src/             # Next.js source code (Components, Hooks, Libs)
│   ├── package.json     # Frontend dependencies
│   └── ...
└── .gitignore           # Global git ignore configuration
🚀 How to Run Locally
Follow these simple steps to get the application up and running on your local machine.

1. Backend Setup (PocketBase)
Download the PocketBase binary compatible with your Operating System (Windows, macOS, or Linux) from the official website: PocketBase Releases.

Extract the downloaded ZIP file.

Move the compiled pocketbase executable file directly inside the /backend directory of this project (next to the pb_data folder).

Open your terminal in the /backend folder and run the following command to start the server:

Bash
./pocketbase serve --http=0.0.0.0:8090
The backend server will be live at: http://127.0.0.1:8090/_/

2. Frontend Setup (Next.js)
Open a new terminal window and navigate to the /frontend directory:

Bash
cd frontend
Install the required Node packages:

Bash
npm install
Start the Next.js local development server:

Bash
npm run dev
Open your browser and navigate to: http://localhost:3000

🌟 Key Features Implemented
100% Type-Safe Infrastructure: Clean TypeScript definitions across all data models.

Centralized Notifications: Clean toast configurations powered by Sonner without UI-logic mixing.

Generic Table Layouts: Reusable table cells, layouts, and confirmation modals.

Clean Monorepo Design: Separated frontend and backend modules for standard development workflows.
