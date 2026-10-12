# DevMatch AI — DBMS mini project

A working developer portfolio and hiring site with separate developer and recruiter accounts. Flask handles the application, SQLAlchemy manages the relational schema, **MySQL stores all application records**, PyMuPDF extracts PDF resume text, and Gemini analysis is optional. Supabase Storage can hold private resume PDFs; its PostgreSQL database is not used. The responsive frontend uses HTML, CSS, and JavaScript.

## What you can demonstrate

- Developer: register, edit profile, add/remove skills and projects, upload a PDF, browse/search jobs, apply once per job, track application status and view a skill match.
- Recruiter: register, edit company profile, post/edit/delete jobs, review ATS matched/missing skills and resume/profile evidence, automatically shortlist new applications above a 70% required-skill match and reject those at 70% or below, override application statuses, search developers by skill, and view portfolios/resumes.
- DBMS: ten related tables, primary/foreign keys, uniqueness constraints, normalized skills/technologies, CRUD, joins, `LIKE`, grouping and sorting. `mysql_demo.sql` demonstrates a view, status audit trigger, `ALTER`/`MODIFY`, and transactional CRUD commands. `verify-dbms` checks the PPT's table, attribute, relationship, and row minimums.
- Resume/ATS: with `GEMINI_API_KEY`, Gemini analyzes PDF text; without it, the site uses deterministic skill extraction so the demo works offline. The ATS score is the percentage of a job's normalized required skills found in the union of the candidate's profile skills and latest extracted resume skills. New applications above 70% are marked Shortlisted; those at 70% or below are marked Rejected. Recruiters can change any status after reviewing the score, evidence, profile, and resume. The calculation uses skills only and does not assess protected traits; automatic statuses require recruiter review before a final hiring decision.

## Run locally (Python 3.10+)

```bash
cd devmatch-ai
python -m venv .venv
# Windows PowerShell: .venv\Scripts\Activate.ps1
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
```

### Run with MySQL 8

Create a database and restricted account in MySQL Workbench:

```sql
CREATE DATABASE devmatch_ai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'devmatch'@'localhost' IDENTIFIED BY 'choose_a_strong_password';
GRANT ALL PRIVILEGES ON devmatch_ai.* TO 'devmatch'@'localhost';
```

Copy `.env.example` to `.env`, replace the MySQL password and set a strong random `SECRET_KEY`. If the password contains special URL characters, percent encode it (for example `@` → `%40`). The Flask CLI automatically reads `.env` when `python-dotenv` is installed. The application now requires a `mysql+pymysql://` connection URL at startup, so the website and Workbench use the same database.

```bash
flask --app app init-db
flask --app app seed-demo
flask --app app verify-dbms
flask --app app run --debug
```

After tables and samples exist, run `mysql_demo.sql` in MySQL Workbench to create the view, status-history table, and trigger, and demonstrate MySQL DDL/DML. Its CRUD example rolls back its test application. Then run `flask --app app verify-dbms` again; when `application_status_history` exists, the verifier checks its attributes, foreign key, and seeded audit rows too. Do not run `seed-demo` against a database containing your own work unless you want to add demonstration records.

Workbench is optional. From this project folder in PowerShell, open the MySQL prompt with `& .\.venv\Scripts\python.exe .\mysql_shell.py`. The helper reads the local `.env` and uses either `mysql.exe` on PATH or the portable client in `D:\DBMS_DevApp\mysql-local`. At the `mysql>` prompt, run `SHOW TABLES;`, then `SELECT id, title FROM jobs LIMIT 5;`. End each SQL statement with `;` and leave with `exit;`. To practice CRUD safely on a new job, use a valid `recruiter_id` from `SELECT id FROM recruiter_profiles;`, then run:

```sql
INSERT INTO jobs (recruiter_id, title, description, location)
VALUES (1, 'CRUD Practice Job', 'SQL demonstration', 'Bengaluru');
SET @practice_job_id = LAST_INSERT_ID();
SELECT id, title, location FROM jobs WHERE id = @practice_job_id;
UPDATE jobs SET location = 'Hyderabad' WHERE id = @practice_job_id;
SELECT id, title, location FROM jobs WHERE id = @practice_job_id;
DELETE FROM jobs WHERE id = @practice_job_id;
SELECT id FROM jobs WHERE id = @practice_job_id;
```

The final `SELECT` returns an empty set. Use the same MySQL session throughout because `@practice_job_id` is session-scoped.

### Command Prompt presentation: all records and website CRUD

In a first Windows Command Prompt, run the website and keep the window open:

```bat
cd /d D:\DBMS_DevApp\DevMatch_AI_DBMS_Mini_Project\devmatch-ai
.venv\Scripts\python.exe -m flask --app app run --debug
```

In a second Command Prompt, open the same database. The options show the queries and format the results as tables:

```bat
cd /d D:\DBMS_DevApp\DevMatch_AI_DBMS_Mini_Project\devmatch-ai
.venv\Scripts\python.exe mysql_shell.py --table --verbose
```

At `mysql>`, run `source mysql_show_data.sql;`. This read-only script displays the database name, table structures, all records from the ten application tables (omitting user password hashes), exact row counts, joins, searches, grouped summaries, foreign keys, triggers and any installed audit table/summary view. For a wide table, run `SELECT * FROM jobs\G` to display one record vertically. To record your presentation, enter `tee website_queries.txt;` before sourcing the file and `notee;` afterward.

For persistent CRUD visible in the website, run each stage separately in the same MySQL session and refresh `http://127.0.0.1:5000/jobs` or `/dbms-demo` between stages:

```sql
SET autocommit = 1;
SET @demo_recruiter_id = (SELECT MIN(id) FROM recruiter_profiles);

-- CREATE: use an existing recruiter and fill the website's display fields.
INSERT INTO jobs (recruiter_id, title, description, location, salary,
                  experience_required, job_type, created_at)
VALUES (@demo_recruiter_id, 'SQL Demo Job', 'Created from Command Prompt',
        'Bengaluru', 'Not disclosed', 'Entry level', 'Full-time', NOW());
SET @demo_job_id = LAST_INSERT_ID();

-- READ: refresh the website to see the new job.
SELECT * FROM jobs WHERE id = @demo_job_id;

-- UPDATE: refresh the website to see the changed title and location.
UPDATE jobs SET title = 'Updated SQL Demo Job', location = 'Hyderabad'
WHERE id = @demo_job_id;
SELECT * FROM jobs WHERE id = @demo_job_id;

-- DELETE: remove only this demonstration job, then refresh the website.
DELETE FROM jobs WHERE id = @demo_job_id;
SELECT * FROM jobs WHERE id = @demo_job_id;
```

The recruiter lookup requires at least one recruiter profile. Leave the demo job without applications or skill rows for this simple deletion example. The homepage previews only the three newest jobs; `/jobs` displays all matching jobs. SQL display queries read data without changing it. INSERT, UPDATE and DELETE appear after a page refresh; the page does not update automatically while left open.

Open `/dbms-demo` in the website to display the current MySQL `jobs` rows as a table. It shows the total count and at least five seeded jobs. Refresh that page after each SQL `INSERT`, `UPDATE`, or `DELETE` to see the row appear, change, or disappear. You can search for `CRUD Practice Job` to isolate your test record, then clear the search to see all rows again. The page uses a fresh database query and disables browser caching.

To classify older applications still marked `Applied` with the new rule, run `flask --app app classify-pending` once. This leaves recruiter decisions in other statuses unchanged. New applications are classified when submitted.

Open http://127.0.0.1:5000 on a desktop or laptop. For the required two-way demonstration, add or edit a job in the website and confirm it with `SELECT * FROM jobs;` in Workbench. Then update that job in Workbench with `UPDATE jobs SET title = 'Updated title' WHERE id = 1;` (choose an existing ID), refresh the jobs page, and confirm the new title. Use a dedicated demo database for these changes.

Demo accounts: `dev1@example.com` through `dev5@example.com` and `recruiter1@example.com` through `recruiter5@example.com`. All use `DemoPass123!`. Replace or remove these accounts before public use.

For Gemini features, put a valid `GEMINI_API_KEY` from Google AI Studio into `.env` and restart the app. `GEMINI_MODEL` defaults to `gemini-3.1-flash-lite`. Developers can ask the **Gemini advisor** questions based on their profile and current job listings. Uploading a PDF also sends its extracted text to Gemini for structured resume analysis. The key stays on the server; browser code never receives it. Without a key, the advisor shows a setup message and resume uploads use local skill extraction. If a Gemini resume request fails, the local extractor is used and the developer is told which path ran. Do not paste API keys into the website.

## Relational design

See [DBMS_PROJECT_DOCUMENTATION.md](DBMS_PROJECT_DOCUMENTATION.md) for the ER diagram, table attributes/keys, ER mapping rules, 1NF–3NF rationale, MySQL command demonstration, and application development process. `init-db` migrates legacy comma-separated job skills/project technologies into normalized child tables before removing the old columns.

## Public deployment using free tiers

`render.yaml` configures a native Python service on Render. Use a reachable **MySQL 8** server for all application tables. Supabase provides only a private resume bucket; Upstash provides Redis-backed rate limiting. Hosting plans and provider limits can change, so confirm the chosen services before deployment.

1. Push this project to a Git repository and connect it to Render with the Blueprint workflow. Render reads `render.yaml` and installs Python packages directly.
2. Provision a MySQL 8 database reachable from Render. Create the `devmatch_ai` database and a dedicated account, then set `DATABASE_URL` to its `mysql+pymysql://` URL. Configure TLS as required by your MySQL host.
3. Create a Supabase project and a **private** Storage bucket named `private-resumes`. Copy the Project URL and server-side service-role key; do not use its PostgreSQL pooler URI for this project.
4. Create an Upstash Redis database and copy its TLS connection URL (`rediss://...`).
5. In the Render service environment, set `DATABASE_URL`, `RATELIMIT_STORAGE_URI`, `SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY`. Set `ALLOWED_HOSTS` to the Render hostname. Keep the service-role key and other secrets server-side. URL-encode reserved characters in connection-string passwords.
6. Deploy from Render and check `https://your-render-host/healthz` returns `{"status":"ok"}`.

The Render filesystem is ephemeral, so resume PDFs are stored in the private Supabase bucket and fetched only through the authenticated app. Database rows use MySQL, and login/registration throttles use Upstash Redis. Session cookies are secure over HTTPS and security headers are enabled. Do not run `seed-demo` in production.

`init-db` creates tables for the first deployment and migrates the former comma-separated job skills/project technologies into normalized child tables. Plan migrations before future model changes. Before accepting real applicant data, publish a legally reviewed privacy notice and terms, specify contact and retention policies, and verify your jurisdiction's requirements. Resume malware scanning and incident-response procedures also need to be configured for your organization.

For local development, use MySQL and local resume files. Production mode requires MySQL, Supabase Storage credentials, and Redis-compatible limiter storage; it refuses to start without these settings. Never expose `.env`, `SUPABASE_SERVICE_ROLE_KEY`, or `GEMINI_API_KEY` in browser code or a public repository.
