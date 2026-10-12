import fs from 'node:fs/promises';
import sharp from 'file:///C:/Users/gurra/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/dist/index.mjs';
const W=4200,H=3360,green='#14651A';
const nodes={
 user:[2100,360,'USER',['id','name','role']],
 developer:[1100,1000,'DEVELOPER PROFILE',['id','bio','location']],
 recruiter:[3300,1000,'RECRUITER PROFILE',['id','company_name','website']],
 skill:[550,1680,'SKILL',['id','name','level']],
 project:[1650,1680,'PROJECT',['id','name','github_link']],
 job:[3300,1680,'JOB',['id','title','location']],
 resume:[550,2380,'RESUME ANALYSIS',['id','summary','strengths']],
 application:[2250,2380,'APPLICATION',['id','status','created_at']],
 jobskill:[3650,2380,'JOB SKILL',['id','name','importance']],
 technology:[1400,3030,'PROJECT TECHNOLOGY',['id','name','version']],
 history:[2550,3030,'STATUS HISTORY',['id','old_status','new_status']]
};
const out=[];const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;');
const line=(pts)=>out.push(`<polyline points="${pts.map(p=>p.join(',')).join(' ')}" fill="none" stroke="#242424" stroke-width="3"/>`);
const text=(x,y,s,size=32,weight=400,underline=false)=>out.push(`<text x="${x}" y="${y}" font-family="Arial, sans-serif" font-size="${size}" font-weight="${weight}" fill="${green}" text-anchor="middle" dominant-baseline="middle"${underline?' text-decoration="underline"':''}>${esc(s)}</text>`);
function rel(label,x,y,p1,p2,c1,c2){line(p1);line(p2);out.push(`<polygon points="${x},${y-68} ${x+135},${y} ${x},${y+68} ${x-135},${y}" fill="white" stroke="#242424" stroke-width="3"/>`);text(x,y,label,31);text(c1[0],c1[1],c1[2],29);text(c2[0],c2[1],c2[2],29);}
out.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Chen ER diagram for DevMatch AI"><rect width="100%" height="100%" fill="white"/>`);
text(2100,82,'DEVMATCH AI — ENTITY RELATIONSHIP DIAGRAM',58,700);
text(2100,144,'Chen notation: entities, relationships and selected attributes',30);
rel('Owns',1340,660,[[1940,405],[1940,660],[1475,660]],[[1205,660],[940,660],[940,955]],[1840,624,'1'],[887,899,'0..1']);
rel('Owns',2860,660,[[2260,405],[2260,660],[2725,660]],[[2995,660],[3140,660],[3140,955]],[2360,624,'1'],[3090,899,'0..1']);
rel('Has',660,1320,[[940,1045],[940,1320],[795,1320]],[[525,1320],[390,1320],[390,1635]],[988,1170,'1'],[338,1568,'0..N']);
rel('Showcases',1520,1320,[[1260,1045],[1260,1320],[1385,1320]],[[1655,1320],[1810,1320],[1810,1635]],[1204,1170,'1'],[1870,1568,'0..N']);
rel('Posts',3300,1330,[[3460,1045],[3460,1200],[3300,1200],[3300,1262]],[[3300,1398],[3300,1470],[3460,1470],[3460,1635]],[3514,1135,'1'],[3520,1568,'0..N']);
rel('Receives',190,2010,[[1100,1045],[1100,1130],[25,1130],[25,2010],[55,2010]],[[325,2010],[390,2010],[390,2335]],[170,1180,'1'],[336,2280,'0..N']);
rel('Submits',2250,1710,[[1100,1045],[1100,1170],[2250,1170],[2250,1642]],[[2250,1778],[2250,2160],[2090,2160],[2090,2335]],[2180,1220,'1'],[2030,2278,'0..N']);
rel('Receives',2790,2030,[[3140,1725],[3140,2030],[2925,2030]],[[2655,2030],[2410,2030],[2410,2335]],[3090,1840,'1'],[2470,2278,'0..N']);
rel('Requires',3670,2030,[[3460,1725],[3460,1920],[3670,1920],[3670,1962]],[[3670,2098],[3670,2200],[3810,2200],[3810,2335]],[3514,1840,'1'],[3870,2278,'0..N']);
rel('Uses',1490,2670,[[1650,1725],[1650,2530],[1490,2530],[1490,2602]],[[1490,2738],[1490,2820],[1560,2820],[1560,2985]],[1710,2490,'1'],[1614,2920,'0..N']);
rel('Records',2460,2690,[[2410,2425],[2410,2550],[2460,2550],[2460,2622]],[[2460,2758],[2460,2835],[2710,2835],[2710,2985]],[2350,2500,'1'],[2770,2920,'0..N']);
for(const [x,y,label,attrs] of Object.values(nodes)){
 const pos=[[x,y-155],[x-340,y],[x+340,y]];
 for(let i=0;i<3;i++){const [ax,ay]=pos[i];line([[x,y],[ax,ay]]);out.push(`<ellipse cx="${ax}" cy="${ay}" rx="128" ry="44" fill="white" stroke="#242424" stroke-width="2.6"/>`);text(ax,ay,attrs[i],30,400,i===0);}
 out.push(`<rect x="${x-212}" y="${y-45}" width="424" height="90" fill="white" stroke="#242424" stroke-width="3.2"/>`);text(x,y,label,31,700);
}
text(2100,3220,'Underlined attribute = primary key     0..1 = optional one     0..N = zero or many',30);
text(2100,3280,'Applications resolve the developer–job many-to-many relationship. Status history is the SQL audit extension.',29);
out.push('</svg>');
const dir='D:/DBMS_DevApp/output/diagrams';await fs.mkdir(dir,{recursive:true});const svg=out.join('\n');await fs.writeFile(dir+'/DevMatch_AI_Chen_ER_Diagram.svg',svg);await sharp(Buffer.from(svg)).png().toFile(dir+'/DevMatch_AI_Chen_ER_Diagram.png');
