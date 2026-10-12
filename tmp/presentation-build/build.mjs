import fs from 'node:fs/promises';
import {Presentation,PresentationFile} from 'file:///C:/Users/gurra/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs';
import {finalizePresentation} from 'file:///C:/Users/gurra/.codex/plugins/cache/openai-primary-runtime/presentations/26.1007.11041/skills/presentations/container_tools/artifact_tool_utils.mjs';
const root='D:/DBMS_DevApp', build=root+'/tmp/presentation-build';
const skill='C:/Users/gurra/.codex/plugins/cache/openai-primary-runtime/presentations/26.1007.11041/skills/presentations';
const P=Presentation.create({slideSize:{width:1280,height:720}});
const C={navy:'#10213A',ink:'#15283F',blue:'#315BDF',lime:'#C8F36A',muted:'#576980',white:'#FFFFFF',paper:'#F5F7FA',line:'#D5DDE8'};
const source='Sources: project app.py, mysql_demo.sql, README.md and DBMS_PROJECT_DOCUMENTATION.md in D:/DBMS_DevApp/DevMatch_AI_DBMS_Mini_Project/devmatch-ai. Requirements: C:/Users/gurra/Downloads/DBMS Mini Project_Guidelines.pptx.';
function txt(s,text,x,y,w,h,size=26,color=C.ink,bold=false){const a=s.shapes.add({geometry:'textbox',position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});a.text=text;a.text.style={fontSize:size,typeface:'Arial',color,bold,insets:0,autoFit:'none',verticalAlignment:'top'};return a;}
function slide(title,section='DBMS MINI PROJECT',note='',dark=false){const s=P.slides.add();s.background.fill=dark?C.navy:C.paper;txt(s,section,64,32,1100,25,16,dark?C.lime:C.blue,true);txt(s,title,64,78,1152,80,42,dark?C.white:C.ink,true);txt(s,'DevMatch AI',64,681,600,24,14,dark?'#A9BDD6':C.muted);txt(s,String(P.slides.items.length).padStart(2,'0'),1150,678,66,26,16,dark?C.lime:C.muted);s.speakerNotes.text=note+'\n\n'+source;return s;}
function para(s,head,body,x,y,w=1050){txt(s,head,x,y,w,40,28,C.blue,true);txt(s,body,x,y+48,w,90,26);}
function table(s,values,x=64,y=175,w=1152,h=420,widths){const t=s.tables.add({rows:values.length,columns:values[0].length,left:x,top:y,width:w,height:h,values,columnWidths:widths});t.borders.assign({fill:C.line,width:1});for(let r=0;r<values.length;r++)for(let c=0;c<values[0].length;c++){let cell=t.getCell(r,c);cell.fill=r===0?C.navy:r%2?C.white:'#EDF1F6';cell.text.style={fontSize:22,typeface:'Arial',color:r===0?C.white:C.ink,bold:r===0,insets:10,verticalAlignment:'middle'};}return t;}
function box(s,label,x,y,w,h,small=false){const a=s.shapes.add({geometry:'rect',position:{left:x,top:y,width:w,height:h},fill:C.white,line:{fill:C.line,width:1.5}});a.text=label;a.text.style={fontSize:small?20:23,typeface:'Arial',color:C.ink,insets:14,verticalAlignment:'middle',autoFit:'none'};return a;}
function link(s,a,b,from='bottom',to='top'){s.shapes.connect(a,b,{kind:'elbow',fromSide:from,toSide:to,line:{fill:C.blue,width:2},head:{type:'none'},tail:{type:'none'}});}
function code(s,text,x=64,y=190,w=1152,h=350,size=25){return txt(s,text,x,y,w,h,size,C.ink);}
async function screenshot(s,file,x,y,w,h,crop){const b=await fs.readFile(root+'/tmp/report/'+file);s.images.add({blob:b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength),contentType:'image/png',alt:'DevMatch AI '+file,fit:'contain',crop,position:{left:x,top:y,width:w,height:h}});s.speakerNotes.text+='\nScreenshot source: '+root+'/tmp/report/'+file+'. Captured project demonstration data, not a current database count.';}

let s=slide('DevMatch AI','FINAL DBMS PRESENTATION','Introduce the project as a developer portfolio and hiring platform. The core database is MySQL. The application runs in a desktop or laptop browser.',true);
txt(s,'Developer Portfolio & Hiring Platform',64,220,1100,70,36,C.white);
txt(s,'Database Management System Mini Project',64,317,1100,45,27,'#A9BDD6');
txt(s,'CMR Institute of Technology, Bengaluru\nDepartment of Electronics and Communication Engineering\nAcademic year 2026–27',64,420,1120,110,23,'#A9BDD6');
txt(s,'Presented by: ____________________    USN: ____________________\nGuide: ____________________',64,563,1152,80,21,C.white);

s=slide('Problem statement','01 / INTRODUCTION','Explain why a relational database helps: developers, vacancies and decisions must stay consistent. Avoid claiming that skill match measures overall competence.');
para(s,'Hiring information is scattered','Profiles, portfolios, resumes and job requirements often exist in separate places.',64,184);
para(s,'Unstructured skill lists make comparison difficult','Repeated details and comma-separated values complicate search and updates.',64,337);
para(s,'Proposed solution','A web application that connects developer evidence, job requirements and application decisions through related MySQL tables.',64,490);

s=slide('Objectives and application modules','01 / INTRODUCTION','Developer and recruiter accounts access their own workflows. The role-specific pages use the same database.');
table(s,[['Developer','Recruiter'],['Maintain profile, skills and projects','Maintain company profile and vacancies'],['Upload PDF and view resume analysis','Review applicant profiles and resumes'],['Search jobs and apply once per job','Inspect matched and missing skills'],['Track application status','Change application status after review']],64,187,1152,360,[576,576]);
txt(s,'DBMS objective: related tables, normalized data, integrity constraints and SQL demonstrations',64,583,1152,70,27,C.blue,true);

s=slide('System architecture','02 / DEVELOPMENT','A browser submits forms to Flask. SQLAlchemy uses PyMySQL to connect to MySQL. PDF extraction uses PyMuPDF. Gemini is optional. Supabase holds resume files only when configured, not relational application records.');
let b=box(s,'Desktop / laptop browser\nHTML, CSS, JavaScript and Jinja',64,199,310,130);let f=box(s,'Python + Flask\nRoutes, sessions and validation',484,199,310,130);let d=box(s,'MySQL 8\nSQLAlchemy + PyMySQL',904,199,310,130);link(s,b,f,'right','left');link(s,f,d,'right','left');
txt(s,'Resume workflow',64,398,1152,45,28,C.blue,true);txt(s,'PDF text extraction with PyMuPDF\nOptional Gemini analysis, with local extraction fallback',64,452,1152,90,27);txt(s,'Optional Supabase Storage stores private resume PDFs. MySQL stores application records.',64,579,1152,58,24,C.muted);

s=slide('Application development process','02 / DEVELOPMENT','Use the steps to explain the project process without claiming a measured test result.');
table(s,[['Stage','Work completed in the project'],['Requirements','Defined developer, recruiter and hiring workflows'],['Database design','Created ER model, key mapping and normalized child tables'],['Implementation','Built Flask routes, forms and SQLAlchemy CRUD'],['Demonstration data','Added demo seed, SQL view and status audit trigger'],['Verification','Added schema/row checks and the database demonstration page']],64,182,1152,410,[270,882]);

s=slide('ER diagram and cardinalities','03 / DATABASE DESIGN','Read a link as parent to child. Each child has exactly one parent. User to either profile is optional one-to-one. All remaining links are one-to-zero-or-many. Applications resolve the developer-to-job many-to-many relationship. Status history is the SQL audit extension.');
const U=box(s,'User',510,163,240,58),D=box(s,'Developer profile',64,274,250,60),R=box(s,'Recruiter profile',956,274,260,60);
link(s,U,D,'left','top');link(s,U,R,'right','top');txt(s,'1 : 0..1',310,245,160,26,20,C.blue);txt(s,'1 : 0..1',810,245,160,26,20,C.blue);
const Sk=box(s,'Skill',64,420,180,58),Pr=box(s,'Project',275,420,180,58),An=box(s,'Resume analysis',64,566,225,58),Pt=box(s,'Project technology',310,566,230,58),J=box(s,'Job',970,420,230,58),Js=box(s,'Job skill',970,566,230,58),A=box(s,'Application',616,420,230,58),H=box(s,'Status history',616,566,230,58);
link(s,D,Sk);link(s,D,Pr);link(s,D,An,'left','left');link(s,Pr,Pt);link(s,R,J);link(s,J,Js);link(s,D,A,'right','top');link(s,J,A,'left','right');link(s,A,H);
txt(s,'Other links: 1 : 0..N\nDeveloper and Job: M : N via Application',488,288,418,75,22,C.blue,true);

s=slide('Relational schema: accounts and portfolios','03 / DATABASE DESIGN','PK means primary key. FK means foreign key. UK means uniqueness. The schema labels include all model attributes, not only a selected subset. Resume analysis text fields store narrative/extraction results, while searchable skills use separate rows.');
const su=box(s,'users\nid PK, name, email UK, password_hash, role, created_at',64,180,1152,80,true);
const sd=box(s,'developer_profiles\nid PK, user_id FK/UK, bio, phone, location, education, experience, github_url, linkedin_url, resume_path',64,283,600,132,true);
const sr=box(s,'recruiter_profiles\nid PK, user_id FK/UK, company_name, company_description, location, website',704,283,512,132,true);
const ss=box(s,'skills\nid PK, developer_id FK, name, level, years\nUK (developer_id, name)',64,447,345,172,true);
const sp=box(s,'projects\nid PK, developer_id FK, name, description, github_link, project_link',441,447,345,172,true);
const st=box(s,'project_technologies\nid PK, project_id FK, name, category, version, added_at\nUK (project_id, name)',818,447,398,172,true);
link(s,su,sd);link(s,su,sr);link(s,sd,ss);link(s,sd,sp);link(s,sp,st,'right','left');
txt(s,'FK links: profiles.user_id = users.id; skills/projects.developer_id = developer_profiles.id; technologies.project_id = projects.id',64,639,1152,34,18,C.muted);

s=slide('Relational schema: hiring and analysis','03 / DATABASE DESIGN','The first four entities are application models. application_status_history is installed by mysql_demo.sql. Each table has a primary key and at least five attributes. All child foreign keys refer to the parent id.');
const sj=box(s,'jobs\nid PK, recruiter_id FK, title, description, location, salary, experience_required, job_type, deadline, created_at',64,181,560,139,true);
const sk=box(s,'job_skills\nid PK, job_id FK, name, importance, minimum_years, added_at\nUK (job_id, name)',666,181,550,139,true);
const sa=box(s,'applications\nid PK, developer_id FK, job_id FK, status, created_at\nUK (developer_id, job_id)',64,352,560,124,true);
box(s,'resume_analysis\nid PK, developer_id FK, summary, strengths, missing_skills, extracted_skills, created_at',666,352,550,124,true);
const sh=box(s,'application_status_history (SQL audit extension)\nid PK, application_id FK, old_status, new_status, changed_at',64,509,1152,100,true);
link(s,sj,sk,'right','left');link(s,sj,sa);link(s,sa,sh);
txt(s,'FK parents: jobs / recruiter_profiles; job_skills / jobs; applications / developers and jobs; analysis / developers; history / applications',64,631,1152,40,18,C.muted);

s=slide('ER-to-relational mapping','03 / DATABASE DESIGN','Use the application bridge as the main mapping example. User does not need its own outgoing foreign key because profiles reference it. Every entity participates in a relationship.');
table(s,[['Relationship','Mapping rule','Project example'],['Entity','Create table with a primary key','users.id'],['1 : 0..1','Unique FK in the profile table','developer_profiles.user_id'],['1 : N','FK in the child table','jobs.recruiter_id'],['M : N','Bridge table with both FKs','applications'],['Repeated value','Separate child records','job_skills, project_technologies']],64,183,1152,421,[225,415,512]);
txt(s,'UNIQUE (developer_id, job_id) allows one application per developer per job',64,625,1152,40,25,C.blue,true);

s=slide('Normalization of the relations','03 / DATABASE DESIGN','The normalized operational skill and technology records use one row per value. Narrative resume-analysis text is distinct from the normalized searchable skills. Key facts belong to their entity. The score is calculated, not duplicated in applications.');
para(s,'1NF: one skill or technology per child row','job_skills and project_technologies replace comma-separated operational lists.',64,177);
para(s,'2NF: facts depend on the complete key','Skill level and years describe a developer-skill pair. Application status describes a developer-job application.',64,337);
para(s,'3NF: separate facts about separate entities','User credentials, company details and job details stay in their own tables. Applications reference developers and jobs through foreign keys.',64,497);

s=slide('Table and record requirements','04 / DBMS EVIDENCE','These are fresh-seed row counts from app.py, not a live database inspection. Run verify-dbms before the presentation to verify the actual database. The audit script backfills one initial history row per application. users participates in relationships through incoming profile FKs.');
table(s,[['Table','Attributes','Fresh demo seed rows'],['users','6','10'],['developer_profiles / recruiter_profiles','10 / 6','5 each'],['skills / projects','5 / 6','15 / 5'],['project_technologies','6','10'],['jobs / job_skills','10 / 6','5 / 15'],['applications / resume_analysis','5 / 7','5 each'],['application_status_history*','5','At least 5 after SQL backfill']],64,172,1152,418,[620,210,322]);
txt(s,'10 application tables + 1 audit table. *Audit extension requires mysql_demo.sql.',64,613,1152,45,24,C.blue,true);

s=slide('Sample data: five related job records','04 / DBMS EVIDENCE','Rows shown are the five original demo job postings and their recruiter companies from the project seed. They illustrate related sample data. IDs/links are resolved by the seed workflow and may differ in an existing database.');
table(s,[['Job title','Recruiter company','Required skills'],['Python Backend Engineer','Northstar Labs','Python, Flask, MySQL'],['Frontend Developer','Pixel Forge','JavaScript, React, Git'],['ML Engineer Intern','Cloudline','Python, Machine Learning, Pandas'],['Java API Developer','Vertex Systems','Java, SQL, Docker'],['Cloud Software Engineer','Bright Data','Python, AWS, JavaScript']],64,191,1152,370,[380,280,492]);
txt(s,'Each job references a recruiter. Each listed skill is a separate job_skills row.',64,606,1152,60,26,C.blue,true);

s=slide('Keys and integrity constraints','04 / DBMS EVIDENCE','The models have integer primary keys. Foreign keys connect child records. Uniqueness constraints prevent duplicate values in each parent. Login uses hashed passwords and role checks. Do not claim database checks enforce every business rule.');
table(s,[['Constraint','Purpose'],['Primary key id on every table','Identify each record uniquely'],['Foreign keys between related tables','Keep references tied to their parent entity'],['Unique email and profile user_id','Prevent duplicate accounts and same-role profiles'],['Unique developer_id + job_id','Prevent repeat applications to the same job'],['Unique parent_id + skill/technology name','Prevent duplicate values within a parent']],64,183,1152,405,[560,592]);
txt(s,'Application controls also check user roles, ownership and form submissions.',64,619,1152,40,25,C.muted);

s=slide('MySQL CRUD demonstration','05 / SQL COMMANDS','Use a dedicated demonstration database. Choose an existing recruiter with the subquery. Run in the same MySQL session to preserve @demo_job_id. Autocommit makes changes visible to a second connection. Refresh /dbms-demo after each operation. Delete only the dedicated test row.');
code(s,"INSERT INTO jobs (recruiter_id, title, description, location)\nVALUES ((SELECT id FROM recruiter_profiles ORDER BY id LIMIT 1),\n        'Final Demo Job', 'DBMS demonstration', 'Bengaluru');\nSET @demo_job_id = LAST_INSERT_ID();\n\nSELECT id, title, location FROM jobs WHERE id = @demo_job_id;\nUPDATE jobs SET location = 'Hyderabad' WHERE id = @demo_job_id;\nDELETE FROM jobs WHERE id = @demo_job_id;",64,181,1152,380,26);
txt(s,'Refresh /dbms-demo after each committed change to show insert, update and delete.',64,593,1152,60,27,C.blue,true);

s=slide('SELECT, JOIN, LIKE and aggregation','05 / SQL COMMANDS','First query joins users, developer profiles and skills, filters Python with LIKE and sorts names. Second query groups application statuses. Results depend on the current database.');
code(s,"SELECT u.name, s.name AS skill, s.level\nFROM users u\nJOIN developer_profiles d ON d.user_id = u.id\nJOIN skills s ON s.developer_id = d.id\nWHERE s.name LIKE '%Python%'\nORDER BY u.name;\n\nSELECT status, COUNT(*) AS total\nFROM applications\nGROUP BY status ORDER BY total DESC;",64,178,1152,407,27);
txt(s,'Search candidate skills and summarize application decisions with relational queries.',64,612,1152,50,26,C.blue,true);

s=slide('ALTER, MODIFY and VIEW','05 / SQL COMMANDS','The ALTER/MODIFY command widens the salary field. The view joins recruiters and jobs and aggregates applications. LEFT JOIN retains jobs without applicants. The full SQL script also includes shortlisted_count.');
code(s,"ALTER TABLE jobs\nMODIFY COLUMN salary VARCHAR(150) NULL DEFAULT 'Not disclosed';\n\nCREATE OR REPLACE VIEW job_application_summary AS\nSELECT j.id AS job_id, j.title, r.company_name,\n       COUNT(a.id) AS applicant_count\nFROM jobs j\nJOIN recruiter_profiles r ON r.id = j.recruiter_id\nLEFT JOIN applications a ON a.job_id = j.id\nGROUP BY j.id, j.title, r.company_name;\n\nSELECT * FROM job_application_summary;",64,178,1152,444,25);

s=slide('TRIGGER for application status history','05 / SQL COMMANDS','Run mysql_demo.sql once to create the audit table, initial history records and trigger. The simplified excerpt below is the actual trigger definition. Test with a saved recruiter status change, then SELECT the matching application_id in history. The script transactional CRUD example ends with ROLLBACK and does not prove cross-connection page visibility.');
code(s,"DELIMITER $$\nCREATE TRIGGER log_application_status\nAFTER UPDATE ON applications FOR EACH ROW\nBEGIN\n  IF OLD.status <> NEW.status THEN\n    INSERT INTO application_status_history\n      (application_id, old_status, new_status)\n    VALUES (NEW.id, OLD.status, NEW.status);\n  END IF;\nEND$$\nDELIMITER ;",64,176,1152,400,27);
txt(s,'A saved status change creates an audit row with the old status, new status and time.',64,607,1152,60,26,C.blue,true);

s=slide('Developer dashboard','06 / APPLICATION RESULTS','Explain the visible profile skills, project count and application status. This is an existing project screenshot with demonstration records.');
await screenshot(s,'developer_short.png',64,171,1152,440);txt(s,'Profile skills and application status come from related MySQL records.',64,621,1152,44,26,C.blue,true);

s=slide('Job search and skill matching','06 / APPLICATION RESULTS','The captured job-search page shows examples of skill matches. Closed listings in the screenshot are historical demo records. For live demonstration, create a job without a past deadline.');
await screenshot(s,'match.png',430,165,786,470,{left:0.1,top:0.46,right:0.09,bottom:0.02});txt(s,'Search vacancies\nby role, skill or location',64,216,330,120,29,C.blue,true);txt(s,'Compare required skills\nwith profile and resume\nevidence',64,390,330,130,27);txt(s,'Captured demo data',430,642,780,26,18,C.muted);

s=slide('Recruiter applicant review','06 / APPLICATION RESULTS','Show the score, matched/missing skills and recruiter decision selector. This screenshot records a 100 percent skill match and a shortlisted status. It does not establish hiring quality.');
await screenshot(s,'applicants.png',430,166,786,470,{left:0.1,top:0.32,right:0.38,bottom:0.3});txt(s,'Review skill evidence',64,214,330,90,30,C.blue,true);txt(s,'Inspect portfolios\nand resumes\n\nUpdate the application\nstatus after review',64,331,330,230,27);txt(s,'Captured demo data',430,643,780,26,18,C.muted);

s=slide('Skill match calculation','06 / APPLICATION RESULTS','ats_match normalizes required skills and the union of profile plus latest extracted resume skills. Match is the percentage of required names present. New scores above 70 are Shortlisted, and scores at or below 70 are Rejected. Recruiters can override these initial statuses. This does not evaluate experience, skill depth or overall competence.');
txt(s,'Match (%) = matched required skills ÷ total required skills × 100',64,192,1152,100,35,C.blue,true);
table(s,[['Illustrative example','Value'],['Job requirements','Python, Flask, MySQL'],['Candidate evidence','Python, Flask'],['Result','2 ÷ 3 × 100 = 66.7%'],['Initial status for this example','Rejected, because the score is at or below 70%']],64,313,1152,268,[465,687]);
txt(s,'Above 70%: Shortlisted. Recruiters can change the initial status after review.',64,613,1152,44,25,C.muted);

s=slide('Two-way website and MySQL demonstration','07 / LIVE DEMONSTRATION','This is the required live demonstration, not an automated synchronization claim. Keep the website and SQL client connected to the same MySQL database. Use committed changes. The /dbms-demo page disables browser caching and queries fresh rows.');
para(s,'1. Website changes appear in MySQL','Publish a dedicated test job. Use SELECT in MySQL to locate its title. Edit or delete it in the website and repeat SELECT.',64,177);
para(s,'2. MySQL changes appear in the website','Run the INSERT, UPDATE and DELETE examples on slide 14. Refresh /dbms-demo after each change.',64,350);
txt(s,"SELECT id, title, location FROM jobs\nWHERE title = 'Final Demo Job';",64,527,1152,89,29,C.blue,true);

s=slide('Final review checklist','07 / LIVE DEMONSTRATION','This is a preparation checklist, not a claim that runtime checks were executed while producing the deck. The final review should include the live MySQL output and UI reflection. The verifier checks the history table too when installed.');
table(s,[['Guideline requirement','Evidence to show'],['At least 5 related entities','10 application tables with PK/FK links'],['At least 5 attributes and rows per table','Schema and fresh-seed inventory, then verify-dbms'],['Schema, ER mapping and normalization','Design slides 6–10'],['INSERT, UPDATE, DELETE, ALTER/MODIFY, VIEW, TRIGGER','SQL demonstrations on slides 14–17'],['Changes visible in both directions','Website + MySQL demonstration on slide 22'],['Desktop or laptop application','Run the web application in a computer browser']],64,180,1152,420,[535,617]);
txt(s,'Before presenting: flask --app app verify-dbms',64,620,1152,40,25,C.blue,true);

s=slide('Conclusion and future scope','08 / CONCLUSION','State implemented capabilities first. Future additions are proposals, not completed work. Skill matching is a support measure and recruiter review remains necessary.');
para(s,'Project outcome','DevMatch AI connects developer portfolios, vacancies and application records through a relational MySQL design.',64,184);
para(s,'DBMS learning','Keys, normalization and related queries support consistent data. Views and a status trigger extend the SQL demonstration.',64,343);
para(s,'Future improvements','Add richer skill evidence, interview scheduling and resume scanning. Extend audit coverage and reporting.',64,502);

s=slide('Thank you','QUESTIONS & LIVE DEMONSTRATION','Invite questions about the relational design, SQL demonstrations and skill matching. Open the application and SQL client for the live review.',true);
txt(s,'DevMatch AI',64,269,1152,80,62,C.lime,true);txt(s,'Developer Portfolio & Hiring Platform',64,382,1152,60,32,C.white);txt(s,'Ready to demonstrate the website and MySQL database',64,491,1152,70,27,'#A9BDD6');

await fs.mkdir(build+'/renders',{recursive:true});
for(let i=0;i<P.slides.items.length;i++){const png=await P.export({slide:P.slides.items[i],format:'png',scale:1});await fs.writeFile(build+'/renders/slide-'+String(i+1).padStart(2,'0')+'.png',new Uint8Array(await png.arrayBuffer()));console.log('Rendered '+(i+1));}
await fs.writeFile(build+'/deck.json',JSON.stringify(P.toProto()));
await (await PresentationFile.exportPptx(P)).save(build+'/candidate.pptx');
const result=await finalizePresentation({workspaceDir:root,candidatePath:build+'/candidate.pptx',finalPath:root+'/output/presentation/DevMatch_AI_Final_Presentation.pptx',pythonExecutable:'C:/Users/gurra/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe',integrityValidatorPath:skill+'/container_tools/inspect_presentation_package_integrity.py',layoutValidatorPath:skill+'/container_tools/inspect_presentation_layout_geometry.py',layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-bullet-geometry','--validate-heading-fit'],fontPolicy:{basis:'design',families:['Arial']},requiredNativeTableOwnerSlides:[],verifyArtifactToolImport:true,receiptPath:build+'/validation.json'});console.log(JSON.stringify(result));
