'use strict';
const $ = id => document.getElementById(id);
const esc = value => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
const today = () => new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Shanghai'}).format(new Date());
const add = (day,n) => new Date(Date.parse(day)+n*86400000).toISOString().slice(0,10);
const weekday = day => new Date(day).getUTCDay();
const minutes = s => {const [h,m]=s.split(':').map(Number); return h*60+m};
const clock = min => Math.floor(min/60).toString().padStart(2,'0')+':'+(min%60).toString().padStart(2,'0');
const previousCppTopics = 'TD Ex22、TD Ex23、TD Ex24、TD Ex25、TD Ex26、TD Ex28、TD Ex29、TD Ex30、TD Ex31、TD Ex32、TD Ex34、TD Ex35、TD Ex36、TD Ex37、A24t Ex70、A24t Ex71'.split('、');
const cppTopics = [
 ...Array.from({length:18},(_,i)=>'TD Ex'+(22+i)),
 ...Array.from({length:11},(_,i)=>'A24t Ex'+(70+i))
];
const courses = {
 '数据结构':['期末 70% · 考试方式待确认','基本概念、顺序表、链表、线性表应用、栈、队列、栈队列应用、串、模式匹配、数组、矩阵与广义表、树基础、二叉树、遍历、树与森林、图存储、图遍历、查找、插入排序、交换与选择排序、归并基数与比较'],
 'C++':['期中 30% · 期末 40%（开卷）· 项目 30%',cppTopics.join('、')],
 '项目管理':['期末 30% · 项目 40% · 考试方式待确认',Array.from({length:16},(_,i)=>'第 '+(i+1)+' 周课件').join('、')],
 'Internet':['期末 50%（闭卷）· 平时 50%',Array.from({length:6},(_,i)=>'讲义第 '+(i+1)+' 章').join('、')],
 '智能文明':['期末 50%（开卷）· 第 16 周随堂考 · 手机规则待确认',Array.from({length:8},(_,i)=>'第 '+(i+1)+' 章').join('、')]
};
const projectList = [
 ['internet1','Internet','动态网站','2026-12-14','2026-12-20','暂定，具体时刻待确认','2026-12-15','2026-12-19','确认要求、搭建网站、核心功能、测试与文档、提交'],
 ['internet2','Internet','应用开发作业二','2026-12-14','','期末开考前，日期待确认','2026-12-15','2026-12-19','选择方向、搭建框架、实现功能、测试与文档、提交'],
 ['management','项目管理','课程项目汇报','2026-12-24','2026-12-30','暂定早八','2026-12-25','2026-12-29','等待素材、制作PPT、PPT确认、制作视频、检查排练、汇报'],
 ['cpp','C++','算法项目','','','具体日期待确认','','','项目代码、材料初稿、材料检查']
];
function applyCppTaskPlan(tasks){
 const matches = (task,base) => task && task.pct===0 && !task.fixed &&
  task.course===base.course && task.date===base.date && task.minutes===base.minutes &&
  task.title===base.title && task.detail===base.detail;
 const internet=tasks.find(t=>t.id==='2026-12-25');
 const cpp=tasks.find(t=>t.id==='2027-01-03');
 const internetBase=seed.find(t=>t.id==='2026-12-25');
 const cppBase=seed.find(t=>t.id==='2027-01-03');
 const [oldTitle,oldDetail]=previousCppTaskPlan[cppBase.id];
 if(matches(internet,internetBase)&&(matches(cpp,cppBase)||matches(cpp,{...cppBase,title:oldTitle,detail:oldDetail}))){
  [internet.date,cpp.date]=[cpp.date,internet.date];
 }
 const presentationDay=tasks.find(t=>t.id==='2026-12-30');
 const presentationBase=seed.find(t=>t.id==='2026-12-30');
 if(matches(presentationDay,presentationBase)){
  Object.assign(presentationDay,{
   course:'C++',minutes:120,title:'A24t Ex76–78',
   detail:'项目管理汇报仍暂定早八。汇报后留出休息，下午或晚些时候再做三题的核心小问。'
  });
 }
 for(const original of seed){
  const revision=cppTaskPlan[original.id];
  if(!revision)continue;
  const task=tasks.find(t=>t.id===original.id);
  if(!task||task.pct!==0)continue;
  const previous=previousCppTaskPlan[original.id];
  const originalText=task.title===original.title&&task.detail===original.detail;
  const previousText=task.title===previous[0]&&task.detail===previous[1];
  if(!originalText&&!previousText)continue;
  if(task.id===cppBase.id&&task.date!=='2026-12-25'){
   [task.title,task.detail]=['C++ 考前复盘','回看已做的综合题、错题和 cours 索引。若已考完，按最近一门考试调整。'];
  }else{
   [task.title,task.detail]=revision;
  }
 }
 applyA24tSessions(tasks);
 return tasks;
}
function applyA24tSessions(tasks){
 const sessions=[
  ['2026-12-19','A24t Ex70–72',70],
  ['2027-01-03','A24t Ex73–75',72],
  ['2026-12-30','A24t Ex76–78',74],
  ['2026-12-31','A24t Ex79–80',75]
 ];
 for(const [id,oldTitle,exercise] of sessions){
  const task=tasks.find(t=>t.id===id);
  if(!task||task.pct!==0||task.title!==oldTitle)continue;
  const previousDetail=cppTaskPlan[id]?.[1]||
   '项目管理汇报仍暂定早八。汇报后留出休息，下午或晚些时候再做三题的核心小问。';
  if(task.detail!==previousDetail)continue;
  task.title='A24t Ex'+exercise+' · 单题练习';
  task.detail='按当天预算只做这一题，记录做到哪一问。超时就留待续做。'+
   (id==='2026-12-30'?'项目管理汇报仍暂定早八，汇报后先休息。':'');
  task.a24t=true;
 }
 for(const [date,exercise] of [['2026-12-21',71],['2026-12-26',73]]){
  const id='a24t-ex'+exercise;
  if(tasks.some(t=>t.id===id))continue;
  const primary=tasks.find(t=>t.id===date);
  const used=tasks.filter(t=>t.date===date).reduce((sum,t)=>sum+remaining(t),0);
  const available=state?.tasks===tasks?capacity(date):180;
  if(primary?.date!==date||used+60>available||tasks.some(t=>t.date===date&&t.a24t))continue;
  tasks.push({id,date,original:date,course:'C++',round:2,pct:0,minutes:60,
   title:'A24t Ex'+exercise+' · 起步',
   detail:'先完成当天的数据结构。如果还有 60 分钟，就读题、列思路、开始一个小问，到点停。后续小问留待续做。',
   supplemental:true,a24t:true});
 }
}
const defaults = () => ({
 tasks:applyCppTaskPlan(structuredClone(seed)), events:[...Object.keys(courses).map(course=>({id:course,course,title:course+'期末考试',status:'待确认'})),{id:'civil-talk',course:'智能文明',title:'智能文明汇报（晚间第三节）',date:'2026-11-30',status:'暂定'}],
 classes:[], resources:[], projects:Object.fromEntries(projectList.map(([id,course,title,target,deadline,status,start,end,phases])=>[id,{id,course,title,target,deadline,status,start,end,phases:phases.split('、'),completed:id==='cpp'?['项目代码']:[],waiting:false}])),
 history:[], logs:[], topics:{}, caps:{normal:180,thursday:90,sunday:120}, gaps:[]
});
const db = new Promise((resolve,reject)=>{
 const request=indexedDB.open('finals-planner-v1',1);
 request.onupgradeneeded=()=>request.result.createObjectStore('data');
 request.onsuccess=()=>resolve(request.result);
 request.onerror=()=>reject(request.error);
});
async function storage(mode,value){
 const conn=await db;
 return new Promise((resolve,reject)=>{
  const transaction=conn.transaction('data',mode);
  const store=transaction.objectStore('data');
  const request=mode==='readwrite'?store.put(value,'state'):store.get('state');
  transaction.oncomplete=()=>resolve(request.result);
  transaction.onerror=()=>reject(transaction.error);
  transaction.onabort=()=>reject(transaction.error);
 });
}
let state, page='今天', focusDay=today(), month=focusDay.slice(0,7), selected='数据结构', demo=false;
function notify(text){$('toast').textContent=text;clearTimeout(notify.timer);notify.timer=setTimeout(()=>$('toast').textContent='',3200)}
async function update(work){
 const previous=structuredClone(state);
 try{work();if(!demo) await storage('readwrite',state);render();}
 catch(error){state=previous;render();throw error;}
}
function remaining(task){return Math.ceil(task.minutes*(100-task.pct)/100)}
function limit(day){return weekday(day)===4?state.caps.thursday:weekday(day)===0?state.caps.sunday:state.caps.normal}
function windows(day){
 let blocks=state.classes.filter(x=>x.date===day||(!x.date&&Number(x.weekday)===weekday(day)));
 blocks=blocks.concat(state.events.filter(x=>x.date===day&&x.start&&x.end),Object.values(state.projects).filter(x=>x.deadline===day&&x.eventStart&&x.eventEnd).map(x=>({start:x.eventStart,end:x.eventEnd})));
 const free=[];
 let at=660;
 const end=weekday(day)===0?1080:1290;
 for(const block of blocks.sort((a,b)=>minutes(a.start)-minutes(b.start))){
  const start=Math.min(end,minutes(block.start));
  if(start>at)free.push([at,start]);
  at=Math.max(at,minutes(block.end));
 }
 if(at<end)free.push([at,end]);
 return free;
}
function capacity(day){return Math.min(limit(day),windows(day).reduce((sum,[a,b])=>sum+Math.floor((b-a)*.8),0))}
function protectedDay(project,day){return Boolean(project?.start&&project?.end&&day>=project.start&&day<=project.end)}
function plan(from,reason,forced=[],allowBuffer=false){
 const before=Object.fromEntries(state.tasks.map(t=>[t.id,t.date]));
 const movable=state.tasks.filter(t=>t.pct<100&&!t.fixed&&(forced.includes(t.id)||!t.date||t.date<from));
 const movableIds=new Set(movable.map(t=>t.id));
 const occupied={};
 const bucket=d=>occupied[d]??={load:0,main:new Set()};
 const reserve=(t,d)=>{const b=bucket(d);b.load+=remaining(t);if(!t.project&&!t.supplemental)b.main.add(t.course);if(t.a24t)b.a24t=true};
 for(const task of state.tasks) if(!movableIds.has(task.id)&&task.date){
  if(task.pct<100)reserve(task,task.date);
  else if(task.a24t)bucket(task.date).a24t=true;
 }
 const deadline=t=>{const p=state.projects[t.project];return (p?.status==='已确认'&&p.deadline)||state.events.find(e=>e.course===t.course&&e.title.endsWith('期末考试')&&e.status==='已确认')?.date||null};
 const gaps=[];
 movable.sort((a,b)=>(deadline(a)||'9999').localeCompare(deadline(b)||'9999')||(b.priority||0)-(a.priority||0)||a.original.localeCompare(b.original));
 for(const t of movable){
  const project=state.projects[t.project];
  const cutoff=deadline(t);
  const horizon=add(from,51);
  const last=cutoff&&cutoff<horizon?add(cutoff,-1):horizon;
  const earliest=(t.earliest&&t.earliest>from)?t.earliest:from;
  let next='',max=0,bufferFit=false;
  if(!project?.waiting&&!t.waiting){
   for(let d=earliest;d<=last;d=add(d,1)){
    const slot=bucket(d);
    if(t.a24t&&slot.a24t)continue;
    if(t.supplemental&&d!==t.original)continue;
    if(!t.project&&!t.supplemental&&slot.main.size&&!slot.main.has(t.course))continue;
    const free=Math.max(0,capacity(d)-slot.load);
    if(protectedDay(project,d)&&!allowBuffer){bufferFit ||= free>=remaining(t);continue}
    max=Math.max(max,free);
    if(free>=remaining(t)){next=d;break}
   }
  }
  t.date=next;
  if(next)reserve(t,next);
  else gaps.push({id:t.id,title:t.title,reason:project?.waiting||t.waiting?'正在等待材料':bufferFit?'项目缓冲内有空位，可显式启用缓冲':cutoff?'已确认节点前没有足够的连续日容量':'未来 52 天内没有合适的学习日',missing:project?.waiting||t.waiting?null:Math.max(0,remaining(t)-max)});
 }
 const changes=state.tasks.filter(t=>before[t.id]!==t.date).map(t=>({id:t.id,title:t.title,from:before[t.id],to:t.date,buffer:protectedDay(state.projects[t.project],t.date)}));
 state.gaps=gaps;
 if(changes.length)state.history.unshift({at:new Date().toISOString(),reason,changes});
}
const list=(arr,fn,empty='暂无记录')=>arr.length?arr.map(fn).join(''):'<p class="muted">'+esc(empty)+'</p>';
const btn=(label,action,id='',style='')=>'<button type="button" class="'+style+'" data-action="'+action+'" data-id="'+esc(id)+'">'+esc(label)+'</button>';
function taskCard(t){return '<article class="task"><span class="pill">'+esc(t.course)+(t.project?' · 项目':t.supplemental?' · 加练':'')+'</span><h3>'+esc(t.title)+'</h3><small>'+esc(t.date||'待安排')+' · '+(t.pct===100?'已完成':'剩余 '+remaining(t)+' 分钟 · '+Math.round(t.pct)+'%')+(t.fixed?' · 已固定':'')+'</small><details><summary>任务说明</summary>'+esc(t.detail)+'</details><div class="actions">'+btn('记录进度','edit',t.id)+ (t.pct<100&&!t.fixed?btn('延期','delay',t.id):'')+'</div></article>'}
function eventsCard(){
 const nodes=[...state.events,...Object.values(state.projects).map(p=>({title:p.title,date:p.deadline,status:p.status,id:p.id,project:true}))];
 return '<section class="card"><h2>重要节点</h2>'+list(nodes,n=>'<div class="task"><strong>'+esc(n.title)+'</strong><br><small>'+esc(n.date||'日期待确认')+' · '+esc(n.status)+(n.date&&n.status==='已确认'?' · '+Math.round((Date.parse(n.date)-Date.parse(today()))/86400000)+' 天':'')+'</small> '+btn('编辑',n.project?'project':'event',n.id)+'</div>')+'</section>';
}
function progressCard(){
 return '<section class="card"><h2>课程进度</h2>'+Object.keys(courses).map(c=>'<div class="task">'+btn(c,'course',c)+[1,2].map(round=>{const ts=state.tasks.filter(t=>t.course===c&&!t.project&&t.round===round);const completed=ts.filter(t=>t.pct===100).length;return '<div><small>第 '+round+' 轮 · '+completed+'/'+ts.length+'</small><progress aria-label="'+c+'第'+round+'轮" value="'+completed+'" max="'+(ts.length||1)+'"></progress></div>'}).join('')+'</div>').join('')+'</section>';
}
function dayPanel(day){
 const ts=state.tasks.filter(t=>t.date===day);
 const total=ts.reduce((sum,t)=>sum+remaining(t),0);
 const block=state.classes.filter(x=>x.date===day||(!x.date&&Number(x.weekday)===weekday(day)));
 const free=windows(day);
 return '<section class="card"><div class="row"><h2>'+esc(day)+' 学习清单</h2>'+btn('新增任务','new',day,'primary')+'</div><p class="'+(total>capacity(day)?'warn':'muted')+'">剩余 '+total+' 分钟 · 日容量 '+capacity(day)+' 分钟'+(total>capacity(day)?' · 超出 '+(total-capacity(day))+' 分钟，可拆分或移到同课程日':'')+'</p><p class="muted">可学习时段 '+(free.map(([a,b])=>clock(a)+'–'+clock(b)).join('、')||'无')+(block.length?'':' · 当天无已录入课程')+'</p>'+list(ts,taskCard,'当天暂时没有计划，可以休息或添加任务。')+'</section>';
}
function gapCard(){
 return state.gaps.length?'<section class="card"><h2>需要确认的安排</h2>'+list(state.gaps,g=>'<div class="task"><div class="warn">'+esc(g.title)+' · '+esc(g.reason)+(g.missing===null?'':' · 单日差 '+g.missing+' 分钟')+'</div>'+btn('调整或拆分','edit',g.id)+'</div>')+'</section>':'';
}
function calendar(){
 const first=month+'-01', offset=(weekday(first)+6)%7;
 const days=Array.from({length:31},(_,i)=>add(first,i)).filter(d=>d.startsWith(month));
 return '<section class="card"><div class="row">'+btn('上月','month','-1')+'<h2>'+month+'</h2>'+btn('下月','month','1')+'</div><div class="calendar">'+['一','二','三','四','五','六','日'].map(x=>'<span class="weekday">'+x+'</span>').join('')+'<span></span>'.repeat(offset)+days.map(d=>btn(d.slice(-2)+(state.tasks.some(t=>t.date===d)?' ·':''),'day',d,d===focusDay?'active':'')).join('')+'</div></section>'+dayPanel(focusDay);
}
function topicKey(course,name,index){
 if(course!=='C++')return course+'|'+index;
 // Existing exercises keep their original storage keys so saved notes still match.
 const previousIndex=previousCppTopics.indexOf(name);
 return course+'|'+(previousIndex<0?name:previousIndex);
}
function courseView(){
 const topics=courses[selected][1].split('、');
 return '<div class="row">'+Object.keys(courses).map(c=>btn(c,'course',c,c===selected?'active':'')).join('')+'</div><div class="grid"><div><section class="card"><h2>'+selected+'</h2><p>'+courses[selected][0]+'</p><p>'+esc(state.events.find(e=>e.id===selected)?.date||'考试日期待确认')+'</p>'+btn('编辑考试','event',selected)+'</section><section class="card"><h2>学习目录</h2>'+(selected==='C++'?'<p class="muted">默认安排中，A24t Ex76–80 待定。先给已开始的难题留续做时间。</p>':'')+topics.map((name,i)=>{const key=topicKey(selected,name,i);const t=state.topics[key];return '<div class="task">'+esc(name)+' <small>'+esc(t?.status|| (selected==='C++'&&i<2?'已学':selected==='项目管理'&&i>=10?'待上传':'未开始'))+'</small> '+btn('记录','topic',key)+(t?.note?'<div class="muted">'+esc(t.note)+'</div>':'')+'</div>'}).join('')+'</section></div><div>'+resourceCard(selected)+'<section class="card"><h2>课程任务</h2>'+btn('新增任务','new',focusDay)+list(state.tasks.filter(t=>t.course===selected),taskCard)+'</section></div></div>';
}
function resourceCard(course){
 return '<section class="card"><h2>资料</h2>'+btn('添加文件或链接','resource',course)+' '+list(state.resources.filter(r=>!course||course===r.course),r=>'<div class="task"><span class="pill">'+esc(r.course)+'</span> '+esc(r.name)+' '+btn('打开','open',r.id)+(r.note?'<p class="muted">'+esc(r.note)+'</p>':'')+'</div>','还没有添加资料')+'</section>';
}
function projects(){
 return '<div class="grid">'+Object.values(state.projects).map(p=>{
  const used=new Set(state.tasks.filter(t=>t.project===p.id&&protectedDay(p,t.date)).map(t=>t.date)).size;
  const length=p.start&&p.end?Math.round((Date.parse(p.end)-Date.parse(p.start))/86400000)+1:0;
  return '<section class="card"><span class="pill">'+esc(p.course)+'</span><h2>'+esc(p.title)+'</h2><p>个人目标 '+esc(p.target||'待确认')+'<br>老师节点 '+esc(p.deadline||'待确认')+' · '+esc(p.status)+'</p><p>缓冲 '+(length?esc(p.start+' 至 '+p.end)+' · 已安排 '+used+' 天、剩余 '+(length-used)+' 天':'待设置')+'</p>'+(p.waiting?'<p class="warn">等待组员材料，相关未完成任务暂缓安排。</p>':'')+(p.course==='Internet'?'<p class="muted">提交前检查源代码、真实 Git 历史、README 和 AI_USAGE.md。公开仓库按要求交链接，非公开仓库交包含 .git 的压缩包。</p>':'')+p.phases.map(name=>'<div class="task">'+(p.completed.includes(name)?'✓ ':'')+esc(name)+'</div>').join('')+'<div class="actions">'+btn('编辑项目','project',p.id)+btn('新增项目任务','new-project',p.id)+'</div>'+list(state.tasks.filter(t=>t.project===p.id),taskCard,'暂无独立项目任务')+'</section>';
 }).join('')+'</div>';
}
function settings(){
 return '<section class="card"><h2>课表与学习容量</h2><p>所有时间均为北京时间。课表可按星期重复，也可录入单日活动。</p><div class="actions">'+btn('录入上课时段','class')+btn('调整每日容量','caps')+'</div>'+list(state.classes,c=>'<div class="task">'+esc(c.title)+' · '+esc(c.date||'每周'+['日','一','二','三','四','五','六'][c.weekday])+' · '+esc(c.start+'–'+c.end)+' '+btn('编辑','class',c.id)+'</div>','尚无正式课表，请录入上课时间')+'</section><section class="card"><h2>保存与备份</h2><p>数据和文件保存在当前浏览器的 IndexedDB。换设备或清除站点数据前，请导出备份。</p><div class="actions">'+btn('导出备份','backup')+btn('恢复备份','restore')+btn('体验 C++ 半完成示例','demo')+'</div></section>';
}
function history(){
 return '<section class="card"><h2>计划调整记录</h2>'+btn('检查并安排待处理任务','arrange')+' '+btn('启用本次项目缓冲','buffer')+' '+btn('撤销最近一次移动','undo')+list(state.history,h=>'<div class="task"><strong>'+esc(h.reason)+'</strong> · <small>'+esc(new Date(h.at).toLocaleString('zh-CN',{timeZone:'Asia/Shanghai'}))+'</small>'+h.changes.map(c=>'<div>'+esc(c.title)+'：'+esc(c.from||'待安排')+' → '+esc(c.to||'待安排')+(c.buffer?'（使用项目缓冲）':'')+'</div>').join('')+'</div>')+'</section>'+gapCard()+'<section class="card"><h2>学习记录</h2>'+list(state.logs,l=>'<div class="task">'+esc(l.day+' · '+l.title+' · '+l.pct+'% · '+l.actual+' 分钟 · '+l.level+' · '+l.note)+'</div>')+'</section>';
}
function render(){
 $('nav').innerHTML=['今天','日历','课程','项目','资料','调整记录','设置'].map(name=>btn(name,'page',name,page===name?'active':'')).join('');
 const day=demo?'2026-11-28':today();
 const week=12+Math.floor((Date.parse(day)-Date.parse('2026-11-30'))/604800000);
 const main=state.tasks.find(t=>t.date===day&&!t.project&&!t.supplemental)?.course;
 const views={今天:()=>'<section class="hero"><p>'+day+'　·　第 '+week+' 周（北京时间）</p><h1>今天做什么</h1><p>'+(main?'主要复习 · '+esc(main):'今天暂未安排主课')+'。学习 25–40 分钟后休息 5–10 分钟。</p></section><div class="grid"><div>'+dayPanel(day)+gapCard()+'<section class="card"><h2>进行中的项目</h2>'+list(Object.values(state.projects).filter(p=>p.completed.length<p.phases.length),p=>btn(p.title,'project',p.id))+'</section></div><div>'+progressCard()+eventsCard()+'</div></div>',日历:calendar,课程:courseView,项目:projects,资料:()=>resourceCard(''),调整记录:history,设置:settings};
 $('app').innerHTML=(demo?'<p class="warn">演示模式 · 操作不会写入你的实际进度。 '+btn('退出演示','exit-demo')+'</p>':'')+views[page]();
}
const field=(label,name,value='',type='text',attrs='')=>'<label>'+label+'<input name="'+name+'" type="'+type+'" value="'+esc(value)+'" '+attrs+'></label>';
const select=(label,name,options,value)=>'<label>'+label+'<select name="'+name+'">'+options.map(o=>'<option '+(o===value?'selected':'')+'>'+esc(o)+'</option>').join('')+'</select></label>';
const note=(label,name,value='')=>'<label>'+label+'<textarea name="'+name+'">'+esc(value)+'</textarea></label>';
const check=(label,name,value)=>'<label class="check"><input type="checkbox" name="'+name+'" '+(value?'checked':'')+'>'+esc(label)+'</label>';
function dialog(title,content,save){
 const modal=$('modal');
 modal.innerHTML='<h2>'+esc(title)+'</h2><form>'+content+'<p id="form-error" role="alert"></p><div class="actions"><button class="primary">保存</button><button type="button" id="cancel">取消</button></div></form>';
 $('cancel').onclick=()=>modal.close();
 modal.querySelector('form').onsubmit=async e=>{
  e.preventDefault();
  try{await save(new FormData(e.target));modal.close();}
  catch(error){$('form-error').textContent=error.message}
 };
 if(!modal.open)modal.showModal();
}
const id=()=>crypto.randomUUID();
const current=()=>demo?'2026-11-28':today();
function editTask(t,day,project){
 const p=state.projects[project||t?.project];
 const v=t||{course:p?.course||selected,date:day,title:'',minutes:60,pct:0,round:1,project};
 dialog(t?'更新任务':'新增任务',
  field('任务名称','title',v.title,'text','required')+select('课程','course',[...Object.keys(courses),'最近考试课程'],v.course)+select('复习轮次','round',['1','2'],String(v.round))+field('计划日期','date',v.date,'date')+field('预计总时长（分钟）','minutes',v.minutes,'number','min="5" max="720" required')+field('完成百分比','pct',v.pct,'number','min="0" max="100" required')+field('本次实际学习（分钟）','actual',0,'number','min="0" max="1440"')+select('理解程度','level',['未记录','需重做','大致理解','能独立完成'],'未记录')+select('优先级','priority',['普通','优先'],v.priority?'优先':'普通')+note('任务说明','detail',v.detail)+note('进度、问题或延期原因','note')+check('固定在所选日期','fixed',v.fixed)+check('等待材料','waiting',v.waiting)+(t?field('拆出多少剩余分钟（可留空）','split','','number','min="5"'):''),
  f=>{
   const data=Object.fromEntries(f);
   const n=Number(data.minutes), pct=Number(data.pct), split=Number(data.split||0);
   const pinned=Boolean(data.fixed);
   if(pinned&&!data.date)throw Error('固定任务需要指定日期。');
   if(split>=Math.ceil(n*(100-pct)/100)&&split)throw Error('拆出的时长须小于全部剩余时长。');
   if(pinned&&split)throw Error('请先取消固定，再拆分任务。');
   return update(()=>{
    const task=t||{id:id(),original:data.date||current(),project};
    const oldDate=task.date;
    Object.assign(task,{title:data.title,course:p?.course||data.course,date:data.date,minutes:n,pct,round:Number(data.round),detail:data.detail,fixed:pinned,waiting:Boolean(data.waiting),priority:data.priority==='优先'?1:0});
    if(!t)state.tasks.push(task);
    if(t&&oldDate!==task.date)state.history.unshift({at:new Date().toISOString(),reason:'手动更改日期',changes:[{id:task.id,title:task.title,from:oldDate,to:task.date}]});
    if(t||pct||data.note||Number(data.actual))state.logs.unshift({day:current(),title:task.title,pct,actual:Number(data.actual),level:data.level,note:data.note});
    const force=[];
    if(split){
     const chunk={...task,id:id(),title:task.title+'（拆分）',minutes:split,pct:0,date:'',earliest:add(current(),1)};
     const done=n*pct/100;
     task.minutes=n-split;
     task.pct=100*done/task.minutes;
     state.tasks.push(chunk);
     force.push(chunk.id);
    }
    if(pct>0&&pct<100&&!pinned&&(!data.date||data.date<=current())){
     task.earliest=add(current(),1);
     force.push(task.id);
    }
    if(!pinned&&(task.waiting||!data.date))force.push(task.id);
    plan(current(),data.note||'保存任务，检查可用容量',force);
   });
  });
}
function editEvent(e){
 dialog(e.title,field('日期','date',e.date,'date')+select('状态','status',['待确认','暂定','已确认'],e.status)+field('开始时间','start',e.start,'time')+field('结束时间','end',e.end,'time'),f=>{
  const v=Object.fromEntries(f);
  if(v.status==='已确认'&&!v.date)throw Error('请填写已确认日期。');
  if((v.start||v.end)&&(!v.date||!v.start||!v.end||v.start>=v.end))throw Error('请填写日期和有效的起止时间。');
  return update(()=>Object.assign(e,v));
 });
}
function editProject(p){
 dialog(p.title,field('个人目标日','target',p.target,'date')+field('老师截止日 / 汇报日','deadline',p.deadline,'date')+select('确认状态','status',[...new Set([p.status,'待确认','暂定','已确认'])],p.status)+field('开始时间（可选）','eventStart',p.eventStart,'time')+field('结束时间（可选）','eventEnd',p.eventEnd,'time')+field('缓冲起始','start',p.start,'date')+field('缓冲结束','end',p.end,'date')+check('等待组员材料','waiting',p.waiting)+p.phases.map((name,i)=>check('完成 · '+name,'phase'+i,p.completed.includes(name))).join(''),f=>{
  const {target,deadline,status,start,end,eventStart,eventEnd}=Object.fromEntries(f);
  if(status==='已确认'&&!deadline)throw Error('请填写已确认日期。');
  if((start||end)&&(!start||!end||start>end))throw Error('请填写有效的缓冲日期。');
  if((eventStart||eventEnd)&&(!deadline||!eventStart||!eventEnd||eventStart>=eventEnd))throw Error('请填写有效的节点起止时间。');
  const completed=p.phases.filter((_,i)=>f.has('phase'+i));
  if(p.id==='management'&&completed.includes('制作视频')&&!completed.includes('PPT确认'))throw Error('请先完成 PPT 确认。');
  return update(()=>{
   const waiting=f.has('waiting'), changed=waiting!==p.waiting;
   Object.assign(p,{target,deadline,status,start,end,eventStart,eventEnd,completed,waiting});
   if(changed)plan(current(),waiting?'等待组员材料':'组员材料已可用',state.tasks.filter(t=>t.project===p.id).map(t=>t.id));
  });
 });
}
function editClass(c){
 dialog('课表 / 固定活动',field('名称','title',c.title,'text','required')+select('每周重复（单日日期优先）','weekday',['周日','周一','周二','周三','周四','周五','周六'],['周日','周一','周二','周三','周四','周五','周六'][c.weekday||0])+field('单日日期','date',c.date,'date')+field('开始','start',c.start,'time','required')+field('结束','end',c.end,'time','required'),f=>{
  const v=Object.fromEntries(f);
  if(v.start>=v.end)throw Error('结束时间应晚于开始时间。');
  return update(()=>{
   Object.assign(c,v,{weekday:['周日','周一','周二','周三','周四','周五','周六'].indexOf(v.weekday)});
   if(!state.classes.some(x=>x.id===c.id))state.classes.push(c);
  });
 });
}
function attach(course){
 dialog('添加资料',select('课程','course',Object.keys(courses),course||selected)+field('显示名称','name')+field('网页链接（可选）','url','','url')+field('文件（可选）','file','','file')+note('分类说明或来源','note'),f=>{
  const v=Object.fromEntries(f);
  const blob=v.file.size?v.file:null;
  if(!blob&&!v.url)throw Error('请选择文件或填写链接。');
  if(v.url&&!['https:','http:'].includes(new URL(v.url).protocol))throw Error('仅支持 HTTP 和 HTTPS 链接。');
  return update(()=>state.resources.push({id:id(),course:v.course,name:v.name||blob?.name||v.url,url:v.url,note:v.note,blob}));
 });
}
function saveFile(blob,name){
 const url=URL.createObjectURL(blob);
 const a=document.createElement('a');a.href=url;a.download=name;a.click();
 setTimeout(()=>URL.revokeObjectURL(url),60000);
}
function asData(blob){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(reader.error);reader.readAsDataURL(blob)})}
async function backup(){
 const snap=structuredClone(state);
 for(const r of snap.resources)if(r.blob)r.blob=await asData(r.blob);
 saveFile(new Blob([JSON.stringify({version:1,state:snap})],{type:'application/json'}),'期末备考备份-'+today()+'.json');
}
async function restore(file){
 if(!file?.size)throw Error('请选择备份文件。');
 const {version,state:s}=JSON.parse(await file.text());
 if(version!==1||!s||!['tasks','resources','classes','events','history','logs','gaps'].every(k=>Array.isArray(s[k]))||!s.projects||!s.topics||!s.caps||!s.tasks.every(t=>typeof t.id==='string'&&typeof t.title==='string'&&Number.isFinite(t.minutes)&&Number.isFinite(t.pct)))throw Error('备份格式无效。');
 for(const r of s.resources)if(r.blob){
  const match=/^data:([^;,]*);base64,(.*)$/.exec(r.blob);
  if(!match)throw Error('备份中的附件格式无效。');
  r.blob=new Blob([Uint8Array.from(atob(match[2]),c=>c.charCodeAt(0))],{type:match[1]});
 }
 await update(()=>{state=s;applyCppTaskPlan(state.tasks)});
}
let savedSession;
document.addEventListener('click',async e=>{
 const b=e.target.closest('[data-action]');
 if(!b||!state)return;
 const {action,id:key}=b.dataset;
 const t=state.tasks.find(t=>t.id===key);
 try{
 switch(action){
 case 'page':page=key;render();break;
 case 'course':selected=key;page='课程';render();break;
 case 'month':{const d=new Date(month+'-01');d.setUTCMonth(d.getUTCMonth()+Number(key));month=d.toISOString().slice(0,7);render();break}
 case 'day':focusDay=key;render();break;
 case 'new':editTask(null,key);break;
 case 'new-project':editTask(null,current(),key);break;
 case 'edit':editTask(t);break;
 case 'event':editEvent(state.events.find(e=>e.id===key));break;
 case 'project':editProject(state.projects[key]);break;
 case 'class':editClass(state.classes.find(c=>c.id===key)||{id:id()});break;
 case 'resource':attach(key);break;
 case 'open':{
  const r=state.resources.find(r=>r.id===key);
  if(r.blob){
   if(r.blob.type==='application/pdf'||['image/png','image/jpeg','image/webp','image/gif'].includes(r.blob.type)){
    const url=URL.createObjectURL(r.blob);window.open(url,'_blank','noopener');setTimeout(()=>URL.revokeObjectURL(url),60000);
   }else saveFile(r.blob,r.name);
  }else if(/^https?:\/\//i.test(r.url))window.open(r.url,'_blank','noopener,noreferrer');
  break;
 }
 case 'topic':{
  const [c]=key.split('|'), value=state.topics[key];
  const i=courses[c][1].split('、').findIndex((name,index)=>topicKey(c,name,index)===key);
  const initial=c==='C++'&&Number(i)<2?'已学':c==='项目管理'&&Number(i)>=10?'待上传':'未开始';
  dialog(courses[c][1].split('、')[i],select('状态','status',['未开始','进行中','已学','需要重做','待上传'],value?.status||initial)+note('教材页码、题号、小问或难点','note',value?.note),f=>update(()=>{state.topics[key]=Object.fromEntries(f)}));
  break;
 }
 case 'caps':
  dialog('每日学习容量',Object.entries({normal:'平日',thursday:'周四',sunday:'周日'}).map(([k,label])=>field(label+'（分钟）',k,state.caps[k],'number','min="0" max="480" required')).join(''),f=>update(()=>{state.caps=Object.fromEntries([...f].map(([k,v])=>[k,Number(v)]))}));
  break;
 case 'delay':
  dialog('延期任务',field('最早可安排日期','day',add(current(),1),'date','required')+note('延期原因','reason'),f=>update(()=>{
   t.earliest=f.get('day');plan(current(),f.get('reason')||'延期 '+t.title,[key]);page='调整记录';
  }));break;
 case 'arrange':await update(()=>plan(current(),'检查待处理任务'));break;
 case 'buffer':
  dialog('本次允许使用项目缓冲','<p>仅待安排项目任务可以使用缓冲，实际占用会显示在项目和调整记录中。</p>',()=>update(()=>plan(current(),'允许本次使用项目缓冲',[],true)));break;
 case 'undo':await update(()=>{
  const h=state.history.shift();
  if(!h){notify('暂无可撤销的日期调整');return}
  for(const change of h.changes){const task=state.tasks.find(t=>t.id===change.id);if(task&&task.date===change.to){task.date=change.from;task.earliest='';}}
  state.gaps=state.gaps.filter(g=>!h.changes.some(c=>c.id===g.id&&c.from));
 });break;
 case 'backup':await backup();break;
 case 'restore':dialog('恢复备份','<p>恢复会替换当前浏览器中的记录和附件。可以先导出当前数据。</p>'+field('备份文件','file','','file','accept=".json" required'),f=>restore(f.get('file')));break;
 case 'demo':
  if(demo)break;
  savedSession={state,page,focusDay,month};demo=true;state=defaults();
  await update(()=>{
   const task=state.tasks.find(t=>t.id==='2026-11-28');
   task.pct=50;task.earliest='2026-11-29';
   state.logs.unshift({day:'2026-11-28',title:task.title,pct:50,actual:60,level:'大致理解',note:'示例：保留完成部分，重新安排剩余 60 分钟'});
   plan('2026-11-28','演示：11 月 28 日 C++ 完成一半',[task.id]);
   page='调整记录';
  });break;
 case 'exit-demo':({state,page,focusDay,month}=savedSession);demo=false;render();break;
 }
 }catch(error){notify(error.message)}
});
(async()=>{
 try{
  state=(await storage('readonly'))||defaults();
  await update(()=>{
   applyCppTaskPlan(state.tasks);
   if(state.tasks.some(t=>t.date&&t.date<today()&&!t.fixed&&t.pct<100))plan(today(),'打开网站，检查未完成的过期任务');
  });
 }catch(e){$('app').textContent='无法读取浏览器存储：'+e.message}
})();
