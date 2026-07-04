const fs = require('fs');
const content = fs.readFileSync('game.html', 'utf8');

const newScript = `// ===== GAME STATE & CONSTANTS =====
const STORAGE_KEY='pin_game_state';
let playerName='',playerLives=3,playerScore=0,playerStreak=0,playerAnswered=false,playerAlive=true;
let currentQ=null,timerInterval=null,timerSecs=0,adTimer=null;
let activeGameMode = '';
let currentQIndex = 0;

const GAME_MODES = {
  trivia: {
    title: 'Paint by Trivia',
    desc: 'Answer correctly to reveal the hidden masterpiece!',
    icon: '<i class="ri-palette-fill"></i>',
    questions: [
      {type:'Trivia',icon:'<i class="ri-question-fill"></i>',time:15,q:'What color is formed by mixing blue and yellow?',opts:['Green','Purple','Orange','Brown'],ans:0,expl:'Blue + Yellow = Green'},
      {type:'Trivia',icon:'<i class="ri-question-fill"></i>',time:15,q:'A poet writes one poem every 2 days. How many in June?',opts:['12','15','30','6'],ans:1,expl:'June has 30 days. 30/2 = 15.'},
      {type:'Trivia',icon:'<i class="ri-question-fill"></i>',time:15,q:'Who painted the Mona Lisa?',opts:['Van Gogh','Da Vinci','Picasso','Michelangelo'],ans:1,expl:'Leonardo da Vinci painted the Mona Lisa.'}
    ]
  },
  emoji: {
    title: 'Emoji Charades',
    desc: 'Can you guess the phrase from the emojis?',
    icon: '<i class="ri-emotion-laugh-fill"></i>',
    questions: [
      {type:'Charades',icon:'<i class="ri-emotion-fill"></i>',time:12,q:'Guess the phrase:',pattern:['🎨','🍷','✍️'],opts:['Paint and Sip','Art Class','Sip, Paint & Poetry','Wine Tasting'],ans:2,expl:'Sip (wine), Paint (palette), Poetry (writing).'},
      {type:'Charades',icon:'<i class="ri-emotion-fill"></i>',time:12,q:'Guess the movie:',pattern:['🦁','👑'],opts:['Lion King','King Kong','Jungle Book','Madagascar'],ans:0,expl:'Lion + Crown = Lion King'},
      {type:'Charades',icon:'<i class="ri-emotion-fill"></i>',time:12,q:'Guess the concept:',pattern:['❤️','💔','🩹'],opts:['Hospital','Heartbreak & Healing','Romance','Cardiology'],ans:1,expl:'Heart -> Broken -> Healing'}
    ]
  },
  rhyme: {
    title: 'Rhyme Time',
    desc: 'Quickly find the perfect rhyme!',
    icon: '<i class="ri-mic-fill"></i>',
    questions: [
      {type:'Rhyme',icon:'<i class="ri-mic-line"></i>',time:10,q:'What rhymes with "ART"?',opts:['Paint','Heart','Canvas','Color'],ans:1,expl:'Art and Heart.'},
      {type:'Rhyme',icon:'<i class="ri-mic-line"></i>',time:10,q:'What rhymes with "WINE"?',opts:['Dine','Sip','Glass','Grape'],ans:0,expl:'Wine and Dine.'},
      {type:'Rhyme',icon:'<i class="ri-mic-line"></i>',time:10,q:'What rhymes with "SOUL"?',opts:['Spirit','Goal','Mind','Heart'],ans:1,expl:'Soul and Goal.'}
    ]
  },
  fastest: {
    title: 'Fastest Finger',
    desc: 'Unscramble words under extreme time pressure!',
    icon: '<i class="ri-flashlight-fill"></i>',
    questions: [
      {type:'Unscramble',icon:'<i class="ri-speed-fill"></i>',time:8,q:'Unscramble: TIYPORE',opts:['POETRY','PAINTER','TROPHY','RIOTER'],ans:0,expl:'TIYPORE -> POETRY'},
      {type:'Unscramble',icon:'<i class="ri-speed-fill"></i>',time:8,q:'Unscramble: SNCAVA',opts:['VACANS','CANVAS','SAVANC','VANCAS'],ans:1,expl:'SNCAVA -> CANVAS'},
      {type:'Unscramble',icon:'<i class="ri-speed-fill"></i>',time:8,q:'Unscramble: RCOLU',opts:['COLOR','LOUCR','ROCUL','CLURO'],ans:0,expl:'RCOLU -> COLOR'}
    ]
  }
};

const POEM_WORDS = ["love", "art", "soul", "wine", "brush", "color", "speak", "heart", "canvas", "rhythm", "life", "deep", "flow", "paint", "shadow", "light", "create", "voice", "truth"];

// ===== BROADCAST (Firebase Realtime DB) =====
let sharedState = {};

db.ref("gameState").on("value", (snap) => {
  sharedState = snap.val() || {};
  if (onValueCb) {
    try { onValueCb(sharedState); } catch(e) {}
  }
});

function getShared(){
  return sharedState;
}

let onValueCb = null;
function startPolling(cb){
  onValueCb = cb;
}

function stopPolling(){
  onValueCb = null;
}

// ===== SCREEN SYSTEM =====
function showScreen(id){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// ===== PLAYER JOIN =====
function joinGame(){
  const n=document.getElementById("player-name-inp").value.trim();
  const c=document.getElementById("player-contact-inp").value.trim();
  if(!n){showToast("<i class=\\"ri-error-warning-fill\\"></i> Please enter your name");return;}
  if(!c){showToast("<i class=\\"ri-error-warning-fill\\"></i> Please enter your email or phone");return;}
  playerName=n;
  
  // Try to load existing score if reconnecting
  const existingPlayer = getShared()?.players?.[n];
  if(existingPlayer) {
    playerLives = existingPlayer.lives || 3;
    playerScore = existingPlayer.score || 0;
    playerStreak = existingPlayer.streak || 0;
    playerAlive = existingPlayer.alive ?? true;
  } else {
    playerLives=3;playerScore=0;playerStreak=0;playerAlive=true;
  }
  
  const initials=n.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2);

  // Record registration
  db.ref("gameRegistrations/" + n.replace(/[^a-zA-Z0-9]/g, "_")).set({
    name: n,
    contact: c,
    joined: Date.now()
  });

  // Register in shared state safely
  updatePlayerInShared(initials);

  showScreen("s-game-select");

  // Poll for game availability
  startPolling(state=>{
    renderGameSelect(state.availableGames || {});
    renderLeaderboard(state.players || {});
    
    // Check if player was eliminated remotely or ran out of lives
    const me = state.players?.[playerName];
    if(me && !me.alive && playerAlive) {
      playerAlive = false;
      showScreen("s-eliminated");
    }
  });
}

function renderGameSelect(available) {
  const list = document.getElementById("gs-list");
  let html = "";
  
  Object.keys(GAME_MODES).forEach(id => {
    if(available[id]) {
      html += \`
      <div class="gs-card" onclick="startGameMode('\${id}')">
        <div class="gs-card-icon">\${GAME_MODES[id].icon}</div>
        <div class="gs-card-content">
          <div class="gs-card-title">\${GAME_MODES[id].title}</div>
          <div class="gs-card-desc">\${GAME_MODES[id].desc}</div>
        </div>
        <div style="color:var(--orange)"><i class="ri-arrow-right-line"></i></div>
      </div>\`;
    }
  });

  if(available["poem"]) {
    html += \`
    <div class="gs-card" onclick="startPoemMode()" style="border-color:var(--pink)">
      <div class="gs-card-icon" style="color:var(--pink)"><i class="ri-quill-pen-fill"></i></div>
      <div class="gs-card-content">
        <div class="gs-card-title" style="color:var(--pink)">Community Poem</div>
        <div class="gs-card-desc">Contribute a word to the live audience poem!</div>
      </div>
      <div style="color:var(--pink)"><i class="ri-arrow-right-line"></i></div>
    </div>\`;
  }

  if(!html) {
    html = \`<div style="text-align:center;color:var(--muted);margin-top:40px;">No games currently open.<br>Waiting for admin...</div>\`;
  }

  list.innerHTML = html;
}

function renderLeaderboard(players) {
  const list = document.getElementById("lb-list");
  const sorted = Object.values(players).sort((a,b)=>(b.score||0)-(a.score||0));
  
  if(sorted.length === 0) {
    list.innerHTML = \`<div style="text-align:center;color:var(--muted);margin-top:40px;">No players yet.</div>\`;
    return;
  }

  list.innerHTML = sorted.map((p, i) => \`
    <div class="lb-row" style="\${p.name === playerName ? 'border:1px solid var(--orange);' : ''}">
      <div class="lb-rank">#\${i+1}</div>
      <div class="lb-name">\${p.name} \${!p.alive ? '💀' : ''}</div>
      <div class="lb-score">\${p.score||0}</div>
    </div>
  \`).join("");
}

function startPoemMode() {
  document.getElementById("poem-grid").innerHTML = POEM_WORDS.map(word => 
    \`<div class="poem-word" onclick="selectPoemWord('\${word}')">\${word}</div>\`
  ).join("");
  showScreen("s-poem");
}

function selectPoemWord(word) {
  // Push word to firebase
  db.ref("gameState/communityPoem").push(word).then(() => {
    showToast("<i class=\\"ri-check-fill\\"></i> Word added to the poem!");
    showScreen("s-game-select");
  });
}

// ===== ASYNC GAME LOGIC =====
function startGameMode(id) {
  if(!playerAlive) {
    showScreen("s-eliminated");
    return;
  }
  activeGameMode = id;
  currentQIndex = 0;
  
  // Custom initialization
  if(id === 'trivia') {
     document.getElementById('q-image-blur').style.display = 'block';
     document.getElementById('q-image-blur').style.filter = 'blur(20px)';
  } else {
     document.getElementById('q-image-blur').style.display = 'none';
  }
  
  loadAsyncQuestion();
}

function loadAsyncQuestion() {
  const game = GAME_MODES[activeGameMode];
  if(currentQIndex >= game.questions.length) {
    showToast("<i class=\\"ri-sparkling-fill\\"></i> Game Completed!");
    // Bonus points for completing a game mode!
    playerScore += 200;
    updatePlayerInShared();
    showScreen("s-game-select");
    return;
  }

  const qData = game.questions[currentQIndex];
  currentQ = qData;
  playerAnswered = false;
  
  const progPct = (currentQIndex / game.questions.length) * 100;
  document.getElementById("q-prog-fill").style.width = progPct + "%";
  document.getElementById("q-round-label").textContent = \`\${game.title} · Q\${currentQIndex + 1}\`;
  document.getElementById("q-round-sub").textContent = qData.type;
  document.getElementById("q-type-chip").innerHTML = qData.icon + " " + qData.type;
  document.getElementById("q-text").textContent = qData.q;
  document.getElementById("q-sub").textContent = qData.sub || "";

  // Pattern display
  const pa = document.getElementById("q-pattern-area");
  if(qData.pattern && qData.pattern.length){
    pa.innerHTML = '<div class="q-pattern">' + qData.pattern.map((p,i)=>{
      const isAns = p==="?";
      return \`<div class="pattern-cell" style="background:\${isAns?'rgba(255,107,53,0.15)':'rgba(255,255,255,0.04)'};border-color:\${isAns?'rgba(255,107,53,0.5)':'rgba(255,255,255,0.1)'};font-size:\${p.length===1&&p.codePointAt(0)>0xFF?'22px':'18px'}">\${isAns?'?':p}</div>\`;
    }).join("") + "</div>";
  } else {pa.innerHTML = "";}

  // Options
  const letters = ["A","B","C","D"];
  document.getElementById("q-options").innerHTML = qData.opts.map((o,i)=>\`
  <button class="opt-btn" id="opt-\${i}" onclick="selectAnswer(\${i})">
    <span class="opt-letter">\${letters[i]}</span>\${o}
  </button>\`).join("");

  updateLivesUI();
  showScreen("s-question");
  startTimer(qData.time || 15);
}

function startTimer(secs){
  stopTimer();
  timerSecs=secs;
  const circum=150.8;
  updateTimerUI(secs,circum);
  timerInterval=setInterval(()=>{
    timerSecs--;
    updateTimerUI(timerSecs,circum);
    if(timerSecs<=0){
      stopTimer();
      if(!playerAnswered)autoWrong();
    }
  },1000);
}
function updateTimerUI(s,circum){
  const pct=s/(currentQ?.time||15);
  const offset=circum*(1-pct);
  const bar=document.getElementById("timer-bar");
  if(bar) {
    bar.style.strokeDashoffset=offset;
    bar.style.stroke=s<=5?"#E8386D":s<=8?"#F5C842":"#FF6B35";
  }
  const timerNum = document.getElementById("timer-num");
  if(timerNum) timerNum.textContent=Math.max(0,s);
}
function stopTimer(){if(timerInterval){clearInterval(timerInterval);timerInterval=null;}}

function selectAnswer(idx){
  if(playerAnswered||!playerAlive)return;
  playerAnswered=true;
  stopTimer();
  document.querySelectorAll(".opt-btn").forEach(b=>b.disabled=true);
  document.getElementById("opt-"+idx).style.borderColor="rgba(200,146,42,0.6)";

  // Immediately check answer locally
  setTimeout(() => revealAnswer(currentQ.ans, idx), 500);
}

function autoWrong(){
  if(playerAnswered)return;
  playerAnswered=true;
  document.querySelectorAll(".opt-btn").forEach(b=>b.disabled=true);
  revealAnswer(currentQ.ans, -1);
}

function revealAnswer(correctIdx, selectedIdx){
  stopTimer();
  const wasCorrect = (selectedIdx === correctIdx);
  
  document.querySelectorAll(".opt-btn").forEach((b,i)=>{
    b.disabled=true;
    if(i===correctIdx)b.classList.add("correct");
    else if(i===selectedIdx) b.classList.add("wrong");
  });
  
  setTimeout(()=>{
    if(wasCorrect){
      playerScore+=100+(timerSecs*5);
      playerStreak++;
      if(playerStreak>=3)playerScore+=50;
      
      // Update blur if trivia
      if(activeGameMode === 'trivia') {
        const game = GAME_MODES[activeGameMode];
        const pctDone = (currentQIndex + 1) / game.questions.length;
        const blurVal = Math.max(0, 20 * (1 - pctDone));
        document.getElementById('q-image-blur').style.filter = \`blur(\${blurVal}px)\`;
      }
      
      showResultScreen(true);
    } else {
      loseLife(true);
    }
  },1200);
}

function loseLife(fromReveal=false){
  playerLives--;
  updateLivesUI();
  updatePlayerInShared();
  
  // Check sip penalty (random 30% chance on lose life)
  if(Math.random() < 0.3) {
      showToast('🍷 SIP PENALTY! Take a sip!');
  }
  
  if(playerLives<=0){
    playerAlive=false;
    updatePlayerInShared();
    setTimeout(()=>showScreen("s-eliminated"),fromReveal?600:200);
  } else {
    if(fromReveal)showResultScreen(false);
  }
}

function updateLivesUI(){
  const el=document.getElementById("q-lives");
  if(el) el.innerHTML=['<i class="ri-heart-3-fill"></i>','<i class="ri-heart-3-fill"></i>','<i class="ri-heart-3-fill"></i>'].map((_,i)=>\`<span class="q-life \${i>=playerLives?'gone':''}"><i class="ri-heart-3-fill"></i></span>\`).join("");
}

function showResultScreen(correct){
  const icon=document.getElementById("res-icon");
  const title=document.getElementById("res-title");
  const sub=document.getElementById("res-sub");
  if(correct){
    icon.innerHTML='<i class="ri-checkbox-circle-fill"></i>';title.textContent='CORRECT!';
    sub.textContent=currentQ.expl||'Brilliant answer!';
    title.style.color='var(--green)';
  } else {
    playerStreak=0;
    icon.innerHTML='<i class="ri-close-fill"></i>';title.textContent='WRONG!';
    sub.innerHTML=(currentQ.expl||'') + ' &middot; Lives left: '+playerLives+'<i class="ri-heart-3-fill"></i>';
    title.style.color='var(--pink)';
  }
  document.getElementById("res-score").textContent=playerScore;
  document.getElementById("res-streak").innerHTML='<i class="ri-fire-fill"></i> Streak: '+playerStreak+(playerStreak>=3?' (Bonus active!)':'');
  showScreen("s-result");
  updatePlayerInShared();
}

function nextFromResult(){
  currentQIndex++;
  loadAsyncQuestion();
}

function updatePlayerInShared(initials = null){
  if(playerName) {
    const updateData = {
      score: playerScore,
      lives: playerLives,
      streak: playerStreak,
      alive: playerAlive
    };
    if (initials) updateData.initials = initials;
    db.ref("gameState/players/" + playerName).update(updateData);
  }
}`;

const startIndex = content.indexOf('// ===== GAME STATE =====');
const endIndex = content.indexOf('// ===== CONFETTI =====');

if (startIndex !== -1 && endIndex !== -1) {
  const finalContent = content.slice(0, startIndex) + newScript + '\n\n' + content.slice(endIndex);
  fs.writeFileSync('game.html', finalContent);
  console.log('Successfully replaced game state script');
} else {
  console.log('Could not find start or end index');
}
