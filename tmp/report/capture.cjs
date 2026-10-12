const {chromium}=require('C:/Users/gurra/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1.3});
 const root='http://127.0.0.1:5000';
 const save=async(name,path)=>{await page.goto(root+path);await page.screenshot({path:'D:/DBMS_DevApp/tmp/report/'+name+'.png',fullPage:false});console.log(name,await page.title());};
 await save('home','/'); await save('jobs','/jobs'); await save('dbms','/dbms-demo');
 await page.goto(root+'/login');await page.locator('[name=email]').fill('dev1@example.com');await page.locator('[name=password]').fill('DemoPass123!');await Promise.all([page.waitForURL('**/dashboard'),page.locator('button.full').click()]);
 await save('developer','/dashboard');await save('match','/jobs');
 await page.goto(root+'/logout');await page.goto(root+'/login');await page.locator('[name=email]').fill('recruiter1@example.com');await page.locator('[name=password]').fill('DemoPass123!');await Promise.all([page.waitForURL('**/dashboard'),page.locator('button.full').click()]);
 await save('recruiter','/dashboard');
 await page.locator('#applicants').scrollIntoViewIfNeeded().catch(()=>{});await page.screenshot({path:'D:/DBMS_DevApp/tmp/report/applicants.png'});
 await browser.close();
})().catch(e=>{console.error(e.message);process.exit(1)});

