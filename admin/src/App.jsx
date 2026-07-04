import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, update } from 'firebase/database';

const DEFAULTS = [
  {name:'Prof. Sani Ahmad Yauta',nickname:'Chief Host',role:'Vice Chancellor, Gombe State University',bio:'Our Chief Host and the Vice Chancellor of Gombe State University.',photoEmoji:'🏛️',gradient:'linear-gradient(135deg,var(--orange-d),var(--orange))'},
  {name:'Prof. Danladi M. Umar',nickname:'Chairman',role:'Deputy Vice Chancellor, Gombe State University',bio:'The Chairman of the Occasion.',photoEmoji:'👨‍🏫',gradient:'linear-gradient(135deg,var(--blue-d),var(--blue))'},
  {name:'Assoc. Prof. Buhari Magaji',nickname:'Host',role:'Event Host',bio:'Our dedicated Host for the evening.',photoEmoji:'🎤',gradient:'linear-gradient(135deg,var(--pink-d),var(--pink))'},
  {name:'Alh. Yaya Hammari',nickname:'Royal Father',role:'Royal Father of the Day',bio:'Our esteemed Royal Father of the Day.',photoEmoji:'👑',gradient:'linear-gradient(135deg,var(--gold-d),var(--gold))'},
  {name:'Assoc. Prof. Aishatu Kumo',nickname:'Mother of the Day',role:'Mother of the Day',bio:'Our distinguished Mother of the Day.',photoEmoji:'🌺',gradient:'linear-gradient(135deg,var(--pink-d),var(--pink))'},
  {name:'Alh. Dr. Jamilu Ishayaku Gwamna',nickname:'Special Guest',role:'Special Guest of Honor',bio:'Our Special Guest of Honor for Sip, Paint & Poetry 1.0.',photoEmoji:'🌟',gradient:'linear-gradient(135deg,var(--orange-d),var(--orange))'},
  
  // Guests of Honor
  {name:'Prof. Aliyu Usman Bafeto',nickname:'Guest of Honor',role:'Registrar, Gombe State University',bio:'Guest of Honor.',photoEmoji:'🎓',gradient:'linear-gradient(135deg,var(--green-d),var(--green))'},
  {name:'Prof. Dr. Yusuf Muhammad',nickname:'Guest of Honor',role:'Chief Medical Director, FTH Gombe',bio:'Guest of Honor.',photoEmoji:'🏥',gradient:'linear-gradient(135deg,var(--green-d),var(--green))'},
  {name:'Mr. Amin Amos',nickname:'Guest of Honor',role:'Ma\'ori',bio:'Guest of Honor.',photoEmoji:'✨',gradient:'linear-gradient(135deg,var(--green-d),var(--green))'},
  {name:'Khalifa Sadiqu Shehu',nickname:'Guest of Honor',role:'Guest of Honor',bio:'Guest of Honor.',photoEmoji:'✨',gradient:'linear-gradient(135deg,var(--green-d),var(--green))'},
  {name:'Engr. Muhammad Y. Gorki',nickname:'Guest of Honor',role:'Guest of Honor',bio:'Guest of Honor.',photoEmoji:'✨',gradient:'linear-gradient(135deg,var(--green-d),var(--green))'},

  // Keynote & Special Guests
  {name:'Hon. Simon Elisha Karu',nickname:'Keynote',role:'Keynote Speaker',bio:'Delivering the keynote address on Voices in Color.',photoEmoji:'🎙️',gradient:'linear-gradient(135deg,var(--orange-d),var(--orange))'},
  {name:'Rt. Hon. Sadam Bello',nickname:'Special Guest',role:'Special Guest',bio:'Special Guest.',photoEmoji:'⭐',gradient:'linear-gradient(135deg,var(--blue-d),var(--blue))'},
  {name:'Barr. Ibrahim Kalayi',nickname:'Special Guest',role:'Special Guest',bio:'Special Guest.',photoEmoji:'⭐',gradient:'linear-gradient(135deg,var(--blue-d),var(--blue))'},
  {name:'Hon. Ibrahim Ishaya',nickname:'Ibro Fish Abuja',role:'Special Guest',bio:'Special Guest.',photoEmoji:'⭐',gradient:'linear-gradient(135deg,var(--blue-d),var(--blue))'},

  // Institutional
  {name:'Dean',nickname:'Institutional Guest',role:'Faculty of Arts, Gombe State University',bio:'Institutional Guest.',photoEmoji:'🏛️',gradient:'linear-gradient(135deg,var(--gold-d),var(--gold))'},
  {name:'Deputy Dean',nickname:'Institutional Guest',role:'Faculty of Arts, Gombe State University',bio:'Institutional Guest.',photoEmoji:'🏛️',gradient:'linear-gradient(135deg,var(--gold-d),var(--gold))'},

  // Award Recipients
  {name:'Engr. Aliyu Muhammad Kombat',nickname:'Award Recipient',role:'Chairman, Velocity Humanitarian Foundation',bio:'Recipient of the "True Son of the Soil Award".',photoEmoji:'🏆',gradient:'linear-gradient(135deg,var(--gold-d),var(--gold))'},
  {name:'Dr. Abdulrahman Shuaibu',nickname:'Award Recipient',role:'Exec. Secretary, Primary Health Care Development Agency',bio:'Award Recipient.',photoEmoji:'🏆',gradient:'linear-gradient(135deg,var(--gold-d),var(--gold))'}
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
  const [isAuthenticated, setIsAuthenticated] = useState(true);
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
        <div className="login-glow"></div>
        <form className="login-box" onSubmit={handleLogin}>
          <div className="login-icon">
            <i className="ri-shield-key-line"></i>
          </div>
          <h2>Admin Access</h2>
          <p className="login-subtitle">Sip, Paint & Poetry Control Panel</p>
          <div className="input-group">
            <i className="ri-lock-password-line input-icon"></i>
            <input 
              type="password" 
              placeholder="Enter Password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
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
