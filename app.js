<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>ToDo+ — Smart Reminder (MVP)</title>

  <!-- Material Icons -->
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

  <style>
    /* ====== Reset & base ====== */
    :root{
      --bg:#ffffff;
      --card:#ffffff;
      --muted:#6b7280;
      --accent:#007AFF;
      --accent-strong:#0066dd;
      --shadow: 0 6px 18px rgba(15,23,42,0.06);
      --radius-pill: 999px;
      --radius-card: 18px;
      --glass: rgba(255,255,255,0.6);
      color-scheme: light;
      font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
    }
    @media (prefers-color-scheme: dark){
      :root{
        --bg:#0b0c0e;
        --card:#0f1113;
        --muted:#9aa3b2;
        --accent:#007AFF;
        --accent-strong:#3390ff;
        --shadow: 0 8px 24px rgba(2,6,23,0.72);
      }
      html { color-scheme: dark; }
    }

    *{box-sizing:border-box}
    html,body{height:100%}
    body{
      margin:0;
      background: linear-gradient(180deg, var(--bg), var(--bg));
      display:flex;
      align-items:center;
      justify-content:center;
      padding:24px;
      -webkit-font-smoothing:antialiased;
      -moz-osx-font-smoothing:grayscale;
    }

    /* ====== Container ====== */
    .app {
      width:100%;
      max-width:760px;
      background:var(--card);
      border-radius:20px;
      box-shadow: var(--shadow);
      padding:28px;
      display:flex;
      flex-direction:column;
      gap:18px;
    }

    header{
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:12px;
    }
    .brand{
      display:flex;
      gap:12px;
      align-items:center;
    }
    .logo {
      width:46px;height:46px;border-radius:12px;
      background:linear-gradient(135deg,var(--accent),var(--accent-strong));
      display:flex;align-items:center;justify-content:center;color:white;font-weight:700;
      box-shadow: 0 6px 18px rgba(0,122,255,0.15);
      font-size:20px;
    }
    h1{margin:0;font-size:18px;letter-spacing:-0.2px}
    p.lead{margin:0;color:var(--muted);font-size:13px}

    /* ====== Input area (pill) ====== */
    .input-row{
      display:flex;
      gap:12px;
      align-items:center;
    }
    .input {
      flex:1;
      display:flex;
      gap:10px;
      align-items:center;
      background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0));
      padding:10px 14px;border-radius:var(--radius-pill);
      border:1px solid rgba(0,0,0,0.04);
    }
    @media (prefers-color-scheme: dark){
      .input { border:1px solid rgba(255,255,255,0.03); }
    }
    .input input{
      border:0;outline:none;background:transparent;font-size:15px;width:100%;
    }
    button.btn {
      background:var(--accent);color:white;border:0;padding:10px 14px;border-radius:12px;cursor:pointer;
      display:inline-flex;gap:8px;align-items:center;font-weight:600;
    }
    button.icon-btn{
      background:transparent;border:0;padding:8px;border-radius:10px;cursor:pointer;color:var(--muted)
    }

    /* ====== Lists ====== */
    .section-title{display:flex;align-items:center;justify-content:space-between}
    .cards{display:flex;flex-direction:column;gap:12px}
    .card{
      background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0));
      padding:12px 14px;border-radius:var(--radius-pill);display:flex;flex-direction:column;gap:6px;
      box-shadow:none;border:1px solid rgba(0,0,0,0.03);
    }
    @media (prefers-color-scheme: dark){
      .card{ border:1px solid rgba(255,255,255,0.02); }
    }
    .row{
      display:flex;align-items:center;justify-content:space-between;gap:12px;
    }
    .task-left{display:flex;align-items:center;gap:12px}
    .check{
      width:36px;height:36px;border-radius:999px;border:1px solid rgba(0,0,0,0.06);display:flex;align-items:center;justify-content:center;cursor:pointer;
    }
    .task-title{font-size:15px;margin:0}
    .meta{font-size:13px;color:var(--muted);display:flex;gap:10px;align-items:center;margin-top:4px}

    .actions{display:flex;gap:8px;align-items:center}
    .chip{font-size:12px;padding:6px 10px;border-radius:999px;background:rgba(0,0,0,0.03)}

    .done .task-title{ text-decoration: line-through; color: var(--muted) }

    /* ====== Completed area collapsible ====== */
    details{background:transparent;border:0}
    summary{cursor:pointer;list-style:none;outline:none;display:flex;align-items:center;gap:8px;padding:8px;border-radius:12px}
    .small-muted{font-size:13px;color:var(--muted)}

    /* ====== Footer controls ====== */
    .controls{display:flex;gap:8px;align-items:center;flex-wrap:wrap}

    /* ====== Responsive ====== */
    @media (max-width:520px){
      .app{padding:18px}
      .logo{width:40px;height:40px}
      .input input{font-size:14px}
    }

  </style>
</head>
<body>
  <main class="app" id="app">
    <header>
      <div class="brand">
        <div class="logo">+</div>
        <div>
          <h1>ToDo+</h1>
          <p class="lead">Pense-bête minimaliste — rien à installer</p>
        </div>
      </div>

      <div style="display:flex;align-items:center;gap:8px">
        <button id="btnNotif" class="icon-btn" title="Activer notifications"><span class="material-icons">notifications</span></button>
        <button id="btnExport" class="icon-btn" title="Exporter"><span class="material-icons">file_download</span></button>
        <button id="btnImport" class="icon-btn" title="Importer"><span class="material-icons">file_upload</span></button>
      </div>
    </header>

    <section class="input-row">
      <div class="input">
        <span class="material-icons" style="color:var(--muted)">edit_note</span>
        <input id="taskInput" placeholder="Que dois-tu faire ? (ex: Appeler Annick samedi à 15h)" />
      </div>
      <button id="addBtn" class="btn"><span class="material-icons">add</span> Ajouter</button>
    </section>

    <section>
      <div class="section-title">
        <h2 style="margin:0">À faire</h2>
        <div class="small-muted" id="countPending">0</div>
      </div>

      <div class="cards" id="todoList"></div>
    </section>

    <details id="donePanel">
      <summary><span class="small-muted">Terminées (<span id="countDone">0</span>)</span></summary>
      <div class="cards" id="doneList" style="margin-top:8px"></div>
    </details>

    <footer style="display:flex;align-items:center;justify-content:space-between;margin-top:6px">
      <div class="controls">
        <button id="clearDone" class="icon-btn" title="Vider les terminées">Vider</button>
        <button id="clearAll" class="icon-btn" title="Supprimer toutes les tâches">Supprimer tout</button>
      </div>
      <div class="small-muted">Local only — données stockées dans ton navigateur</div>
    </footer>
  </main>

  <input type="file" id="fileInput" style="display:none" accept="application/json" />

  <script>
    /* ======= Helper & storage ======= */
    const STORAGE_KEY = 'todo_plus_tasks_v1';
    let tasks = []; // {id,title,date,time,category,priority,done,createdAt}

    function save() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      render();
    }
    function load() {
      try {
        tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      } catch(e) { tasks = []; }
    }
    function uid() { return Math.random().toString(36).slice(2,9); }

    /* ======= Simple French natural-language parsing (MVP) ======= */
    function parseInput(text){
      text = (text || '').trim();
      if(!text) return null;

      const lower = text.toLowerCase();

      // detect time patterns (ex: 15h, 15h30, 15:30)
      let time = null;
      const timeMatch = lower.match(/(\b[0-2]?\d(?:h[0-5]?\d|\:[0-5]\d)?\b)/);
      if(timeMatch){
        time = timeMatch[1].replace('h', ':').replace('H',':').replace(/\s+/g,'');
      }

      // detect explicit date patterns dd/mm[/yyyy] or yyyy-mm-dd
      let date = null;
      const dateMatch = lower.match(/(\b\d{1,2}[\/\-]\d{1,2}(?:[\/\-]\d{2,4})?\b)/);
      if(dateMatch) {
        const d = dateMatch[1];
        // normalize to yyyy-mm-dd if possible
        const parts = d.split(/[\/\-]/).map(x=>parseInt(x,10));
        if(parts.length >= 2){
          let day = parts[0], month = parts[1], year = parts[2];
          if(year === undefined || year < 100) {
            const now = new Date();
            year = now.getFullYear();
          }
          // pad
          const mm = String(month).padStart(2,'0'), dd = String(day).padStart(2,'0');
          date = `${year}-${mm}-${dd}`;
        }
      }

      // keywords: aujourd'hui, demain, lundi, mardi... (français)
      if(!date){
        const weekdays = ['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];
        for(let i=0;i<weekdays.length;i++){
          if(lower.includes(weekdays[i])){
            // compute next weekday date
            const target = i; // 0 Sunday
            const today = new Date();
            const todayIdx = today.getDay();
            let diff = (target - todayIdx + 7) % 7;
            if(diff === 0 && !lower.includes("aujourd")) diff = 7; // if user said "samedi" and today is saturday, assume next week unless "aujourd'hui"
            const d = new Date();
            d.setDate(d.getDate() + diff);
            date = d.toISOString().slice(0,10);
            break;
          }
        }
        if(!date){
          if(lower.includes('aujourd')) {
            date = (new Date()).toISOString().slice(0,10);
          } else if(lower.includes('demain')) {
            const d = new Date(); d.setDate(d.getDate()+1);
            date = d.toISOString().slice(0,10);
          }
        }
      }

      // category simple keyword mapping
      const categories = [
        {k:['course','courses','acheter'],'c':'Courses'},
        {k:['rendez','médecin','rdv','dentiste','docteur'],'c':'Santé'},
        {k:['travail','boss','réunion','projet','boulot'],'c':'Travail'},
        {k:['admin','impôt','assurance','banque'],'c':'Administratif'},
      ];
      let category = 'Personnel';
      for(const m of categories){
        for(const kw of m.k){
          if(lower.includes(kw)){ category = m.c; break; }
        }
      }

      // priority detection
      let priority = 'Moyenne';
      if(lower.includes('urgent') || lower.includes('tout de suite') || lower.includes('immédiat')) priority = 'Haute';
      if(lower.includes('facultatif') || lower.includes('plus tard')) priority = 'Basse';

      // title: remove detected date/time words for cleanliness
      let title = text;
      title = title.replace(/\b(demain|aujourd'hui|aujourd’hui)\b/ig,'');
      title = title.replace(/\b(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)\b/ig,'');
      if(time) title = title.replace(time,'');
      if(dateMatch) title = title.replace(dateMatch[1],'');
      title = title.trim();
      if(!title) title = text; // fallback

      return {
        id: uid(),
        title: title,
        raw: text,
        date: date,       // yyyy-mm-dd or null
        time: time,       // hh:mm or null
        category,
        priority,
        done: false,
        createdAt: new Date().toISOString()
      };
    }

    /* ======= Rendering ======= */
    const todoList = document.getElementById('todoList');
    const doneList = document.getElementById('doneList');
    const countPending = document.getElementById('countPending');
    const countDone = document.getElementById('countDone');

    function render(){
      todoList.innerHTML = '';
      doneList.innerHTML = '';
      const pending = tasks.filter(t=>!t.done);
      const done = tasks.filter(t=>t.done);

      countPending.textContent = pending.length;
      countDone.textContent = done.length;

      // sort pending by priority (Haute, Moyenne, Basse) then date
      const order = { 'Haute':0,'Moyenne':1,'Basse':2 };
      pending.sort((a,b)=>{
        const p = (order[a.priority] - order[b.priority]) || ( (a.date||'9999') > (b.date||'9999') ? 1 : -1 ) || a.createdAt.localeCompare(b.createdAt);
        return p;
      });

      pending.forEach(t => todoList.appendChild(renderCard(t)));
      done.forEach(t => doneList.appendChild(renderCard(t)));
    }

    function renderCard(t){
      const card = document.createElement('div');
      card.className = 'card' + (t.done ? ' done' : '');
      card.dataset.id = t.id;
      card.innerHTML = `
        <div class="row">
          <div class="task-left">
            <div class="check" data-action="toggle" title="Terminer / réouvrir">
              <span class="material-icons">${t.done ? 'check' : 'radio_button_unchecked'}</span>
            </div>
            <div>
              <div class="task-main">
                <p class="task-title">${escapeHtml(t.title)}</p>
              </div>
              <div class="meta">
                ${t.date ? `<span class="chip"><span class="material-icons" style="font-size:14px;vertical-align:middle">calendar_today</span>&nbsp;${formatDateFrench(t.date)}</span>` : ''}
                ${t.time ? `<span class="chip"><span class="material-icons" style="font-size:14px;vertical-align:middle">schedule</span>&nbsp;${t.time}</span>` : ''}
                <span class="chip">${escapeHtml(t.category)}</span>
                <span class="chip">${escapeHtml(t.priority)}</span>
              </div>
            </div>
          </div>

          <div class="actions">
            <button class="icon-btn" data-action="edit" title="Modifier"><span class="material-icons">edit</span></button>
            <button class="icon-btn" data-action="delete" title="Supprimer"><span class="material-icons">delete</span></button>
          </div>
        </div>
      `;
      // event delegation via buttons handled later
      return card;
    }

    function formatDateFrench(iso){
      try{
        const d = new Date(iso);
        return d.toLocaleDateString('fr-FR',{day:'2-digit',month:'2-digit',year:'numeric'});
      }catch(e){ return iso; }
    }

    function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

    /* ======= Actions ======= */
    document.getElementById('addBtn').addEventListener('click', onAdd);
    document.getElementById('taskInput').addEventListener('keydown', (e)=>{ if(e.key==='Enter') onAdd(); });

    function onAdd(){
      const input = document.getElementById('taskInput');
      const val = input.value.trim();
      if(!val) return;
      const parsed = parseInput(val);
      if(!parsed) return;
      tasks.push(parsed);
      save();
      input.value = '';
      scheduleNotificationFor(parsed);
    }

    // delegate clicks in lists
    document.getElementById('todoList').addEventListener('click', handleListClick);
    document.getElementById('doneList').addEventListener('click', handleListClick);

    function handleListClick(e){
      const action = e.target.closest('[data-action]');
      if(!action) return;
      const act = action.dataset.action;
      const card = e.target.closest('.card');
      if(!card) return;
      const id = card.dataset.id;
      const idx = tasks.findIndex(x=>x.id===id);
      if(idx === -1) return;
      if(act === 'toggle'){
        tasks[idx].done = !tasks[idx].done;
        save();
      } else if(act === 'delete'){
        if(confirm('Supprimer définitivement cette tâche ?')) {
          tasks.splice(idx,1);
          save();
        }
      } else if(act === 'edit'){
        editTask(tasks[idx]);
      }
    }

    function editTask(t){
      // simple prompt-based editor (MVP)
      const newTitle = prompt('Modifier la tâche', t.title);
      if(newTitle === null) return;
      t.title = newTitle.trim() || t.title;

      const newDate = prompt('Date (yyyy-mm-dd) ou vide', t.date || '');
      if(newDate !== null) t.date = newDate.trim() || null;

      const newTime = prompt('Heure (hh:mm) ou vide', t.time || '');
      if(newTime !== null) t.time = newTime.trim() || null;

      const newCat = prompt('Catégorie', t.category || 'Personnel');
      if(newCat !== null) t.category = newCat.trim() || 'Personnel';

      const newPri = prompt('Priorité (Haute / Moyenne / Basse)', t.priority || 'Moyenne');
      if(newPri !== null) t.priority = newPri.trim() || 'Moyenne';

      save();
    }

    /* ======= Controls: clear, export, import, notifications ======= */
    document.getElementById('clearDone').addEventListener('click', ()=>{ if(confirm('Vider la liste des tâches terminées ?')){ tasks = tasks.filter(t=>!t.done); save(); } });
    document.getElementById('clearAll').addEventListener('click', ()=>{ if(confirm('Supprimer toutes les tâches ?')){ tasks = []; save(); } });

    // Export
    document.getElementById('btnExport').addEventListener('click', ()=>{
      const data = JSON.stringify(tasks, null, 2);
      const blob = new Blob([data], {type:'application/json'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'todo_plus_export.json';
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
    });

    // Import
    const fileInput = document.getElementById('fileInput');
    document.getElementById('btnImport').addEventListener('click', ()=> fileInput.click());
    fileInput.addEventListener('change', async (e)=>{
      const f = e.target.files[0];
      if(!f) return;
      try {
        const text = await f.text();
        const imported = JSON.parse(text);
        if(Array.isArray(imported)){
          // simple merge with generated ids if collision
          for(const it of imported){
            it.id = it.id || uid();
            tasks.push(it);
          }
          save();
          alert('Import réussi: ' + imported.length + ' tâches ajoutées.');
        } else alert('Fichier non reconnu.');
      } catch(err){ alert('Erreur lors de l\'import: ' + err.message) }
      fileInput.value = '';
    });

    // Notification permission
    const btnNotif = document.getElementById('btnNotif');
    btnNotif.addEventListener('click', async ()=>{
      if(!("Notification" in window)){
        alert('Notifications non supportées par ce navigateur.');
        return;
      }
      if(Notification.permission === 'granted'){
        alert('Notifications déjà autorisées. La page enverra des rappels si elle est ouverte au moment prévu.');
      } else {
        const p = await Notification.requestPermission();
        if(p === 'granted') alert('Notifications autorisées. Autorise aussi les sons/alertes si besoin.');
        else alert('Permission non accordée.');
      }
    });

    /* ======= Notification scheduling (page-open only) ======= */
    // We'll (re)compute next upcoming notifications on load/save.
    let scheduledTimers = [];
    function clearTimers(){ scheduledTimers.forEach(id=>clearTimeout(id)); scheduledTimers = []; }

    function scheduleAllNotifications(){
      clearTimers();
      if(Notification.permission !== 'granted') return;
      const now = Date.now();
      for(const t of tasks){
        if(t.done) continue;
        if(t.date){
          // build timestamp
          let ts = new Date(t.date + 'T00:00:00').getTime();
          if(t.time){
            // ensure time like hh:mm
            const parts = t.time.split(':').map(x=>parseInt(x,10));
            if(parts.length>=2){
              const d = new Date(t.date);
              d.setHours(parts[0], parts[1], 0, 0);
              ts = d.getTime();
            }
          } else {
            // default 9am
            const d = new Date(t.date); d.setHours(9,0,0,0); ts = d.getTime();
          }
          const delay = ts - now;
          if(delay > 0 && delay < 1000 * 60 * 60 * 24 * 7){ // schedule only within a week (MVP)
            const id = setTimeout(()=>{
              new Notification('ToDo+: ' + t.title, { body: `${t.date}${t.time ? ' ' + t.time : ''} — ${t.category}` });
            }, delay);
            scheduledTimers.push(id);
          }
        }
      }
    }

    function scheduleNotificationFor(task){
      // convenience: schedule single one after save
      scheduleAllNotifications();
    }

    /* ======= Init ======= */
    load();
    render();
    scheduleAllNotifications();

    // re-schedule on visibility change
    document.addEventListener('visibilitychange', ()=> {
      if(document.visibilityState === 'visible') scheduleAllNotifications();
      else clearTimers();
    });

    // small UX: press Ctrl+Enter to add with input focused
    document.addEventListener('keydown', (e)=> {
      if(e.ctrlKey && e.key === 'Enter'){
        onAdd();
      }
    });

    // friendly fallback: prompt user to enable notifications once if tasks with dates exist
    setTimeout(()=>{
      if(Notification.permission !== 'granted' && tasks.some(t=>t.date)) {
        // non-intrusive: change button color
        btnNotif.style.color = 'var(--accent)';
      }
    },2000);

  </script>
</body>
</html>
