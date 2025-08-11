# One Piece API

## **📆 8-Week Build Plan**

*(Assumes ~5–8 hrs/week commitment — can compress if you work faster)*

---

### **Week 1–2: Data & Database Foundation**

**Goals:** Have a clean dataset + working schema so API development is smooth.

**Tasks:**

- **Data collection**
    - Scrape from the One Piece Fandom wiki using Python + BeautifulSoup or `scrapy`.
    - Export structured JSON for:
        - Characters (id, name, bounty, crew, devil fruit, status, first appearance).
        - Crews (id, name, captain, ship, active years).
        - Devil fruits (id, name, type, abilities, known users).
    - Clean & normalize data (avoid duplicates, standardize crew names, etc.).
- **Database setup**
    - Choose **PostgreSQL** for relational queries (host locally first with Docker).
    - Create tables: `characters`, `crews`, `devil_fruits`, plus join tables if needed.
    - Insert cleaned data into the DB.
    - Write **sample SQL queries** to test relationships (e.g., "Get all Straw Hats with bounties > 1B").

**Deliverables:**

- `data/` folder with JSON exports.
- SQL schema file (`schema.sql`).
- PostgreSQL Docker container with data loaded.

---

### **Week 3–4: Backend API**

**Goals:** Fully working REST API with filtering, pagination, and basic docs.

**Tasks:**

- **Backend setup**
    - Node.js + Express (or FastAPI if you want built-in docs).
    - Connect to PostgreSQL (use Prisma or Sequelize for ORM, or raw SQL if comfortable).
    - Implement caching layer with Redis (Docker container).
- **Endpoints** (examples):
    - `GET /characters` (filters: `crew`, `bounty_gte`, `devil_fruit`).
    - `GET /crews` (filter by `ship_name`).
    - `GET /devil-fruits` (filter by `type`).
    - Add pagination (`?page=2&limit=20`).
- **Middleware**
    - Error handling + input validation.
    - Rate limiting with Redis (e.g., `X requests/min` per API key).
    - JWT authentication (signup/login via `/auth`).
- **Auto-generated API docs**
    - Swagger UI or Redoc integration.

**Deliverables:**

- API running locally (`http://localhost:3000`).
- Swagger docs available at `/docs`.
- Postman collection for testing.

---

### **Week 5–6: Developer Portal**

**Goals:** Public-facing portal for devs to explore & sign up for API keys.

**Tasks:**

- **Frontend setup**
    - Next.js + Tailwind CSS (host on Vercel).
    - Pages: Home, Docs, API Playground, Login/Signup.
- **Features**
    - **API key management**: After signup, generate and store API key (linked to user).
    - **Live API tester**: Embedded fetch requests with editable query params (like SWAPI or Postman-in-browser).
    - **Docs integration**: Render Swagger/Redoc or create a custom docs page.

**Deliverables:**

- `portal.onepiece.dev` live on Vercel.
- Fully functional signup/login flow.
- Users can view & copy their API key.

---

### **Week 7: Deployment & Monitoring**

**Goals:** Make it public, reliable, and production-ready.

**Tasks:**

- **Backend deployment**
    - Containerize with Docker.
    - Deploy to AWS ECS/Fargate (free tier or low-cost plan).
    - Use AWS RDS (PostgreSQL) + ElastiCache (Redis) or keep DB in Docker on ECS for cheaper cost.
- **Monitoring**
    - Add Winston logging.
    - Add uptime monitoring (Better Stack / UptimeRobot).
    - Basic analytics: log # of requests per endpoint.

**Deliverables:**

- `api.onepiece.dev` live & functional.
- Monitoring dashboard screenshot.

---

### **Week 8: Polish & Resume Prep**

**Goals:** Make it portfolio-ready with professional polish.

**Tasks:**

- Add **README** with:
    - Project overview
    - Tech stack
    - API usage guide
    - Live links
    - Example queries
- Write a **blog post/Medium article** (“How I Built the One Piece API & Developer Portal”).
- Record a short **demo video** (screen recording of portal + API usage).
- Add to resume & LinkedIn with quantified metrics (e.g., “Served 1,200+ API requests in first week”).

**Deliverables:**

- README.md ready.
- Blog post published.
- Resume bullet updated.

---

## **💡 Tips to Maximize Resume Impact**

- Track usage stats (even if small) — “50+ registered API users” looks great.
- Keep code well-commented and modular.
- Showcase both **engineering skills** and **user-facing polish**.
- Bonus: Add **GraphQL endpoint** for devs who prefer that style.
