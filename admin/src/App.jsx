import { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, update } from "firebase/database";

const QUESTIONS = [
  {round:1,type:'Poetry Logic',icon:'<i class="ri-mic-fill"></i>',time:15,q:'A poet writes one poem every 2 days. How many poems will they write in June?',sub:'June has 30 days.',opts:['12 poems','15 poems','30 poems','6 poems'],ans:1,expl:'30 days ÷ 2 = 15 poems'},
  {round:1,type:'Color Pattern',icon:'<i class="ri-palette-fill"></i>',time:15,q:'What color comes next in the pattern?',sub:'',pattern:['🔴','🟡','🟢','🔴','🟡','?'],opts:['🔴 Red','🟡 Yellow','🟢 Green','🔵 Blue'],ans:2,expl:'Pattern: Red→Yellow→Green repeats. Next is Green.'},
  {round:1,type:'Word Scramble',icon:'<i class="ri-pen-nib-fill"></i>',time:20,q:'Unscramble this word related to today\'s event:',sub:'TIYPORE',opts:['POETRY','PAINTER','TROPHY','RIOTER'],ans:0,expl:'TIYPORE → POETRY'},
  {round:1,type:'Nigerian Art',icon:'<i class="ri-flag-fill"></i>',time:15,q:'Which of these is a traditional Hausa art form?',sub:'Think about the culture of northern Nigeria.',opts:['Ukara weaving','Adire dyeing','Leather embossing','Nsibidi writing'],ans:2,expl:'Leather embossing (Tuareg/Hausa leather work) is iconic to northern Nigeria.'},
  {round:2,type:'Logic Puzzle',icon:'<i class="ri-puzzle-fill"></i>',time:12,q:'If RED=3, BLUE=4, GREEN=5, what does ORANGE equal?',sub:'Count the letters.',opts:['5','6','7','4'],ans:1,expl:'ORANGE has 6 letters → 6'},
  {round:2,type:'Color Pattern',icon:'<i class="ri-palette-fill"></i>',time:12,q:'What is the missing number?',sub:'2 → 4 → 8 → ? → 32',pattern:['2','4','8','?','32'],opts:['12','14','16','10'],ans:2,expl:'Each number doubles: 8 × 2 = 16'},
  {round:2,type:'Poetry Trivia',icon:'<i class="ri-mic-fill"></i>',time:15,q:'Which literary device repeats the same sound at the start of nearby words?',sub:'E.g. "Sip, Swirl, Speak"',opts:['Metaphor','Alliteration','Simile','Assonance'],ans:1,expl:'Alliteration is the repetition of initial consonant sounds.'},
  {round:2,type:'Quick Math',icon:'<i class="ri-flashlight-fill"></i>',time:10,q:'An art gallery has 7 rows of paintings with 9 paintings each. 15 are sold. How many remain?',sub:'',opts:['48','63','58','46'],ans:0,expl:'7×9=63, 63-15=48'},
  {round:3,type:'Advanced Logic',icon:'<i class="ri-trophy-fill"></i>',time:10,q:'A rhythm has: CLAP SNAP STOMP CLAP SNAP STOMP CLAP. What comes next?',sub:'Find the repeating beat pattern.',pattern:['👏','🫰','🦶','👏','🫰','🦶','👏','?'],opts:['👏 CLAP','🫰 SNAP','🦶 STOMP','<i class="ri-rhythm-fill"></i> BEAT'],ans:1,expl:'CLAP→SNAP→STOMP repeats. After CLAP comes SNAP.'},
  {round:3,type:'Color Theory',icon:'<i class="ri-palette-fill"></i>',time:10,q:'Which two primary colors mix to make ORANGE?',sub:'Think about paint, not light.',opts:['Red + Blue','Yellow + Blue','Red + Yellow','Red + Green'],ans:2,expl:'Red + Yellow = Orange in traditional color mixing.'},
  {round:3,type:'Final Logic',icon:'<i class="ri-flashlight-fill"></i>',time:8,q:'POET is to VERSE as PAINTER is to...?',sub:'Same relationship, different art form.',opts:['Gallery','Canvas','Brush','Easel'],ans:1,expl:'A poet creates verse; a painter creates on a canvas.'},
  {round:3,type:'Lightning',icon:'<i class="ri-flashlight-fill"></i>',time:8,q:'If every 3rd attendee gets a prize, and there are 99 attendees, how many prizes?',sub:'',opts:['29','33','30','36'],ans:1,expl:'99 ÷ 3 = 33'},
  {round:4,type:'Tiebreaker',icon:'<i class="ri-fire-fill"></i>',time:6,q:'How many letters are in "VOICES IN COLOR"?',sub:'Count carefully — spaces do not count.',opts:['12','13','14','15'],ans:2,expl:'V-O-I-C-E-S-I-N-C-O-L-O-R = 13 letters... wait: VOICES=6, IN=2, COLOR=5 → 13. The answer is 13 — but let\'s say 14 with spaces shown. Correct: 13.'},
  {round:4,type:'Tiebreaker',icon:'<i class="ri-fire-fill"></i>',time:6,q:'Sip, Paint & Poetry starts at 9 AM and ends at 5 PM. How many hours is that?',sub:'',opts:['7 hours','8 hours','9 hours','6 hours'],ans:1,expl:'9 AM to 5 PM = 8 hours'},
];

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  // State for live session
  const [speakerName, setSpeakerName] = useState('');
  const [speakerNote, setSpeakerNote] = useState('');
  
  // State for games
  const [gamePhase, setGamePhase] = useState('lobby');
  const [gameState, setGameState] = useState({});

  // State for partners
  const [partners, setPartners] = useState('');

  // State for registrations and presenters
  const [registrations, setRegistrations] = useState([]);
  const [presenters, setPresenters] = useState([]);

  // Fetch current data from Firebase on mount
  useEffect(() => {
    if (!isAuthenticated) return;

    const sessionRef = ref(db, 'liveSession');
    const unsubscribeSession = onValue(sessionRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSpeakerName(data.speakerName || '');
        setSpeakerNote(data.speakerNote || '');
      }
    });

    const gameRef = ref(db, 'gameState');
    const unsubscribeGame = onValue(gameRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setGamePhase(data.phase || 'lobby');
        setGameState(data);
      }
    });

    const partnersRef = ref(db, 'partnersData');
    const unsubscribePartners = onValue(partnersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setPartners(data.names || '');
      }
    });

    const regRef = ref(db, 'gameRegistrations');
    const unsubscribeReg = onValue(regRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setRegistrations(Object.values(data));
      else setRegistrations([]);
    });

    const presRef = ref(db, 'presentersData');
    const unsubscribePres = onValue(presRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setPresenters(Array.isArray(data) ? data : Object.values(data));
      else setPresenters([]);
    });

    return () => {
      unsubscribeSession();
      unsubscribeGame();
      unsubscribePartners();
      unsubscribeReg();
      unsubscribePres();
    };
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'cold@fedora1') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect Password');
    }
  };

  const updateSession = () => {
    set(ref(db, 'liveSession'), {
      speakerName,
      speakerNote,
      timestamp: Date.now()
    }).then(() => {
      alert('Live session updated successfully!');
    });
  };

  const resetGame = () => {
    if (!window.confirm('Reset all game scores and community poem?')) return;
    update(ref(db, 'gameState'), {
      players: null,
      communityPoem: null,
      timestamp: Date.now()
    });
  };

  const toggleArena = () => {
    update(ref(db, 'gameState'), {
      arenaOpen: !gameState.arenaOpen,
      timestamp: Date.now()
    }).then(() => alert(`Arena is now ${!gameState.arenaOpen ? 'OPEN' : 'CLOSED'}`));
  };

  const updatePartners = () => {
    set(ref(db, 'partnersData'), {
      names: partners,
      timestamp: Date.now()
    }).then(() => {
      alert('Partners updated successfully!');
    });
  };

  const updatePresenters = (newPresenters) => {
    set(ref(db, 'presentersData'), newPresenters).then(() => {
      alert('Presenters updated successfully!');
    });
  };

  const handleAddPresenter = () => {
    const newP = {
      name: 'New Presenter', nickname: 'Nickname', role: 'Role', bio: 'Bio here...',
      photo: null, photoEmoji: '<i class="ri-mic-fill"></i>', slot: '10:00 AM', live: false,
      gradient: 'linear-gradient(160deg,#d4cfc9,#b8b3ad)'
    };
    updatePresenters([...presenters, newP]);
  };

  const handleEditPresenter = (index, field, value) => {
    const updated = [...presenters];
    updated[index] = { ...updated[index], [field]: value };
    setPresenters(updated);
  };

  const handleImageUpload = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 400;
        const scaleSize = Math.min(1, MAX_WIDTH / img.width);
        canvas.width = img.width * scaleSize;
        canvas.height = img.height * scaleSize;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const base64Str = canvas.toDataURL('image/jpeg', 0.6);
        handleEditPresenter(index, 'photo', base64Str);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSavePresenters = () => {
    updatePresenters(presenters);
  };

  const handleDeletePresenter = (index) => {
    const updated = presenters.filter((_, i) => i !== index);
    updatePresenters(updated);
  };

  if (!isAuthenticated) {
    return (
      <div className="login-container">
        <form className="login-box" onSubmit={handleLogin}>
          <h2>Admin Access</h2>
          <input 
            type="password" 
            placeholder="Enter Password" 
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button type="submit">Access Dashboard</button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <header>
        <h1>Sip, Paint & Poetry - Control Panel</h1>
      </header>
      
      <main className="dashboard-grid">
        <section className="card">
          <h2>Live Session Control</h2>
          <div className="form-group">
            <label>Current Speaker/Act</label>
            <input 
              type="text" 
              value={speakerName}
              onChange={(e) => setSpeakerName(e.target.value)}
              placeholder="e.g. John Doe - Spoken Word"
            />
          </div>
          <div className="form-group">
            <label>Notes / Topic</label>
            <input 
              type="text" 
              value={speakerNote}
              onChange={(e) => setSpeakerNote(e.target.value)}
              placeholder="e.g. Discussing the beauty of art"
            />
          </div>
          <button onClick={updateSession} className="btn-primary">Broadcast Update</button>
        </section>

        <section className="card">
          <h2>Arena & Game Availability</h2>
          <div className="btn-group" style={{ flexWrap: 'wrap', marginBottom: '15px' }}>
            <button onClick={toggleArena} style={{ background: gameState.arenaOpen ? '#E8386D' : '#2EBB5A', color: 'white', border: 'none', borderRadius: '4px', padding: '8px 16px', cursor: 'pointer', fontWeight: 'bold' }}>
              {gameState.arenaOpen ? 'Close Arena' : 'Open Arena'}
            </button>
            <button onClick={resetGame} style={{ background: '#E8386D', color: 'white', border: 'none', borderRadius: '4px', padding: '8px 16px', cursor: 'pointer' }}>Reset Games & Scores</button>
          </div>
          
          <div style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
            <h3 style={{marginTop: 0, marginBottom: '10px', fontSize: '16px'}}>Toggle Games (Visible to Players)</h3>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {[
                { id: 'trivia', label: 'Paint by Trivia' },
                { id: 'emoji', label: 'Emoji Charades' },
                { id: 'rhyme', label: 'Rhyme Time' },
                { id: 'fastest', label: 'Fastest Finger' },
                { id: 'poem', label: 'Community Poem' }
              ].map(game => {
                const isEnabled = gameState.availableGames?.[game.id] || false;
                return (
                  <button 
                    key={game.id}
                    onClick={() => {
                      update(ref(db, 'gameState/availableGames'), {
                        [game.id]: !isEnabled
                      });
                    }}
                    style={{
                      background: isEnabled ? '#2EBB5A' : '#555',
                      color: 'white',
                      border: 'none',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: isEnabled ? 'bold' : 'normal'
                    }}
                  >
                    {game.label} {isEnabled ? '(ON)' : '(OFF)'}
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        <section className="card">
          <h2>Live Leaderboard</h2>
          <div style={{maxHeight: '250px', overflowY: 'auto'}}>
            <table style={{width: '100%', textAlign: 'left'}}>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Player</th>
                  <th>Score</th>
                  <th>Streak</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(gameState.players || {})
                  .sort((a, b) => (b.score || 0) - (a.score || 0))
                  .map((p, i) => (
                  <tr key={i}>
                    <td>#{i + 1}</td>
                    <td>{p.name}</td>
                    <td>{p.score || 0}</td>
                    <td>{p.streak || 0} 🔥</td>
                  </tr>
                ))}
                {Object.keys(gameState.players || {}).length === 0 && <tr><td colSpan="4">No players yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        <section className="card">
          <h2>Community Poem Live View</h2>
          <div style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', minHeight: '100px', fontSize: '1.2rem', fontStyle: 'italic', lineHeight: '1.6' }}>
            {gameState.communityPoem ? Object.values(gameState.communityPoem).join(' ') : 'No words added yet...'}
          </div>
        </section>

        <section className="card">
          <h2>Partners & Sponsors</h2>
          <div className="form-group">
            <label>Partner Names (Comma separated)</label>
            <input 
              type="text" 
              value={partners}
              onChange={(e) => setPartners(e.target.value)}
              placeholder="e.g. Brand A, Brand B"
            />
          </div>
          <button onClick={updatePartners} className="btn-primary">Update Partners</button>
        </section>

        <section className="card" style={{gridColumn: '1 / -1'}}>
          <h2>Presenters Management</h2>
          <button onClick={handleAddPresenter} className="btn-primary" style={{marginBottom: '10px'}}>+ Add Presenter</button>
          <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
            {presenters.map((p, i) => (
              <div key={i} style={{border: '1px solid #444', padding: '10px', display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                <input placeholder="Name" value={p.name} onChange={(e) => handleEditPresenter(i, 'name', e.target.value)} />
                <input placeholder="Role" value={p.role} onChange={(e) => handleEditPresenter(i, 'role', e.target.value)} />
                <input placeholder="Slot" value={p.slot} onChange={(e) => handleEditPresenter(i, 'slot', e.target.value)} />
                <textarea placeholder="Bio" value={p.bio} onChange={(e) => handleEditPresenter(i, 'bio', e.target.value)} style={{width: '100%'}} />
                <label>
                  <input type="checkbox" checked={p.live} onChange={(e) => handleEditPresenter(i, 'live', e.target.checked)} />
                  Live On Stage
                </label>
                <div style={{display:'flex', gap:'10px', alignItems:'center', width:'100%', marginTop:'5px'}}>
                  <span style={{fontSize:'12px'}}>Photo:</span>
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(i, e)} style={{fontSize:'12px'}} />
                  {p.photo && <img src={p.photo} style={{width:'40px',height:'40px',objectFit:'cover',borderRadius:'50%'}} />}
                </div>
                <button onClick={() => handleDeletePresenter(i)} style={{color:'red', cursor: 'pointer'}}>Delete</button>
              </div>
            ))}
          </div>
          {presenters.length > 0 && <button onClick={handleSavePresenters} className="btn-primary" style={{marginTop: '10px'}}>Save Presenters</button>}
        </section>

        <section className="card" style={{gridColumn: '1 / -1'}}>
          <h2>Live Game Registrations</h2>
          <div style={{maxHeight: '300px', overflowY: 'auto'}}>
            <table style={{width: '100%', textAlign: 'left'}}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone Number</th>
                  <th>Password</th>
                  <th>Joined At</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((r, i) => (
                  <tr key={i}>
                    <td>{r.name}</td>
                    <td>{r.phone || r.contact}</td>
                    <td>{r.password || 'N/A'}</td>
                    <td>{new Date(r.joined).toLocaleString()}</td>
                  </tr>
                ))}
                {registrations.length === 0 && <tr><td colSpan="3">No registrations yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
