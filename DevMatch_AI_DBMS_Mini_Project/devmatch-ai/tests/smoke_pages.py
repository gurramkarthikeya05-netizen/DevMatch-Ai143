"""Read-only smoke check for public, developer, and recruiter pages."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from dotenv import load_dotenv
load_dotenv()

import app as project


with project.app.app_context():
    developer = project.User.query.filter_by(role='developer').first()
    recruiter = project.User.query.filter_by(role='recruiter').first()
    skill = project.Skill.query.filter_by(developer_id=developer.developer.id).first()
    job = project.Job.query.filter_by(recruiter_id=recruiter.recruiter.id).first()
    pages = [('/', None), ('/jobs', None), ('/dbms-demo', None),
             ('/login', None), ('/register', None),
             ('/dashboard', developer.id), ('/settings', developer.id),
             ('/career-ai', developer.id), ('/jobs', developer.id),
             (f'/skills/{skill.id}/details', developer.id),
             ('/dashboard', recruiter.id), ('/settings', recruiter.id),
             ('/developers', recruiter.id),
             (f'/developers/{developer.developer.id}', recruiter.id),
             (f'/jobs/{job.id}/edit', recruiter.id)]

    for path, user_id in pages:
        with project.app.test_client() as client:
            if user_id is not None:
                with client.session_transaction() as session:
                    session['uid'] = user_id
            response = client.get(path)
            print(f'{response.status_code} {path} ({user_id or "public"})')
            assert response.status_code == 200, response.get_data(as_text=True)[:500]

    for path, user_id, form in [
        ('/skills', developer.id, {'name': 'Invalid years probe', 'years': 'abc'}),
        ('/jobs', recruiter.id, {'title': 'Invalid date probe', 'description': 'Test',
                                 'required_skills': 'Python', 'deadline': 'invalid'}),
        (f'/jobs/{job.id}/edit', recruiter.id,
         {'title': job.title, 'description': job.description,
          'required_skills': job.required_skills, 'deadline': 'invalid'}),
    ]:
        with project.app.test_client() as client:
            with client.session_transaction() as session:
                session['uid'] = user_id
            client.get('/dashboard')
            with client.session_transaction() as session:
                form['csrf'] = session['csrf']
            response = client.post(path, data=form)
            print(f'{response.status_code} POST {path} (invalid input)')
            assert response.status_code != 500
