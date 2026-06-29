# Dalton-Brockett-Portfolio

## Overview

A 3D interactive portfolio built with React, Three.js, and Framer Motion. The `SQL-Integration` branch adds a self-hosted **visitor analytics backend** powered by PostgreSQL and Spring Boot, replacing the need for third-party analytics services.

---

## Analytics Backend

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Database | PostgreSQL 16 (via Docker) |
| Migrations | Flyway |
| Backend | Spring Boot 3.5 / Java 21 |
| ORM | Spring Data JPA + Hibernate |
| Raw SQL | JdbcTemplate (for dashboard aggregations) |
| User-Agent Parsing | ua-parser (`uap-java`) |
| Geolocation | ip-api.com (free tier) |

### Database Schema

Schema is managed by Flyway migrations in `server/src/main/resources/db/migration/`.

#### `sessions` table (V1)

Stores one row per visitor session with metadata about their device, general location, and engagement.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | Auto-generated session identifier |
| `started_at` | TIMESTAMPTZ | Session start time (defaults to `NOW()`) |
| `ended_at` | TIMESTAMPTZ | Session end time (null until visitor leaves) |
| `ip_hash` | VARCHAR(64) | SHA-256 hash of visitor IP (privacy-friendly) |
| `user_agent` | TEXT | Raw User-Agent string |
| `referrer` | TEXT | Traffic source URL |
| `browser` | VARCHAR(50) | Parsed browser name (e.g. "Chrome") |
| `os` | VARCHAR(50) | Parsed OS name (e.g. "Windows") |
| `device_type` | VARCHAR(20) | "desktop", "mobile", or "tablet" |
| `country` | VARCHAR(100) | Geo-resolved country |
| `city` | VARCHAR(100) | Geo-resolved city |
| `region` | VARCHAR(100) | Geo-resolved region/state |
| `timezone` | VARCHAR(50) | Visitor timezone (e.g. "America/Los_Angeles") |
| `language` | VARCHAR(20) | Browser language (e.g. "en-US") |
| `screen_width` | INTEGER | Screen width in pixels |
| `screen_height` | INTEGER | Screen height in pixels |
| `entered_site` | BOOLEAN | Whether visitor clicked "Enter" on the landing page |

#### `events` table (V2)

Stores every user interaction within a session. Uses a JSONB `event_data` column so different event types can carry different payloads without schema changes.

| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL (PK) | Auto-incrementing event ID |
| `session_id` | UUID (FK) | References `sessions.id` (cascading delete) |
| `event_type` | VARCHAR(50) | Interaction type (see below) |
| `event_data` | JSONB | Flexible payload per event type |
| `created_at` | TIMESTAMPTZ | When the event occurred |

**Tracked event types:**
- `enter_click` — Clicked "Enter" on the landing page
- `node_click` — Clicked a portfolio item in the 3D scene
- `detail_view` — Opened the project details overlay
- `link_click` — Clicked an external link
- `orbit_interact` — Dragged or zoomed the 3D camera
- `session_end` — Visitor left the page

### API Endpoints

#### Tracking (Public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analytics/sessions` | Create a new session (returns UUID) |
| PATCH | `/api/analytics/sessions/{id}` | Update session (entered site / ended) |
| POST | `/api/analytics/events` | Log a user interaction event |

#### Dashboard (Protected — requires `Authorization: Bearer <password>`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/overview` | High-level stats (total sessions, bounce rate, avg duration, visitors today) |
| GET | `/api/analytics/referrers` | Top traffic sources ranked by visit count |
| GET | `/api/analytics/popular-nodes` | Most-clicked portfolio items (extracted from JSONB) |
| GET | `/api/analytics/geo` | Visitor distribution by country and city |
| GET | `/api/analytics/devices` | Browser, OS, and device type breakdown |
| GET | `/api/analytics/timeline` | Daily visit counts for the last 30 days |
| GET | `/api/analytics/journeys/{sessionId}` | Full event journey for a specific session |
| GET | `/api/analytics/sessions-list?page=1&pageSize=20` | Paginated list of recent sessions |

### Project Structure (Backend)

```
server/
├── src/main/java/com/dalton/analytics/
│   ├── AnalyticsApplication.java          # Spring Boot entry point
│   ├── config/
│   │   └── CorsConfig.java               # CORS setup (Vite :5173 ↔ Spring :8080)
│   ├── controller/
│   │   ├── SessionController.java         # POST/PATCH session endpoints
│   │   ├── EventController.java           # POST event endpoint
│   │   └── DashboardController.java       # GET dashboard endpoints (auth-protected)
│   ├── dto/
│   │   ├── CreateSessionRequest.java
│   │   ├── CreateSessionResponse.java
│   │   ├── CreateEventRequest.java
│   │   └── UpdateSessionRequest.java
│   ├── entity/
│   │   ├── Session.java                   # JPA entity → sessions table
│   │   └── Event.java                     # JPA entity → events table
│   ├── repository/
│   │   ├── SessionRepository.java         # JPA repository for sessions
│   │   ├── EventRepository.java           # JPA repository for events
│   │   └── DashboardRepository.java       # Native SQL queries (JdbcTemplate)
│   └── service/
│       ├── AnalyticsService.java          # Core business logic
│       ├── GeoLocationService.java        # IP → country/city via ip-api.com
│       └── UserAgentService.java          # User-Agent → browser/OS/device
├── src/main/resources/
│   ├── application.yml                    # Spring Boot config
│   └── db/migration/
│       ├── V1__create_sessions_table.sql
│       └── V2__create_events_table.sql
└── pom.xml
```

---

## Local Development

### Prerequisites

- **Node.js** (v18+) and **npm**
- **Java 21**
- **Docker Desktop**

### Environment Setup

1. Copy the example environment file and adjust values if needed:
   ```bash
   cp .env.example .env
   ```

   Variables in `.env.example`:
   ```
   DATABASE_URL=jdbc:postgresql://localhost:5432/portfolio_analytics
   DB_USERNAME=dalton
   DB_PASSWORD=localdev
   ANALYTICS_PASSWORD=          # Password for accessing the dashboard API
   ANALYTICS_IP_SALT=           # Secret salt to secure SHA-256 IP hashing (highly recommended)
   ```

### Running the Frontend

```bash
npm install
npm run dev
```

The Vite dev server starts at `http://localhost:5173`.

### Running the Analytics Backend

1. Start the PostgreSQL container:
   ```bash
   docker-compose up -d
   ```

2. Start the Spring Boot server:
   ```bash
   cd server
   ./mvnw spring-boot:run        # macOS/Linux
   .\mvnw.cmd spring-boot:run    # Windows
   ```

   The server starts at `http://localhost:8080`. Flyway will automatically run the SQL migrations on first startup.

---


## Attributions

- **Boeing 787-9** and **Boeing 747-8i** by [OUTPISTON](https://sketchfab.com/OUTPISTON) on Sketchfab. Used under the [CC Attribution-NonCommercial-ShareAlike](https://creativecommons.org/licenses/by-nc-sa/4.0/) license.
- **Apple Vision Pro** by [pravinvamp](https://sketchfab.com/pravinvamp) on Sketchfab. Used under the [CC Attribution](https://creativecommons.org/licenses/by/4.0/) license.