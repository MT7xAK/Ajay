# 🏛️ Smart Local Problem Reporter & Auto-Solution Suggestion System

A full-stack civic issue reporting platform where citizens submit local complaints and receive **instant rule-based suggestions**, while admins manage and resolve them through a dedicated dashboard.

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)]()
[![CSS3](https://img.shields.io/badge/CSS3-1572E6?style=flat-square&logo=css3&logoColor=white)]()
[![JavaScript](https://img.shields.io/badge/VanillaJS-F7DF1E?style=flat-square&logo=javascript&logoColor=black)]()
[![Java](https://img.shields.io/badge/Java%2017-ED8B00?style=flat-square&logo=openjdk&logoColor=white)]()
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot%203.2-6DB33F?style=flat-square&logo=springboot&logoColor=white)]()
[![MySQL](https://img.shields.io/badge/MySQL%208-4479A1?style=flat-square&logo=mysql&logoColor=white)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

---

## Contents

- [Why this project?](#-why-this-project)
- [Features](#-features)
- [Quick Start (Browser Demo)](#-quick-start-browser-demo)
- [Backend Setup (Java + MySQL)](#-backend-setup-java--mysql)
- [API Endpoints](#-api-endpoints)
- [Suggestion Engine Coverage](#-suggestion-engine-coverage)
- [Project Structure](#-project-structure)
- [Tech Stack](#-tech-stack)
- [Database Schema](#-database-schema)
- [Security Notes (Production Checklist)](#-security-notes-production-checklist)
- [Contributing](#-contributing)
- [License](#-license)

---

## 💡 Why this project?

Most civic grievance portals only let citizens *file* a complaint and leave them guessing what happens next. **Smart Local Problem Reporter** bridges that gap: the moment a citizen picks an issue category, the built-in rule-based engine returns actionable guidance — the responsible authority, helpline numbers, escalation paths, and expected resolution timelines — alongside the standard tracking workflow.

The project ships in two modes:

1. **Zero-install browser demo** — the entire app (auth, complaints, admin dashboard, charts) runs on vanilla JS with `localStorage` as the data layer. Just open `index.html`.
2. **Full-stack reference backend** — a Java 17 / Spring Boot 3.2 REST API backed by MySQL 8 for production-style deployments.

---

## ✨ Features

### Citizen Features

| Feature | Description |
|---|---|
| 🧙 Multi-step Complaint Form | 3-step wizard: Category → Details → Review |
| 🗂️ 12 Issue Categories | Pothole, Street Light, Water, Garbage, Sewage, Noise, Stray Animals, Illegal Construction, Parks, Traffic, Power Cut, Other |
| 💡 Rule-Based Suggestions | Instant action steps on category selection — authority contacts and escalation paths |
| 📍 Location Capture | Address + "Use my location" geolocation with Google Maps embed preview |
| 🔄 Real-Time Status Tracking | Pending → In Progress → Resolved |
| 📷 Image Upload | Attach photos to complaints (stored as base64) |
| ⭐ Feedback System | 5-star rating + comments for resolved complaints |
| 📋 Complaint History | Filterable list with expand-to-view details |

### Admin Features

| Feature | Description |
|---|---|
| 📊 Admin Dashboard | Overview stats and resolution rate |
| 📈 3 Chart Types | Doughnut (by category), Bar (by status), Line (7-day trend) via Chart.js |
| 🔍 Full Complaint Table | Search, filter by status/category, inline status updates |
| 📝 Detail Modal | Full complaint view with admin note editor |
| 💡 Suggestion Preview | Admins see the same suggestions citizens receive |

### Design

- Professional civic-portal UI — government-style utility bar, helpline block, multi-column footer
- Premium HSL design system with a civic-blue palette (Google Fonts: Inter)
- Live portal statistics computed from real submitted data (no fake numbers)
- Fully responsive, mobile-first layout with collapsible sidebar
- Micro-animations, toasts, star ratings, and wizard-step transitions

> **Data policy:** the portal ships with **no demo accounts or seeded complaints** — every record comes from real registrations and filings made in the browser.

---

## 🚀 Quick Start (Browser Demo)

No installation required:

```
Open index.html in any modern browser → Register (Citizen or Department Admin) → Report issues
```

> ⚠️ **Note on geolocation:** the "Use my location" feature requires `http://localhost` or HTTPS (browser security policy). It will not prompt for permission over `file://`. Serve the folder locally for full functionality:

```bash
# Python
python -m http.server 8000

# or Node.js
npx serve .
```

Then visit `http://localhost:8000`. All demo data is stored in your browser's `localStorage` — no server-side persistence needed.

---

## ☕ Backend Setup (Java + MySQL)

The `backend/` folder contains a full Spring Boot 3.2 reference implementation.

### Prerequisites

- **Java 17+**
- **Maven 3.8+**
- **MySQL 8+**

### Steps

```bash
# 1. Create the schema (tables, foreign keys, views, triggers)
mysql -u root -p < database/schema.sql

# 2. (Optional) Load sample seed data
mysql -u root -p smart_problem_reporter < database/seed.sql

# 3. Update DB credentials in
#    backend/src/main/resources/application.properties

# 4. Run the API
cd backend
mvn spring-boot:run
```

The API starts at `http://localhost:8080`.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Login |
| `POST` | `/api/auth/logout` | Logout |
| `GET` | `/api/complaints` | My complaints |
| `POST` | `/api/complaints` | Submit complaint (supports multipart image) |
| `GET` | `/api/complaints/{id}` | Single complaint |
| `PUT` | `/api/complaints/{id}/status` | Update status *(admin)* |
| `POST` | `/api/complaints/{id}/feedback` | Submit feedback |
| `GET` | `/api/admin/complaints` | All complaints *(admin)* |
| `GET` | `/api/admin/stats` | Dashboard statistics *(admin)* |

---

## 🗺️ Suggestion Engine Coverage

Each category maps to a responsible authority and helpline:

| Category | Authority | Contact |
|---|---|---|
| Pothole / Road Damage | Public Works Dept (PWD) | 1800-425-1520 |
| Street Light | BESCOM | 1912 |
| Water Supply | BWSSB | 1916 |
| Garbage Collection | BBMP Sahaaya | 1533 |
| Sewage / Drainage | BWSSB Sewerage | 1916 |
| Noise Pollution | Police / KSPCB | 100 |
| Stray Animals | BBMP / CUPA | 080-22975555 |
| Illegal Construction | BBMP Town Planning | 1533 |
| Park / Public Space | BBMP Parks | 1533 |
| Traffic / Signage | Bangalore Traffic Police | 080-22868444 |
| Electricity / Power Cut | BESCOM | 1912 |
| Other | BBMP / pgportal.gov.in | 1533 |

---

## 📁 Project Structure

```
smart-local-problem-reporter/
├── index.html          # Landing page
├── auth.html           # Login / Register
├── dashboard.html      # User dashboard
├── report.html         # Multi-step complaint form
├── complaints.html     # My complaints (with filters)
├── admin.html          # Admin dashboard (charts + management)
│
├── css/
│   └── style.css       # Design system (HSL tokens, components)
│
├── js/
│   ├── data.js         # localStorage data layer ("database")
│   ├── auth.js         # Authentication (login, register, route guards)
│   ├── app.js          # Core utilities (toast, modals, sidebar)
│   ├── suggestions.js  # Rule-based suggestion engine
│   ├── complaints.js   # My Complaints page logic
│   └── admin.js        # Admin dashboard logic + Chart.js charts
│
├── database/
│   ├── schema.sql      # MySQL DDL (tables, FKs, views, triggers)
│   └── seed.sql        # Sample data for MySQL
│
├── backend/            # Java Spring Boot reference implementation
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/civicreport/
│       │   ├── config/       # Security configuration
│       │   ├── model/        # JPA entities (User, Complaint, ...)
│       │   ├── controller/   # REST controllers (Auth, Complaint, Category)
│       │   ├── repository/   # Spring Data JPA repositories
│       │   └── service/      # Business logic
│       └── resources/
│           └── application.properties
│
└── assets/
    └── hero.jpg        # Landing page hero image
```

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | HTML5, CSS3 (custom design system), Vanilla JavaScript |
| Charts | Chart.js 4.4 |
| Maps / Location | Google Maps embeds (no API key), browser Geolocation API |
| Fonts | Google Fonts — Inter |
| Backend (reference) | Java 17, Spring Boot 3.2, Spring Data JPA, Spring Security |
| Database | MySQL 8+ |
| Demo data store | Browser `localStorage` |

---

## 🗄️ Database Schema

`database/schema.sql` defines the full MySQL model, including:

- **`users`** — citizens and department admins
- **`complaints`** — filings with category, location, status, and image
- **`categories`** — the 12 issue types
- **`statuses`** — workflow states (Pending / In Progress / Resolved)
- **`feedback`** — ratings and comments linked to resolved complaints
- Database **views** for reporting and **triggers** for status auditing

---

## 🔐 Security Notes (Production Checklist)

- [ ] Replace plain-text passwords in the demo with BCrypt hashing
- [ ] Replace `localStorage` auth with JWT tokens (backend)
- [ ] Enforce HTTPS in production
- [ ] Sanitize all user inputs server-side
- [ ] Configure CORS for your actual domain
- [ ] Use SQL prepared statements (already provided by Spring Data JPA)
- [ ] Set a strong `app.jwt.secret` in `application.properties`

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for details.

---

*Built for the Smart Civic Reporting Project — 2026*
