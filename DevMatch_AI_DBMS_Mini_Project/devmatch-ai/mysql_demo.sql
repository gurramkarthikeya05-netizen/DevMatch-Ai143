-- Run after flask --app app init-db and seed-demo against MySQL.
-- Demonstrates INSERT, SELECT, UPDATE, DELETE, ALTER/MODIFY, VIEW, TRIGGER, JOIN and GROUP BY.
USE devmatch_ai;

CREATE OR REPLACE VIEW job_application_summary AS
SELECT j.id AS job_id, j.title, r.company_name, COUNT(a.id) AS applicant_count,
       SUM(CASE WHEN a.status = 'Shortlisted' THEN 1 ELSE 0 END) AS shortlisted_count
FROM jobs j JOIN recruiter_profiles r ON r.id = j.recruiter_id
LEFT JOIN applications a ON a.job_id = j.id
GROUP BY j.id, j.title, r.company_name;

-- Safe schema modification: widen salary without changing stored values.
ALTER TABLE jobs MODIFY COLUMN salary VARCHAR(150) NULL DEFAULT 'Not disclosed';

-- Audit statuses automatically when recruiters update an application.
CREATE TABLE IF NOT EXISTS application_status_history (
  id INT PRIMARY KEY AUTO_INCREMENT,
  application_id INT NOT NULL,
  old_status VARCHAR(30) NULL,
  new_status VARCHAR(30) NOT NULL,
  changed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_history_application FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
);
ALTER TABLE application_status_history MODIFY COLUMN old_status VARCHAR(30) NULL;

-- Record the initial status for existing applications so the audit table has sample rows.
INSERT INTO application_status_history(application_id, old_status, new_status, changed_at)
SELECT a.id, NULL, a.status, a.created_at
FROM applications a
LEFT JOIN application_status_history h
  ON h.application_id = a.id AND h.old_status IS NULL
WHERE h.id IS NULL;

DROP TRIGGER IF EXISTS log_application_status;
DELIMITER $$
CREATE TRIGGER log_application_status AFTER UPDATE ON applications FOR EACH ROW
BEGIN
  IF OLD.status <> NEW.status THEN
    INSERT INTO application_status_history(application_id, old_status, new_status)
    VALUES (NEW.id, OLD.status, NEW.status);
  END IF;
END$$
DELIMITER ;

-- SELECT / LIKE / JOIN / ORDER BY
SELECT u.name, s.name AS skill, s.level FROM users u
JOIN developer_profiles d ON d.user_id=u.id JOIN skills s ON s.developer_id=d.id
WHERE s.name LIKE '%Python%' ORDER BY u.name;

-- GROUP BY and VIEW
SELECT * FROM job_application_summary ORDER BY applicant_count DESC;
SELECT status, COUNT(*) AS total FROM applications GROUP BY status ORDER BY total DESC;

-- Demonstrate INSERT, UPDATE, DELETE on real related tables without leaving test data behind.
-- seed-demo creates at least one unoccupied developer/job pair for this transaction.
START TRANSACTION;
SELECT d.id, j.id INTO @demo_developer_id, @demo_job_id
FROM developer_profiles d
CROSS JOIN jobs j
LEFT JOIN applications a ON a.developer_id = d.id AND a.job_id = j.id
WHERE a.id IS NULL
ORDER BY d.id, j.id
LIMIT 1;

INSERT INTO applications(developer_id, job_id, status)
VALUES (@demo_developer_id, @demo_job_id, 'Applied');
SELECT * FROM applications
WHERE developer_id = @demo_developer_id AND job_id = @demo_job_id;

UPDATE applications SET status = 'Under Review'
WHERE developer_id = @demo_developer_id AND job_id = @demo_job_id;
SELECT * FROM application_status_history
WHERE application_id = (SELECT id FROM applications
                        WHERE developer_id = @demo_developer_id AND job_id = @demo_job_id);

DELETE FROM applications
WHERE developer_id = @demo_developer_id AND job_id = @demo_job_id;
SELECT COUNT(*) AS remaining_demo_rows FROM applications
WHERE developer_id = @demo_developer_id AND job_id = @demo_job_id;
ROLLBACK;

-- Frontend CRUD is persistent: register/profile/job/apply actions commit through SQLAlchemy.
-- Verify frontend changes here with SELECT; SQL changes to these tables appear on page refresh.
