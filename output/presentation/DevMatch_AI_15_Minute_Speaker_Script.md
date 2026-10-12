# DevMatch AI: 15-minute presentation script

17 slides. Total: 15:00. Timings include a 90-second demonstration.

## Slide 1 (0:00–0:20)

Good morning. Our project is DevMatch AI, a developer portfolio and hiring platform. It brings developer profiles, job requirements and application decisions into one relational MySQL database. I will explain the workflows, ER model, relational schema, normalization and SQL demonstrations, then show how database changes appear in the website.

## Slide 2 (0:20–1:00)

The problem is that hiring information is spread across resumes, portfolios and job listings. Recruiters need a consistent way to compare a candidate's skills with a vacancy. Developers need one place to maintain their evidence and track applications. Our solution connects these records using keys and relationships. The database is central because the same developer can have multiple skills, projects and applications, while each recruiter can post multiple jobs. Keeping these facts related makes updates and searches easier to explain and verify.

## Slide 3 (1:00–1:40)

The system has two main roles. A developer maintains a profile, adds skills and projects, uploads a PDF resume, searches jobs and applies. A recruiter maintains company information, posts vacancies, reviews candidate evidence and changes application status. We prevent repeat applications to the same job. The database objective is to demonstrate real CRUD operations, relational joins and integrity constraints. Resume analysis supports the workflow, while the recruiter still reviews the evidence before making a final decision.

## Slide 4 (1:40–2:20)

The user interacts through a browser. HTML, CSS and JavaScript form the interface, and Flask handles routes, sessions and validation. SQLAlchemy models map Python objects to MySQL tables, with PyMySQL as the connection driver. All application records live in MySQL. PyMuPDF extracts text from resume PDFs. Gemini analysis is optional and local skill extraction provides a fallback. Supabase, when configured, stores private PDF files only. Its PostgreSQL database does not hold this project's application tables.

## Slide 5 (2:20–3:40)

This is the ER model. Users are the account entity. A user can have an optional developer profile or recruiter profile. The profile's unique user foreign key gives an optional one-to-one relationship. A developer has many skills, projects, resume analyses and applications. Each project has multiple technology records. A recruiter posts multiple jobs, and a job has multiple required-skill rows. The key relationship is developers and jobs: many developers can apply to many jobs. We resolve that many-to-many relationship through the Application entity. Each application belongs to exactly one developer and one job. Status history adds multiple audit records for an application. This audit entity is installed by the SQL demonstration script, while the ten core entities come from the application models. Read the diagram's remaining parent-child links as one to zero or many.

## Slide 6 (3:40–4:35)

This slide maps account and portfolio entities into relations. Every table uses an integer id as its primary key. Users stores identity, a unique email and a password hash. Developer profiles stores profile-specific details and references users through a unique user_id. Recruiter profiles does the same for company information. Skills references a developer and stores the skill name, level and years. Projects references its developer and stores project evidence. Project technologies references its project. Unique parent-and-name pairs prevent repeated skill or technology records within the same parent. PK identifies a row, FK points to another relation, and UK indicates uniqueness.

## Slide 7 (4:35–5:30)

These relations support hiring and analysis. Jobs contains the recruiter's foreign key and vacancy information, including title, location and deadline. Job skills holds individual requirements for each job. Applications joins a developer to a job and stores the current status and creation time. A unique developer_id and job_id pair enforces one application per job. Resume analysis stores extracted results and narrative feedback for a developer. Application status history records the old and new status, linked to an application. The history table comes from mysql_demo.sql and uses a database cascade when its parent application is deleted. The model salary length is 100, and the demonstration ALTER command widens it to 150.

## Slide 8 (5:30–6:05)

The mapping rules explain how the ER model becomes tables. An entity gets a table and primary key. For an optional one-to-one relationship, the profile holds a unique foreign key. For one-to-many, the child holds its parent's foreign key, such as recruiter_id in jobs. For many-to-many, we introduce applications with both foreign keys. Repeated operational values become child rows, as in job skills and project technologies. The additional unique pair constraint prevents duplicate applications.

## Slide 9 (6:05–6:55)

Normalization reduces repeated facts and makes changes easier to maintain. For first normal form, operational skill and technology lists use one value per child row. Second normal form means that facts describe the full entity or parent-value pair: a developer's level belongs to that developer-skill record, and application status belongs to that developer-job application. Third normal form separates credentials, company information and job details into their own relations. An application references the developer and job instead of repeating their details. Resume analysis contains narrative text and serialized extraction output, so we distinguish it from normalized searchable skill rows. The matching score is calculated rather than stored redundantly in applications.

## Slide 10 (6:55–7:35)

Primary keys uniquely identify rows. Foreign keys link each child to valid parent records. The unique email constraint prevents duplicate account addresses. A unique user_id in each role profile prevents two profiles of the same type for one account. The application pair prevents repeat applications. Similar uniqueness rules protect job skills and project technologies. These database constraints complement application checks for roles, record ownership, deadlines and form submissions. We should distinguish SQLAlchemy's delete cascades from database ON DELETE CASCADE: the SQL audit table explicitly uses the latter.

## Slide 11 (7:35–8:45)

This query sequence demonstrates CRUD on a dedicated job. First, INSERT selects an existing recruiter and creates a new demonstration vacancy. LAST_INSERT_ID saves the generated key in a session variable. SELECT reads the row. UPDATE changes its location to Hyderabad. DELETE removes only the generated demonstration row. Keep every command in the same MySQL session because the variable is session-specific. Use autocommit for the website demonstration and refresh the database demo page after each committed change. These are SQL examples for explaining the operations, not claims about results from a current database run. The final presentation demonstration will show the visible effect.

## Slide 12 (8:45–9:45)

The first SELECT answers a practical question: which developers have a skill containing Python? We join users to developer profiles through user_id, then join skills through developer_id. LIKE filters the skill name and ORDER BY sorts the developer names. Each matching skill appears as a row with the developer's name and skill level. The second query counts applications by status. GROUP BY forms one group per status, COUNT computes the number of rows, and ORDER BY displays the largest group first. The exact output depends on current records. Together, these queries demonstrate filtering, joins, sorting and aggregation on the project's actual relations.

## Slide 13 (9:45–10:35)

ALTER TABLE changes the schema. Here MODIFY COLUMN widens salary to VARCHAR(150), retaining a default of Not disclosed. The view provides a reusable job summary. It joins jobs with recruiter profiles and left joins applications. LEFT JOIN keeps vacancies that have no applicants, and COUNT(a.id) returns zero for those jobs. GROUP BY produces one summary row for each job and company. A view stores a query definition, so selecting from it reflects underlying data. This slide shows a reduced definition. The full mysql_demo.sql also counts shortlisted applications.

## Slide 14 (10:35–11:30)

The trigger provides automatic auditing of application status changes. It runs after each updated application row. OLD.status is the value before the update and NEW.status is the value afterward. The IF condition avoids writing an audit record when the status stays the same. When it changes, the trigger inserts the application id and the two statuses into history. The timestamp comes from the audit table's default. The SQL script creates that table and backfills initial statuses for existing applications before installing the trigger. This trigger audits updates only. It does not automatically log new applications, and the history does not store the recruiter's identity.

## Slide 15 (11:30–12:30)

The ATS calculation is deterministic skill matching. The application normalizes skill names with casefold and compares job requirements against the union of profile skills and skills extracted from the latest resume analysis. The percentage is the number of matched required names divided by the total required names, multiplied by 100. Matching two of Python, Flask and MySQL gives 66.7 percent, displayed as 67 percent. The initial status is Rejected because the exact ratio is at or below 70 percent. Above 70 percent gives Shortlisted. Exactly 70 percent does not pass. With no requirements, the score is zero and the application is rejected. The stored importance and minimum_years fields do not weight this score. Recruiters can review evidence and override the initial decision.

## Slide 16 (12:30–14:00)

Now I will demonstrate that the website and SQL client use the same database. In the recruiter workflow, create a dedicated vacancy and read it back using SELECT. Edit the title or location in the website, then repeat SELECT to show that the committed record changed. For the reverse direction, run the CRUD sequence on slide 11 in one MySQL session with autocommit enabled. Refresh /dbms-demo after INSERT to see the new row. Run UPDATE and refresh to show Hyderabad. Run DELETE and refresh to show the row has disappeared. Use only a dedicated test vacancy without applications or child skill rows for this simple example. If time permits, change an application status through the recruiter page and query history for that application id. If the database or site is unavailable, explain the steps without claiming the demonstration ran.

## Slide 17 (14:00–15:00)

DevMatch AI demonstrates how a relational database supports a complete hiring workflow. We used ten core application tables and an optional SQL audit extension. Primary keys identify records, foreign keys express relationships, and unique constraints prevent repeated applications and duplicate child values. Normalized child tables make skill and technology data easier to search. We demonstrated CRUD, joins, filtering, aggregation, a reusable view, schema modification and a trigger. The browser and SQL client can verify changes in both directions when connected to the same MySQL database. Current limitations include exact-name skill matching, narrative resume extraction fields and audit coverage limited to status updates. Future work can add skill aliases, richer evidence checks, interview scheduling and expanded audit records. Thank you. I am happy to take questions.

