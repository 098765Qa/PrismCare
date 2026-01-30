How to Run PrismCare 
PrismCare has 2 servers that must run at the same time:
Start the Web App (Frontend + Dashboards)
Runs the public website, login page, admin panel, staff dashboard, and EJS views.
node index.js 
Runs on:
http://localhost:3000 

Start the Backend API (AI, GPS, Offline, Notifications, All Data)
Handles all API routes, AI chat, GPS logs, offline sync, notifications, and database operations.
node api.js 
Runs on:
http://localhost:5000 
Summary
Frontend: node index.js → port 3000
Backend API: node api.js → port 5000
Both must run together for the full system to work.
