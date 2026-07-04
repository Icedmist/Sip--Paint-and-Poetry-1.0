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

    return () => {
      unsubscribeSession();
      unsubscribeGame();
      unsubscribePartners();
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
      </main>
    </div>
  );
}
