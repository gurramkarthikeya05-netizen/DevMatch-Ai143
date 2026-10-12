-- Read-only presentation queries. Run at mysql> with: source mysql_show_data.sql;
-- Uses the database selected by mysql_shell.py from the project's .env.
SELECT DATABASE() AS website_database;
SHOW TABLES;
SHOW FULL TABLES;

-- Table columns, types and keys.
DESCRIBE users;
DESCRIBE developer_profiles;
DESCRIBE recruiter_profiles;
DESCRIBE skills;
DESCRIBE projects;
DESCRIBE project_technologies;
DESCRIBE jobs;
DESCRIBE job_skills;
DESCRIBE applications;
DESCRIBE resume_analysis;

-- All user records; password hashes are omitted from the presentation.
SELECT id, name, email, role, created_at FROM users ORDER BY id;
SELECT * FROM developer_profiles ORDER BY id;
SELECT * FROM recruiter_profiles ORDER BY id;
SELECT * FROM skills ORDER BY id;
SELECT * FROM projects ORDER BY id;
SELECT * FROM project_technologies ORDER BY id;
SELECT * FROM jobs ORDER BY id;
SELECT * FROM job_skills ORDER BY id;
SELECT * FROM applications ORDER BY id;
SELECT * FROM resume_analysis ORDER BY id;

-- Exact record counts for the ten application tables.
SELECT 'users' AS table_name, COUNT(*) AS total_records FROM users
UNION ALL SELECT 'developer_profiles', COUNT(*) FROM developer_profiles
UNION ALL SELECT 'recruiter_profiles', COUNT(*) FROM recruiter_profiles
UNION ALL SELECT 'skills', COUNT(*) FROM skills
UNION ALL SELECT 'projects', COUNT(*) FROM projects
UNION ALL SELECT 'project_technologies', COUNT(*) FROM project_technologies
UNION ALL SELECT 'jobs', COUNT(*) FROM jobs
UNION ALL SELECT 'job_skills', COUNT(*) FROM job_skills
UNION ALL SELECT 'applications', COUNT(*) FROM applications
UNION ALL SELECT 'resume_analysis', COUNT(*) FROM resume_analysis;

-- Relationships: developers and skills, recruiters and jobs, applications.
SELECT u.name AS developer, s.name AS skill, s.level, s.years
FROM users u JOIN developer_profiles d ON d.user_id = u.id
JOIN skills s ON s.developer_id = d.id ORDER BY u.name, s.name;

SELECT j.id, j.title, r.company_name, j.location, j.salary, j.job_type
FROM jobs j JOIN recruiter_profiles r ON r.id = j.recruiter_id
ORDER BY j.id;

SELECT a.id, u.name AS developer, j.title AS job, r.company_name, a.status
FROM applications a JOIN developer_profiles d ON d.id = a.developer_id
JOIN users u ON u.id = d.user_id JOIN jobs j ON j.id = a.job_id
JOIN recruiter_profiles r ON r.id = j.recruiter_id ORDER BY a.id;

SELECT p.name AS project, u.name AS developer, t.name AS technology
FROM projects p JOIN developer_profiles d ON d.id = p.developer_id
JOIN users u ON u.id = d.user_id
LEFT JOIN project_technologies t ON t.project_id = p.id
ORDER BY p.id, t.name;

-- Search, grouping, aggregation and sorting.
SELECT id, title, location FROM jobs
WHERE title LIKE '%Python%' OR description LIKE '%Python%' ORDER BY id;
SELECT status, COUNT(*) AS total FROM applications GROUP BY status ORDER BY total DESC;
SELECT location, COUNT(*) AS total FROM jobs GROUP BY location ORDER BY total DESC;
SELECT j.id, j.title, COUNT(a.id) AS applicants
FROM jobs j LEFT JOIN applications a ON a.job_id = j.id
GROUP BY j.id, j.title ORDER BY applicants DESC, j.id;

-- Foreign keys, views and triggers currently installed in this database.
SELECT TABLE_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = DATABASE() AND REFERENCED_TABLE_NAME IS NOT NULL
ORDER BY TABLE_NAME, COLUMN_NAME;
SHOW TRIGGERS;

-- Optional objects installed by mysql_demo.sql: display them only if present.
SET @audit_query = IF(
  EXISTS(SELECT 1 FROM information_schema.TABLES
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'application_status_history'),
  'SELECT * FROM application_status_history ORDER BY id',
  'SELECT ''application_status_history is not installed'' AS info');
PREPARE optional_query FROM @audit_query;
EXECUTE optional_query;
DEALLOCATE PREPARE optional_query;

SET @summary_query = IF(
  EXISTS(SELECT 1 FROM information_schema.VIEWS
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'job_application_summary'),
  'SELECT * FROM job_application_summary ORDER BY job_id',
  'SELECT ''job_application_summary is not installed'' AS info');
PREPARE optional_query FROM @summary_query;
EXECUTE optional_query;
DEALLOCATE PREPARE optional_query;
