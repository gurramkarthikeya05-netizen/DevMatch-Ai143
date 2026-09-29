# DevMatch AI DBMS Project Documentation

## Rubric Summary

The application uses ten related entities stored in MySQL. Every application table has at least five attributes, a primary key, and a relationship through a foreign key. `flask --app app verify-dbms` checks that each application table has at least five records, at least five attributes, and a relationship. Run the MySQL demonstration script to add the related audit-history table and its sample rows. Supabase is used only for private PDF storage.

The deliverable is a web application that runs on desktop/laptop browsers. It is responsive on mobile browsers; it is not a native Android or iOS application.

## Relational Schema Diagram

```text
users (PK id)
  ├── developer_profiles (PK id, FK/UNIQUE user_id → users.id)
  │     ├── skills (PK id, FK developer_id → developer_profiles.id)
  │     ├── projects (PK id, FK developer_id → developer_profiles.id)
  │     │     └── project_technologies (PK id, FK project_id → projects.id)
  │     ├── resume_analysis (PK id, FK developer_id → developer_profiles.id)
  │     └── applications (PK id, FK developer_id → developer_profiles.id,
  │                         FK job_id → jobs.id, UNIQUE developer_id + job_id)
  │           └── application_status_history (PK id, FK application_id → applications.id)
  └── recruiter_profiles (PK id, FK/UNIQUE user_id → users.id)
        └── jobs (PK id, FK recruiter_id → recruiter_profiles.id)
              └── job_skills (PK id, FK job_id → jobs.id)
```

The audit table is added by `mysql_demo.sql`. All other tables are created from the SQLAlchemy models in `app.py`.

## ER Diagram

```mermaid
erDiagram
    USERS ||--o| DEVELOPER_PROFILES : owns
    USERS ||--o| RECRUITER_PROFILES : owns
    DEVELOPER_PROFILES ||--o{ SKILLS : has
    DEVELOPER_PROFILES ||--o{ PROJECTS : showcases
    PROJECTS ||--o{ PROJECT_TECHNOLOGIES : uses
    DEVELOPER_PROFILES ||--o{ APPLICATIONS : submits
    DEVELOPER_PROFILES ||--o{ RESUME_ANALYSIS : receives
    RECRUITER_PROFILES ||--o{ JOBS : posts
    JOBS ||--o{ JOB_SKILLS : requires
    JOBS ||--o{ APPLICATIONS : receives
    APPLICATIONS ||--o{ APPLICATION_STATUS_HISTORY : audits

    USERS {
        int id PK
        string name
        string email UK
        string password_hash
        string role
        datetime created_at
    }
    DEVELOPER_PROFILES {
        int id PK
        int user_id FK_UK
        text bio
        string phone
        string location
        string education
        string experience
        string github_url
        string linkedin_url
        string resume_path
    }
    RECRUITER_PROFILES {
        int id PK
        int user_id FK_UK
        string company_name
        text company_description
        string location
        string website
    }
    SKILLS {
        int id PK
        int developer_id FK
        string name
        string level
        float years
    }
    PROJECTS {
        int id PK
        int developer_id FK
        string name
        text description
        string github_link
        string project_link
    }
    PROJECT_TECHNOLOGIES {
        int id PK
        int project_id FK
        string name
        string category
        string version
        datetime added_at
    }
    JOBS {
        int id PK
        int recruiter_id FK
        string title
        text description
        string location
        string salary
        string experience_required
        string job_type
        date deadline
        datetime created_at
    }
    JOB_SKILLS {
        int id PK
        int job_id FK
        string name
        string importance
        float minimum_years
        datetime added_at
    }
    APPLICATIONS {
        int id PK
        int developer_id FK
        int job_id FK
        string status
        datetime created_at
    }
    RESUME_ANALYSIS {
        int id PK
        int developer_id FK
        text summary
        text strengths
        text missing_skills
        text extracted_skills
        datetime created_at
    }
    APPLICATION_STATUS_HISTORY {
        int id PK
        int application_id FK
        string old_status
        string new_status
        datetime changed_at
    }
```

`APPLICATION_STATUS_HISTORY` is created by `mysql_demo.sql`; the other ten tables are application models created by SQLAlchemy.

## ER-to-Relational Mapping

1. Each entity maps to a table with a surrogate integer primary key.
2. User-to-developer and user-to-recruiter relationships are optional one-to-one relationships. Their profile tables hold a unique foreign key to `users`.
3. Developer-to-skill, developer-to-project, developer-to-application, developer-to-analysis, recruiter-to-job, job-to-job-skill, and project-to-project-technology are one-to-many relationships. The foreign key is stored in the child table.
4. Developers and jobs have a many-to-many relationship resolved by `applications`. A unique constraint on `(developer_id, job_id)` prevents duplicate applications.
5. Job skill requirements and project technologies are separate child rows, not comma-separated database fields. Each child pair has a unique constraint.
6. Application status history references its application and is populated by a MySQL trigger when status changes.

## Normalization

- **1NF:** Every field stores one value. Job requirements and project technologies are represented as one `job_skills` or `project_technologies` row per value. Developer skills are also individual rows.
- **2NF:** Non-key facts describe their row's complete entity or parent/value pair. Application status belongs to an application; skill importance belongs to a particular job-skill requirement; technology category/version belongs to a particular project-technology pair.
- **3NF:** User credentials, role-specific profiles, jobs, applications, projects, and resume-analysis results are separated. Non-key values depend on their table key rather than on another non-key value. Foreign keys express the relationships.

The profile, job, project, skill, application, and resume workflows read and write these same tables through SQLAlchemy. Form submissions commit their changes; subsequent page requests query the database, so changes appear in the interface after saving and database changes appear after refreshing the page.

## Data Requirements

A fresh demo seed creates at least:

| Table | Seed rows |
|---|---:|
| users | 10 |
| developer_profiles | 5 |
| recruiter_profiles | 5 |
| skills | 15 |
| projects | 5 |
| project_technologies | 10 |
| jobs | 5 |
| job_skills | 15 |
| applications | 5 |
| resume_analysis | 5 |

The MySQL script backfills one initial status-history row per existing application, then installs the status-update trigger.

## MySQL Command Demonstration

On a MySQL database initialized and seeded with the commands in `README.md`, run `mysql_demo.sql` in MySQL Workbench. It demonstrates:

- `SELECT`, `LIKE`, `JOIN`, `ORDER BY`, and `GROUP BY`
- `CREATE OR REPLACE VIEW` for job/application summaries
- `CREATE TABLE` and `ALTER TABLE ... MODIFY COLUMN`
- `CREATE TRIGGER` for application status auditing
- `INSERT`, `UPDATE`, and `DELETE` on `applications`; the sample transaction ends with `ROLLBACK` so it leaves no test application behind

Website insert/update/delete actions are persistent and can be checked with `SELECT` statements in Workbench. The script's application status-history backfill and trigger demonstrate automatic audit records.

Run `flask --app app verify-dbms` after `init-db` and `seed-demo`. It fails with a list of missing requirements if any application entity has fewer than five rows, five attributes, or a foreign-key relationship.

## Application Development Process

1. Gathered the hiring-platform requirements and defined developer, recruiter, job, project, skill, application, and resume-analysis workflows.
2. Designed the ER model, mapped relationships to keys, and normalized multivalued job/project technology data into child tables.
3. Implemented the Flask interface and SQLAlchemy CRUD flows, with role-based access and server-side CSRF checks.
4. Seeded demonstration records, added MySQL view/trigger/DDL/DML examples, and added a CLI rubric verifier.
5. Tested local routes, schema migration, seed counts, and front-end data flows before deployment configuration.
