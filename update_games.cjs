const fs = require('fs');
let html = fs.readFileSync('game.html', 'utf8');

const newGameModes = `const GAME_MODES = {
  trivia: {
    title: 'Paint by Trivia',
    desc: 'Answer correctly to reveal the hidden masterpiece!',
    icon: '<i class="ri-palette-fill"></i>',
    questions: [
      {type:'Trivia',icon:'<i class="ri-question-fill"></i>',time:15,q:'What color is formed by mixing blue and yellow?',opts:['Green','Purple','Orange','Brown'],ans:0,expl:'Blue + Yellow = Green'},
      {type:'Trivia',icon:'<i class="ri-question-fill"></i>',time:15,q:'A poet writes one poem every 2 days. How many in June?',opts:['12','15','30','6'],ans:1,expl:'June has 30 days. 30/2 = 15.'},
      {type:'Trivia',icon:'<i class="ri-question-fill"></i>',time:15,q:'Who painted the Mona Lisa?',opts:['Van Gogh','Da Vinci','Picasso','Michelangelo'],ans:1,expl:'Leonardo da Vinci painted the Mona Lisa.'},
      {type:'Trivia',icon:'<i class="ri-question-fill"></i>',time:12,q:'Which art movement did Salvador Dalí belong to?',opts:['Impressionism','Surrealism','Cubism','Baroque'],ans:1,expl:'Dalí was a leading Surrealist painter.'},
      {type:'Trivia',icon:'<i class="ri-question-fill"></i>',time:12,q:'In music, how many beats are in a measure of 3/4 time?',opts:['2','3','4','6'],ans:1,expl:'3/4 time has 3 beats per measure.'},
      {type:'Trivia',icon:'<i class="ri-question-fill"></i>',time:10,q:'What is the complementary color of blue?',opts:['Green','Red','Orange','Yellow'],ans:2,expl:'On the color wheel, orange is opposite blue.'},
      {type:'Trivia',icon:'<i class="ri-question-fill"></i>',time:10,q:'Which Nigerian author wrote "Things Fall Apart"?',opts:['Wole Soyinka','Chinua Achebe','Chimamanda Adichie','Ben Okri'],ans:1,expl:'Chinua Achebe published it in 1958.'},
      {type:'Trivia',icon:'<i class="ri-question-fill"></i>',time:10,q:'If a canvas costs ₦1,200 and paint costs 3× the canvas, total?',opts:['₦3,600','₦4,800','₦4,200','₦6,000'],ans:1,expl:'Paint = ₦3,600. Total = ₦1,200 + ₦3,600 = ₦4,800.'},
      {type:'Trivia',icon:'<i class="ri-question-fill"></i>',time:8,q:'A gallery sells 40% of 250 paintings. How many remain?',opts:['100','150','160','110'],ans:1,expl:'40% of 250 = 100 sold. 250 - 100 = 150 remain.'},
      {type:'Trivia',icon:'<i class="ri-question-fill"></i>',time:8,q:'Which pigment was made from crushed lapis lazuli?',opts:['Vermilion','Ultramarine','Ochre','Sienna'],ans:1,expl:'Ultramarine blue.'}
    ]
  },
  emoji: {
    title: 'Emoji Charades',
    desc: 'Can you guess the phrase from the emojis?',
    icon: '<i class="ri-emotion-laugh-fill"></i>',
    questions: [
      {type:'Charades',icon:'<i class="ri-emotion-fill"></i>',time:12,q:'Guess the phrase:',pattern:['🎨','🍷','✍️'],opts:['Paint and Sip','Art Class','Sip, Paint & Poetry','Wine Tasting'],ans:2,expl:'Sip (wine), Paint (palette), Poetry (writing).'},
      {type:'Charades',icon:'<i class="ri-emotion-fill"></i>',time:12,q:'Guess the movie:',pattern:['🦁','👑'],opts:['Lion King','King Kong','Jungle Book','Madagascar'],ans:0,expl:'Lion + Crown = Lion King'},
      {type:'Charades',icon:'<i class="ri-emotion-fill"></i>',time:12,q:'Guess the concept:',pattern:['❤️','💔','🩹'],opts:['Hospital','Heartbreak & Healing','Romance','Cardiology'],ans:1,expl:'Heart -> Broken -> Healing'},
      {type:'Charades',icon:'<i class="ri-emotion-fill"></i>',time:10,q:'Guess the saying:',pattern:['🐦','✌️','🌳'],opts:['Two birds one stone','A bird in the hand','Free as a bird','Early bird'],ans:1,expl:'A bird in the hand is worth two in the bush.'},
      {type:'Charades',icon:'<i class="ri-emotion-fill"></i>',time:10,q:'Guess the activity:',pattern:['🎭','🎤','👏'],opts:['Karaoke','Poetry Slam','Theatre','Concert'],ans:1,expl:'Performance mask + mic + applause = Poetry Slam.'},
      {type:'Charades',icon:'<i class="ri-emotion-fill"></i>',time:10,q:'Guess the place:',pattern:['🇳🇬','🏔️','⛰️'],opts:['Jos Plateau','Mount Cameroon','Abuja','Obudu Ranch'],ans:0,expl:'Nigeria + mountains = Jos Plateau.'},
      {type:'Charades',icon:'<i class="ri-emotion-fill"></i>',time:8,q:'Guess the song:',pattern:['🌧️','💜','☔'],opts:['Purple Rain','Umbrella','Singing in the Rain','Riders on the Storm'],ans:0,expl:'Rain + Purple = Purple Rain.'},
      {type:'Charades',icon:'<i class="ri-emotion-fill"></i>',time:8,q:'Guess the phrase:',pattern:['🖌️','🗣️','💡','🔥'],opts:['Creative spark','Art speaks louder','Brush with genius','Painting words on fire'],ans:3,expl:'Brush + speech + idea + fire = Painting words on fire.'}
    ]
  },
  rhyme: {
    title: 'Rhyme Time',
    desc: 'Quickly find the perfect rhyme!',
    icon: '<i class="ri-mic-fill"></i>',
    questions: [
      {type:'Rhyme',icon:'<i class="ri-mic-line"></i>',time:10,q:'What rhymes with "ART"?',opts:['Paint','Heart','Canvas','Color'],ans:1,expl:'Art and Heart.'},
      {type:'Rhyme',icon:'<i class="ri-mic-line"></i>',time:10,q:'What rhymes with "WINE"?',opts:['Dine','Sip','Glass','Grape'],ans:0,expl:'Wine and Dine.'},
      {type:'Rhyme',icon:'<i class="ri-mic-line"></i>',time:10,q:'What rhymes with "SOUL"?',opts:['Spirit','Goal','Mind','Heart'],ans:1,expl:'Soul and Goal.'},
      {type:'Rhyme',icon:'<i class="ri-mic-line"></i>',time:8,q:'What rhymes with "VERSE"?',opts:['Poetry','Curse','Line','Word'],ans:1,expl:'Verse and Curse.'},
      {type:'Rhyme',icon:'<i class="ri-mic-line"></i>',time:8,q:'What rhymes with "STAGE"?',opts:['Show','Page','Act','Light'],ans:1,expl:'Stage and Page.'},
      {type:'Rhyme',icon:'<i class="ri-mic-line"></i>',time:8,q:'What rhymes with "BRUSH"?',opts:['Paint','Crush','Stroke','Draw'],ans:1,expl:'Brush and Crush.'},
      {type:'Rhyme',icon:'<i class="ri-mic-line"></i>',time:6,q:'What rhymes with "SPEAK"?',opts:['Talk','Unique','Voice','Tongue'],ans:1,expl:'Speak and Unique.'},
      {type:'Rhyme',icon:'<i class="ri-mic-line"></i>',time:6,q:'What rhymes with "NIGHT"?',opts:['Dark','Moonlight','Shadow','Evening'],ans:1,expl:'Night and Moonlight.'},
      {type:'Rhyme',icon:'<i class="ri-mic-line"></i>',time:5,q:'What rhymes with "EMOTION"?',opts:['Feeling','Devotion','Passion','Sentiment'],ans:1,expl:'Emotion and Devotion.'}
    ]
  },
  fastest: {
    title: 'Fastest Finger',
    desc: 'Unscramble words under extreme time pressure!',
    icon: '<i class="ri-flashlight-fill"></i>',
    questions: [
      {type:'Unscramble',icon:'<i class="ri-speed-fill"></i>',time:8,q:'Unscramble: TIYPORE',opts:['POETRY','PAINTER','TROPHY','RIOTER'],ans:0,expl:'TIYPORE -> POETRY'},
      {type:'Unscramble',icon:'<i class="ri-speed-fill"></i>',time:8,q:'Unscramble: SNCAVA',opts:['VACANS','CANVAS','SAVANC','VANCAS'],ans:1,expl:'SNCAVA -> CANVAS'},
      {type:'Unscramble',icon:'<i class="ri-speed-fill"></i>',time:8,q:'Unscramble: RCOLU',opts:['COLOR','LOUCR','ROCUL','CLURO'],ans:0,expl:'RCOLU -> COLOR'},
      {type:'Unscramble',icon:'<i class="ri-speed-fill"></i>',time:7,q:'Unscramble: HSUBR',opts:['SHRUB','BRUSH','CRUSH','BURST'],ans:1,expl:'HSUBR -> BRUSH'},
      {type:'Unscramble',icon:'<i class="ri-speed-fill"></i>',time:7,q:'Unscramble: TSIRAT',opts:['ARTIST','TRAITS','STAIRS','STARTS'],ans:0,expl:'TSIRAT -> ARTIST'},
      {type:'Unscramble',icon:'<i class="ri-speed-fill"></i>',time:6,q:'Unscramble: YMEODL',opts:['MODELY','YODLEM','MELODY','MOLEDY'],ans:2,expl:'YMEODL -> MELODY'},
      {type:'Unscramble',icon:'<i class="ri-speed-fill"></i>',time:6,q:'Unscramble: LAYRLEG',opts:['GALLERY','LARGELY','ALLERGY','LEGALLY'],ans:0,expl:'LAYRLEG -> GALLERY'},
      {type:'Unscramble',icon:'<i class="ri-speed-fill"></i>',time:5,q:'Unscramble: HAPMTERO',opts:['METAPHOR','MARATHON','CHAPTERS','MORPHATE'],ans:0,expl:'HAPMTERO -> METAPHOR'},
      {type:'Unscramble',icon:'<i class="ri-speed-fill"></i>',time:5,q:'Unscramble: CIMORHNA',opts:['ROMANTIC','HARMONIC','CHROMANI','CHAIRMAN'],ans:1,expl:'CIMORHNA -> HARMONIC'}
    ]
  }
};`;

const newPollLogic = `// ===== ARENA PAUSE STATE =====
let arenaPaused = false;

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
    const arenaOpen = state.arenaOpen ?? false;
    
    // Arena pause logic
    if(!arenaOpen && !arenaPaused) {
      arenaPaused = true;
      if(typeof stopTimer === 'function') stopTimer();
      showToast('<i class="ri-pause-fill"></i> Arena has been paused by the host');
      const activeScreen = document.querySelector('.screen.active');
      if(activeScreen && activeScreen.id === 's-question') {
        const overlay = document.getElementById('arena-paused-overlay');
        if(overlay) overlay.style.display = 'flex';
      }
    } else if(arenaOpen && arenaPaused) {
      arenaPaused = false;
      const overlay = document.getElementById('arena-paused-overlay');
      if(overlay) overlay.style.display = 'none';
      
      const activeScreen = document.querySelector('.screen.active');
      if(activeScreen && activeScreen.id === 's-question' && !playerAnswered && timerSecs > 0) {
        if(typeof startTimer === 'function') startTimer(timerSecs);
      }
      showToast('<i class="ri-play-fill"></i> Arena is back live!');
    }

    renderGameSelect(state.availableGames || {});
    renderLeaderboard(state.players || {});
    
    // Check if player was eliminated remotely or ran out of lives
    const me = state.players?.[playerName];
    if(me && !me.alive && playerAlive) {
      playerAlive = false;
      showScreen("s-eliminated");
    }
  });
}`;

// 1. Replace GAME_MODES
const startModes = html.indexOf('const GAME_MODES = {');
const endModes = html.indexOf('const POEM_WORDS =');
html = html.substring(0, startModes) + newGameModes + '\n\n' + html.substring(endModes);

// 2. Replace Polling Logic
const startPoll = html.indexOf('// ===== BROADCAST (Firebase Realtime DB) =====');
const endPoll = html.indexOf('function renderGameSelect(available) {');
html = html.substring(0, startPoll) + newPollLogic + '\n\n' + html.substring(endPoll);

// 3. Add pause overlay HTML if not exists
if (!html.includes('id="arena-paused-overlay"')) {
  const overlayHtml = `
  <!-- Arena Paused Overlay -->
  <div id="arena-paused-overlay" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(20,20,20,0.9); z-index:9999; flex-direction:column; align-items:center; justify-content:center; color:white; backdrop-filter:blur(10px);">
    <i class="ri-pause-circle-fill" style="font-size: 64px; color: var(--gold); margin-bottom: 20px;"></i>
    <h2 style="font-family: 'Playfair Display', serif; margin-bottom: 10px;">Arena Paused</h2>
    <p style="color: var(--muted); text-align: center; max-width: 300px;">The host has temporarily paused the games. Hang tight, we'll resume shortly!</p>
  </div>
`;
  html = html.replace('</body>', overlayHtml + '\n</body>');
}

fs.writeFileSync('game.html', html);
console.log('done');
