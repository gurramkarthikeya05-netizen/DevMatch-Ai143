import fs from 'node:fs/promises';
import sharp from 'file:///C:/Users/gurra/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/dist/index.mjs';
const dir='D:/DBMS_DevApp/output/diagrams';
const er=await fs.readFile(dir+'/DevMatch_AI_Website_ER_Diagram_Styled.svg');
await fs.writeFile(dir+'/DevMatch_AI_ER_HD.svg',er);
await sharp(er,{density:144}).png().withMetadata({density:300}).toFile(dir+'/DevMatch_AI_ER_HD.png');
const data=JSON.parse(await fs.readFile('D:/DBMS_DevApp/tmp/presentation-build/website-schema.json','utf8'));
const W=3800,H=3380,palette={account:'#172B4D',dev:'#087F8C',job:'#2858B8',app:'#7351A8'};
const coords={users:[1450,220,700,'account'],developer_profiles:[500,900,800,'dev'],recruiter_profiles:[2550,900,800,'job'],skills:[150,1800,650,'dev'],projects:[1000,1800,650,'dev'],resume_analysis:[1850,1800,650,'dev'],jobs:[2750,1560,700,'job'],project_technologies:[1000,2500,650,'dev'],applications:[1900,2500,700,'app'],job_skills:[2850,2500,700,'job']};
const nodes=Object.fromEntries(data.map(t=>[t.name,{...t,x:coords[t.name][0],y:coords[t.name][1],w:coords[t.name][2],color:palette[coords[t.name][3]],h:210+t.columns.length*50+t.unique.length*40}]));
const o=[],esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;');
function text(x,y,t,size=29,color='#172B4D',weight=400,anchor='start'){o.push(`<text x="${x}" y="${y}" font-family="Arial, sans-serif" font-size="${size}" font-weight="${weight}" fill="${color}" text-anchor="${anchor}" dominant-baseline="middle">${esc(t)}</text>`);}
function path(points,color='#7C8CA3'){o.push(`<polyline points="${points.map(p=>p.join(',')).join(' ')}" fill="none" stroke="${color}" stroke-width="4" stroke-linejoin="round" marker-end="url(#arrow)"/>`);const [x,y]=points[0];o.push(`<circle cx="${x}" cy="${y}" r="6" fill="${color}"/>`);}
function label(x,y,t){o.push(`<rect x="${x-60}" y="${y-21}" width="120" height="42" rx="10" fill="#FAFBFD"/>`);text(x,y,t,25,'#526782',700,'middle');}
function field(n,name,side){const a=nodes[n],i=a.columns.findIndex(c=>c.name===name);if(i<0)throw Error('Missing '+n+'.'+name);return [side==='left'?a.x:a.x+a.w,a.y+170+i*50];}
o.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="#7C8CA3"/></marker><filter id="shadow" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#172B4D" flood-opacity="0.12"/></filter></defs><rect width="100%" height="100%" fill="#FAFBFD"/>`);
text(1900,82,'DevMatch AI',78,'#172B4D',700,'middle');text(1900,153,'WEBSITE RELATIONAL SCHEMA',33,'#526782',700,'middle');
path([field('developer_profiles','user_id','right'),[1400,1120],[1400,390],field('users','id','left')]);label(1370,750,'1 : 1');
path([field('recruiter_profiles','user_id','left'),[2350,1120],[2350,390],field('users','id','right')]);label(2350,750,'1 : 1');
path([field('skills','developer_id','left'),[65,2020],[65,1070],field('developer_profiles','id','left')]);label(95,1720,'1 : N');
path([field('projects','developer_id','right'),[1710,2020],[1710,1070],field('developer_profiles','id','right')]);label(1710,1710,'1 : N');
path([field('resume_analysis','developer_id','left'),[1780,2020],[1780,1070],field('developer_profiles','id','right')]);label(1800,1510,'1 : N');
path([field('applications','developer_id','left'),[1820,2720],[1820,1070],field('developer_profiles','id','right')]);label(1820,2400,'1 : N');
path([field('jobs','recruiter_id','left'),[2450,1780],[2450,1070],field('recruiter_profiles','id','left')]);label(2450,1510,'1 : N');
path([field('project_technologies','project_id','left'),[930,2720],[930,1970],field('projects','id','left')]);label(930,2400,'1 : N');
path([field('applications','job_id','right'),[2670,2770],[2670,1730],field('jobs','id','left')]);label(2670,2400,'1 : N');
path([field('job_skills','job_id','right'),[3690,2720],[3690,1730],field('jobs','id','right')]);label(3690,2400,'1 : N');
for(const n of Object.values(nodes)){
 o.push(`<rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="16" fill="white" stroke="#D9E1ED" stroke-width="2" filter="url(#shadow)"/><path d="M${n.x+16},${n.y}H${n.x+n.w-16}Q${n.x+n.w},${n.y} ${n.x+n.w},${n.y+16}V${n.y+80}H${n.x}V${n.y+16}Q${n.x},${n.y} ${n.x+16},${n.y}" fill="${n.color}"/>`);
 text(n.x+28,n.y+43,n.name,34,'#FFFFFF',700);
 text(n.x+28,n.y+118,'KEY',23,'#526782',700);text(n.x+150,n.y+118,'COLUMN',23,'#526782',700);text(n.x+n.w-25,n.y+118,'TYPE',23,'#526782',700,'end');
 o.push(`<line x1="${n.x}" y1="${n.y+143}" x2="${n.x+n.w}" y2="${n.y+143}" stroke="#D9E1ED" stroke-width="2"/>`);
 n.columns.forEach((c,i)=>{const y=n.y+170+i*50;
  if(i%2===0)o.push(`<rect x="${n.x+1}" y="${y-25}" width="${n.w-2}" height="50" fill="#F5F8FC"/>`);
  text(n.x+28,y,c.key.join('/'),24,c.key.includes('PK')?'#B27514':n.color,700);
  text(n.x+150,y,c.name,28,'#172B4D',c.key.includes('PK')?700:400);
  text(n.x+n.w-25,y,c.type,24,'#526782',400,'end');
 });
 for(let i=0;i<n.unique.length;i++)text(n.x+28,n.y+185+n.columns.length*50+i*40,'UNIQUE ('+n.unique[i].join(', ')+')',22,n.color,700);
}
o.push(`<line x1="150" y1="3095" x2="3650" y2="3095" stroke="#D9E1ED" stroke-width="3"/>`);
text(1900,3160,'PK  Primary key     FK  Foreign key     UK  Unique column     UNIQUE (…)  Unique column combination',30,'#172B4D',700,'middle');
text(1900,3230,'Connectors run from a foreign-key column to its referenced primary key. Labels show parent-to-child cardinality.',29,'#526782',400,'middle');
text(1900,3290,'Profiles are optional 1:1 relationships. Developer and Job form an M:N relationship through Applications.',29,'#526782',400,'middle');
o.push('</svg>');const svg=o.join('\n');await fs.writeFile(dir+'/DevMatch_AI_Schema_HD.svg',svg);
await sharp(Buffer.from(svg),{density:144}).png().withMetadata({density:300}).toFile(dir+'/DevMatch_AI_Schema_HD.png');
await sharp(Buffer.from(svg)).png().toFile('D:/DBMS_DevApp/tmp/presentation-build/schema-preview.png');
const erMeta=await sharp(dir+'/DevMatch_AI_ER_HD.png').metadata(),schemaMeta=await sharp(dir+'/DevMatch_AI_Schema_HD.png').metadata();console.log(JSON.stringify({er:[erMeta.width,erMeta.height],schema:[schemaMeta.width,schemaMeta.height],tables:data.length,columns:data.reduce((s,t)=>s+t.columns.length,0)}));
