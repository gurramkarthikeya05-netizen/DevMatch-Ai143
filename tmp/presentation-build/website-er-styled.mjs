import fs from 'node:fs/promises';
import sharp from 'file:///C:/Users/gurra/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/dist/index.mjs';
const W=4200,H=3740,green='#172B4D';
const nodes={
 user:[2100,360,'USER',['User ID','Name','Email']],
 developer:[1100,1000,'DEVELOPER PROFILE',['Developer ID','Bio','Location']],
 recruiter:[3300,1000,'RECRUITER PROFILE',['Recruiter ID','Company name','Website']],
 skill:[550,1680,'SKILL',['Skill ID','Skill name','Level']],
 project:[1650,1680,'PORTFOLIO PROJECT',['Project ID','Project name','Description']],
 job:[3300,1680,'JOB',['Job ID','Job title','Location']],
 resume:[550,2380,'RESUME ANALYSIS',['Analysis ID','Summary','Strengths']],
 application:[2400,2380,'APPLICATION',['Application ID','Status','Date applied']],
 jobskill:[3650,2380,'JOB SKILL',['Requirement ID','Skill name','Importance']],
 technology:[1500,2380,'PROJECT TECHNOLOGY',['Technology ID','Name','Version']]
};
const out=[];const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;');
const line=(pts)=>out.push(`<polyline points="${pts.map(p=>p.join(',')).join(' ')}" fill="none" stroke="#8796AC" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>`);
const text=(x,y,s,size=32,weight=400,underline=false,color=green)=>out.push(`<text x="${x}" y="${y}" font-family="Arial, sans-serif" font-size="${size}" font-weight="${weight}" fill="${color}" text-anchor="middle" dominant-baseline="middle"${underline?' text-decoration="underline"':''}>${esc(s)}</text>`);
function rel(label,x,y,p1,p2,c1,c2){line(p1);line(p2);out.push(`<polygon points="${x},${y-68} ${x+135},${y} ${x},${y+68} ${x-135},${y}" fill="#FFF4DE" stroke="#C99031" stroke-width="3"/>`);text(x,y-16,label,29,700,false,'#81560E');text(x,y+24,c2[2]==='0..1'?'1 : 1':'1 : N',24,700,false,'#81560E');text(c1[0],c1[1],c1[2],29);text(c2[0],c2[1],c2[2],29);}
out.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Chen ER diagram for DevMatch AI"><defs><filter id="shadow" x="-30%" y="-50%" width="160%" height="200%"><feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#172B4D" flood-opacity="0.1"/></filter></defs><rect width="100%" height="100%" fill="#FAFBFD"/><rect x="0" y="2535" width="4200" height="1205" fill="#F0F4FA"/>`);
text(2100,76,'DevMatch AI',88,700);
text(2100,143,'WEBSITE ENTITY RELATIONSHIP DIAGRAM',31,700,false,'#526782');

rel('Owns',1340,660,[[1940,405],[1940,660],[1475,660]],[[1205,660],[940,660],[940,955]],[1840,624,'1'],[887,899,'0..1']);
rel('Owns',2860,660,[[2260,405],[2260,660],[2725,660]],[[2995,660],[3140,660],[3140,955]],[2360,624,'1'],[3090,899,'0..1']);
rel('Has',660,1320,[[940,1045],[940,1320],[795,1320]],[[525,1320],[390,1320],[390,1635]],[988,1170,'1'],[338,1568,'0..N']);
rel('Showcases',1520,1320,[[1260,1045],[1260,1320],[1385,1320]],[[1655,1320],[1810,1320],[1810,1635]],[1204,1170,'1'],[1870,1568,'0..N']);
rel('Posts',3300,1330,[[3460,1045],[3460,1200],[3300,1200],[3300,1262]],[[3300,1398],[3300,1470],[3460,1470],[3460,1635]],[3514,1135,'1'],[3520,1568,'0..N']);
rel('Receives',190,2010,[[1100,1045],[1100,1130],[25,1130],[25,2010],[55,2010]],[[325,2010],[390,2010],[390,2335]],[170,1180,'1'],[336,2280,'0..N']);
rel('Submits',2250,1710,[[1100,1045],[1100,1170],[2250,1170],[2250,1642]],[[2250,1778],[2250,2160],[2240,2160],[2240,2335]],[2180,1220,'1'],[2180,2278,'0..N']);
rel('Receives',2790,2030,[[3140,1725],[3140,2030],[2925,2030]],[[2655,2030],[2560,2030],[2560,2335]],[3090,1840,'1'],[2610,2278,'0..N']);
rel('Requires',3670,2030,[[3460,1725],[3460,1920],[3670,1920],[3670,1962]],[[3670,2098],[3670,2200],[3810,2200],[3810,2335]],[3514,1840,'1'],[3870,2278,'0..N']);
rel('Uses',1490,2030,[[1650,1725],[1650,1885],[1490,1885],[1490,1962]],[[1490,2098],[1490,2210],[1660,2210],[1660,2335]],[1710,1840,'1'],[1715,2278,'0..N']);
const family={user:['#172B4D','#EDF1F7'],developer:['#087F8C','#E8F6F5'],skill:['#087F8C','#E8F6F5'],project:['#087F8C','#E8F6F5'],resume:['#087F8C','#E8F6F5'],technology:['#087F8C','#E8F6F5'],recruiter:['#2858B8','#EBF1FC'],job:['#2858B8','#EBF1FC'],jobskill:['#2858B8','#EBF1FC'],application:['#7351A8','#F1ECF8']};
for(const [key,[x,y,label,attrs]] of Object.entries(nodes)){
 const [main,soft]=family[key];
 const pos=[[x,y-155],[x-340,y],[x+340,y]];
 for(let i=0;i<3;i++){const [ax,ay]=pos[i];line([[x,y],[ax,ay]]);out.push(`<ellipse cx="${ax}" cy="${ay}" rx="128" ry="44" fill="${soft}" stroke="${main}" stroke-opacity="0.48" stroke-width="2.6"/>`);text(ax,ay,attrs[i],30,i===0?700:400,i===0,main);}
 out.push(`<rect x="${x-212}" y="${y-45}" width="424" height="90" fill="${main}" stroke="${main}" stroke-width="3.2" filter="url(#shadow)"/>`);text(x,y,label,31,700,false,'#FFFFFF');
}
line([[150,2530],[4050,2530]]);
text(2100,2600,'NOTATION LEGEND',43,700);
const legendY=2720;
out.push(`<rect x="320" y="${legendY-42}" width="360" height="84" fill="#172B4D" stroke="#8796AC" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>`);
text(500,legendY,'ENTITY',31,700,false,'#FFFFFF');text(500,2805,'Strong entity',34,700);text(500,2860,'Has its own primary key',28);
out.push(`<rect x="1120" y="${legendY-42}" width="360" height="84" fill="white" stroke="#8796AC" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><rect x="1130" y="${legendY-32}" width="340" height="64" fill="white" stroke="#8796AC" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>`);
text(1300,legendY,'WEAK ENTITY',29,700);text(1300,2805,'Weak entity',34,700);text(1300,2860,'Owner key + partial key',28);
out.push(`<polygon points="2100,${legendY-60} 2260,${legendY} 2100,${legendY+60} 1940,${legendY}" fill="#FFF4DE" stroke="#C99031" stroke-width="3"/>`);
text(2100,legendY,'Relationship',29);text(2100,2805,'Relationship',34,700);text(2100,2860,'Connects entities',28);
out.push(`<ellipse cx="2900" cy="${legendY}" rx="165" ry="45" fill="#E8F6F5" stroke="#8796AC" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>`);
text(2900,legendY,'Attribute',31);text(2900,2805,'Attribute',34,700);text(2900,2860,'Describes an entity',28);
out.push(`<ellipse cx="3700" cy="${legendY}" rx="165" ry="45" fill="#EBF1FC" stroke="#8796AC" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>`);
text(3700,legendY,'ID',31,400,true);text(3700,2805,'Primary key',34,700);text(3700,2860,'Underlined attribute',28);
text(640,2906,'Accounts',28,700,false,'#172B4D');text(1620,2906,'Developer portfolio',28,700,false,'#087F8C');text(2700,2906,'Recruiter & jobs',28,700,false,'#2858B8');text(3600,2906,'Applications',28,700,false,'#7351A8');
text(2100,2960,'All 10 website entities are strong entities. The current design contains no weak entities.',34,700);
text(2100,3010,'Child entities have their own IDs. Depending on a parent through a foreign key does not make them weak.',29);
text(2100,3080,'RELATIONSHIP SUMMARY',43,700);
const pairs=[
 ['User — Developer profile','Owns','1 : 1*'],
 ['User — Recruiter profile','Owns','1 : 1*'],
 ['Developer profile — Skill','Has','1 : N'],
 ['Developer profile — Portfolio project','Showcases','1 : N'],
 ['Portfolio project — Project technology','Uses','1 : N'],
 ['Developer profile — Resume analysis','Receives','1 : N'],
 ['Developer profile — Application','Submits','1 : N'],
 ['Recruiter profile — Job','Posts','1 : N'],
 ['Job — Job skill','Requires','1 : N'],
 ['Job — Application','Receives','1 : N']
];
for(let col=0;col<2;col++){
 const x=190+col*2090,y=3170;
 text(x+630,y,'Entity pair',31,700);text(x+1450,y,'Relationship',31,700);text(x+1760,y,'Type',31,700);
 line([[x,y+32],[x+1900,y+32]]);
 for(let r=0;r<5;r++){const [pair,name,type]=pairs[col*5+r],ry=y+78+r*66;text(x+630,ry,pair,31);text(x+1450,ry,name,29);text(x+1760,ry,type,31,700);}
}
text(2100,3578,'M : N  Developer profile — Job, resolved through Application (one application per developer and job)',33,700);
text(2100,3690,'1 = exactly one     0..1 = zero or one     0..N = zero or many     1 : N = one-to-many     M : N = many-to-many',30);
text(2100,3633,'*A user may have zero or one profile of each type. Each profile belongs to exactly one user.',29,400,false,'#526782');
out.push('</svg>');
const dir='D:/DBMS_DevApp/output/diagrams';await fs.mkdir(dir,{recursive:true});const svg=out.join('\n');await fs.writeFile(dir+'/DevMatch_AI_Website_ER_Diagram_Styled.svg',svg);await sharp(Buffer.from(svg)).png().toFile(dir+'/DevMatch_AI_Website_ER_Diagram_Styled.png');
