import { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBXYVqnK9R5Jz7oa2cHXmrbqNlC2XhXJho",
  authDomain: "nexa-storeos.firebaseapp.com",
  databaseURL: "https://nexa-storeos-default-rtdb.firebaseio.com",
  projectId: "nexa-storeos",
  storageBucket: "nexa-storeos.firebasestorage.app"
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
  const [gamePhase, setGamePhase] = useState('Lobby');

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
        setGamePhase(data.phase || 'Lobby');
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
    if (password === 'admin2026') {
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

  const updateGamePhase = (newPhase) => {
    set(ref(db, 'gameState'), {
      phase: newPhase,
      timestamp: Date.now()
    }).then(() => {
      setGamePhase(newPhase);
    });
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
      photo: null, photoEmoji: '<i className="ri-mic-fill"></i>', slot: '10:00 AM', live: false,
      gradient: 'linear-gradient(160deg,#d4cfc9,#b8b3ad)'
    };
    updatePresenters([...presenters, newP]);
  };

  const handleEditPresenter = (index, field, value) => {
    const updated = [...presenters];
    updated[index] = { ...updated[index], [field]: value };
    setPresenters(updated);
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
          <h2>Game Master Control</h2>
          <p>Current Phase: <strong>{gamePhase}</strong></p>
          <div className="btn-group">
            <button onClick={() => updateGamePhase('Lobby')} className={gamePhase === 'Lobby' ? 'active' : ''}>Lobby</button>
            <button onClick={() => updateGamePhase('Question')} className={gamePhase === 'Question' ? 'active' : ''}>Question</button>
            <button onClick={() => updateGamePhase('Reveal')} className={gamePhase === 'Reveal' ? 'active' : ''}>Reveal</button>
            <button onClick={() => updateGamePhase('Winner')} className={gamePhase === 'Winner' ? 'active' : ''}>Winner</button>
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
                  <th>Contact (Email/Phone)</th>
                  <th>Joined At</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((r, i) => (
                  <tr key={i}>
                    <td>{r.name}</td>
                    <td>{r.contact}</td>
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
