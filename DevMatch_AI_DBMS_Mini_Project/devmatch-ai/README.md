# DevMatch AI — DBMS mini project

A working developer portfolio and hiring site with separate developer and recruiter accounts. Flask handles the application, SQLAlchemy manages the relational schema, MySQL or PostgreSQL stores records, PyMuPDF extracts PDF resume text, and Gemini analysis is optional. The responsive frontend uses HTML, CSS, and JavaScript (no Bootstrap dependency is needed for this design).

## What you can demonstrate

- Developer: register, edit profile, add/remove skills and projects, upload a PDF, browse/search jobs, apply once per job, track application status and view a skill match.
- Recruiter: register, edit company profile, post/edit/delete jobs, review ATS matched/missing skills and resume/profile evidence, automatically shortlist new applications at a 70% required-skill match, override application statuses, search developers by skill, and view portfolios/resumes.
- DBMS: ten related tables, primary/foreign keys, uniqueness constraints, normalized skills/technologies, CRUD, joins, `LIKE`, grouping and sorting. `mysql_demo.sql` demonstrates a view, status audit trigger, `ALTER`/`MODIFY`, and transactional CRUD commands. `verify-dbms` checks the PPT's table, attribute, relationship, and row minimums.
- Resume/ATS: with `GEMINI_API_KEY`, Gemini analyzes PDF text; without it, the site uses deterministic skill extraction so the demo works offline. The ATS score is the percentage of a job's normalized required skills found in the union of the candidate's profile skills and latest extracted resume skills. New applications at 70% or above are marked Shortlisted; recruiters can change any status after reviewing the score, evidence, profile, and resume. The score is a skills-only aid and does not assess protected traits or replace recruiter review.

## Run locally (Python 3.10+)

```bash
cd devmatch-ai
python -m venv .venv
# Windows PowerShell: .venv\Scripts\Activate.ps1
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
```

### Quick demo without installing MySQL

```bash
flask --app app init-db
flask --app app seed-demo
flask --app app verify-dbms
flask --app app run --debug
```

Open http://127.0.0.1:5000. By default data is saved to local `devmatch.db` using SQLite. This is a convenient prototype mode; use MySQL for the DBMS presentation.

### Run with MySQL 8

Create a database and restricted account in MySQL Workbench:

```sql
CREATE DATABASE devmatch_ai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'devmatch'@'localhost' IDENTIFIED BY 'choose_a_strong_password';
GRANT ALL PRIVILEGES ON devmatch_ai.* TO 'devmatch'@'localhost';
```

Copy `.env.example` to `.env`, replace the MySQL password and set a strong random `SECRET_KEY`. If the password contains special URL characters, percent encode it (for example `@` → `%40`). The Flask CLI automatically reads `.env` when `python-dotenv` is installed.

```bash
flask --app app init-db
flask --app app seed-demo
flask --app app verify-dbms
flask --app app run --debug
```

After tables and samples exist, run `mysql_demo.sql` in MySQL Workbench to create the view, status-history table, and trigger, and demonstrate MySQL DDL/DML. Its CRUD example rolls back its test application. Then run `flask --app app verify-dbms` again; when `application_status_history` exists, the verifier checks its attributes, foreign key, and seeded audit rows too. Do not run `seed-demo` against a database containing your own work unless you want to add demonstration records.

Demo accounts: `dev1@example.com` through `dev5@example.com` and `recruiter1@example.com` through `recruiter5@example.com`. All use `DemoPass123!`. Replace or remove these accounts before public use.

For Gemini analysis, put a valid `GEMINI_API_KEY` into `.env`; the server sends extracted resume text to Gemini when a developer uploads a PDF. Without a key, no resume text is sent to an external AI service. If a Gemini request fails, the deterministic analysis is used and the failure is logged.

## Relational design

See [DBMS_PROJECT_DOCUMENTATION.md](DBMS_PROJECT_DOCUMENTATION.md) for the ER diagram, table attributes/keys, ER mapping rules, 1NF–3NF rationale, MySQL command demonstration, and application development process. `init-db` migrates legacy comma-separated job skills/project technologies into normalized child tables before removing the old columns.

## Public deployment using free tiers

`render.yaml` configures a native Python service on Render's free web plan. Supabase provides PostgreSQL and a private resume bucket; Upstash provides Redis-backed rate limiting. No Docker or paid Render disk is used. Free-tier quotas, sleep behavior, project-pause rules, and provider terms can change; check each provider's current limits before launch. Free services are suitable for a small demo, not guaranteed production-grade availability.

1. Push this project to a Git repository and connect it to Render with the Blueprint workflow. Render reads `render.yaml` and installs Python packages directly.
2. Create a Supabase project. Create a **private** Storage bucket named `private-resumes`. In the Supabase dashboard, copy the PostgreSQL pooler URI, Project URL, and server-side service-role key.
3. Create an Upstash Redis database and copy its TLS connection URL (`rediss://...`).
4. In the Render service environment, set `DATABASE_URL`, `RATELIMIT_STORAGE_URI`, `SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY`. Use the `ALLOWED_HOSTS` value matching the Render hostname, e.g. `devmatch-ai.onrender.com`; add a custom hostname there too if used. Generate `SECRET_KEY` with `python -c "import secrets; print(secrets.token_urlsafe(48))"`. Keep the service-role key and all other secrets in Render, never in Git or browser code. URL-encode reserved characters in connection-string passwords.
5. Deploy from Render and check `https://your-render-host/healthz` returns `{"status":"ok"}`. Add an optional custom domain in Render and configure its DNS as shown by the provider.

The free Render filesystem is ephemeral, so resume PDFs are stored in the private Supabase bucket and fetched only through the authenticated app. Database rows use Supabase PostgreSQL, and login/registration throttles use Upstash Redis. Session cookies are secure over HTTPS and security headers are enabled. Do not run `seed-demo` in production.

`init-db` creates tables for the first deployment and migrates the former comma-separated job skills/project technologies into normalized child tables. Plan migrations before future model changes. Before accepting real applicant data, publish a legally reviewed privacy notice and terms, specify contact and retention policies, and verify your jurisdiction's requirements. Resume malware scanning and incident-response procedures also need to be configured for your organization.

For local development, continue using SQLite and local resume files. Production mode requires HTTPS, PostgreSQL, Supabase server credentials, and Redis-compatible limiter storage; it refuses to start without these settings. Never expose `.env`, `SUPABASE_SERVICE_ROLE_KEY`, or `GEMINI_API_KEY` in browser code or a public repository.
