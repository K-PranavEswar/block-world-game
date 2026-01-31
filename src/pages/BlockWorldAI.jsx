import React, { useState, useEffect, useCallback } from "react"
import Arm from "../components/Arm"
import TestTube from "../components/TestTube"
import GoalState from "../components/GoalState"
import ResultModal from "../components/ResultModal"

// --- CONSTANTS & HELPERS ---
const ID_TO_COLOR = {
  1: "#ef4444", 2: "#3b82f6", 3: "#22c55e", 
  4: "#eab308", 5: "#a855f7", 6: "#ec4899"
}
const toColors = (stack) => stack.map(id => ID_TO_COLOR[id])
const checkWin = (curr, goal) => JSON.stringify(curr) === JSON.stringify(goal);

const getArmOffset = (index, isMobile) => {
  const gap = isMobile ? 80 : 120;
  return (index - 1) * gap; 
}

const generateRandomState = () => {
  const blocks = [1, 2, 3, 4, 5, 6];
  for (let i = blocks.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [blocks[i], blocks[j]] = [blocks[j], blocks[i]];
  }
  const stacks = [[], [], []];
  blocks.forEach(block => {
    let inserted = false;
    while(!inserted) {
      const r = Math.floor(Math.random() * 3);
      if (stacks[r].length < 4) {
        stacks[r].push(block);
        inserted = true;
      }
    }
  });
  return stacks;
}

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export default function BlockWorldAI() {
  // --- STATE ---
  const [stacks, setStacks] = useState([[1, 2, 3], [4, 5], [6]]) 
  const [goal, setGoal] = useState(generateRandomState()) 
  const [held, setHeld] = useState(null)
  const [moves, setMoves] = useState(0)
  const [time, setTime] = useState(0)
  const [completed, setCompleted] = useState(false)
  
  // UI STATE
  const [armIdx, setArmIdx] = useState(1);
  const [isMoving, setIsMoving] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // --- RESPONSIVE LOGIC ---
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024)
  
  useEffect(() => {
    restartGame();
    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const isMobile = width < 768;
  const hudScale = isMobile ? Math.min(width / 400, 0.85) : 0.9; 
  const gameScale = isMobile ? Math.min(width / 420, 0.9) : 1;

  // --- TIMER ---
  useEffect(() => {
    if (completed) return;
    const interval = setInterval(() => setTime(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [completed]);

  // --- GAME LOGIC ---
  function handleTubeClick(i) {
    if (completed || isMoving || isSidebarOpen) return;
    setArmIdx(i);
    setIsMoving(true);

    setTimeout(() => {
      const nextStacks = stacks.map(s => [...s])
      if (held === null) {
        if (nextStacks[i].length > 0) setHeld(nextStacks[i].pop());
      } else {
        if (nextStacks[i].length < 4) {
          nextStacks[i].push(held);
          setHeld(null);
          setMoves(m => m + 1);
          if (checkWin(nextStacks, goal)) setCompleted(true);
        }
      }
      setStacks(nextStacks);
      setIsMoving(false);
    }, 400);
  }

  function restartGame() {
    setStacks([[1, 2, 3], [4, 5], [6]]); 
    setGoal(generateRandomState()); 
    setHeld(null);
    setMoves(0);
    setTime(0);
    setCompleted(false);
    setArmIdx(1);
    setIsMoving(false);
    setIsSidebarOpen(false);
  }

  return (
    <div style={styles.page}>
      
      {/* SIDEBAR OVERLAY */}
      {isSidebarOpen && <div style={styles.overlay} onClick={() => setIsSidebarOpen(false)} />}
      
      {/* SIDEBAR */}
      <div style={{ ...styles.sidebar, right: isSidebarOpen ? 0 : "-300px" }}>
        <div style={styles.sidebarHeader}>
          <span style={styles.sidebarTitle}>SYSTEM OVERRIDE</span>
          <button onClick={() => setIsSidebarOpen(false)} style={styles.closeBtn}>✕</button>
        </div>
        
        <div style={styles.sidebarContent}>
          <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid #1e293b' }}>
            <button style={styles.fullResetBtn} onClick={restartGame}>
              FULL SYSTEM REBOOT
            </button>
          </div>
        </div>
      </div>

      {/* DASHBOARD */}
      <div style={styles.dashboard}>
         <div style={styles.headerContent}>
            <h1 style={{ ...styles.title, fontSize: isMobile ? "18px" : "24px" }}>BLOCK WORLD AI</h1>
            <div style={styles.statusBadge}>
                <div style={{
                    ...styles.statusDot,
                    backgroundColor: held ? "#eab308" : "#22c55e",
                    boxShadow: held ? "0 0 10px #eab308" : "0 0 10px #22c55e"
                }}/>
                <span>{held ? "ARM ACTIVE" : "SYSTEM READY"}</span>
            </div>
         </div>

         <button style={styles.settingsTrigger} onClick={() => setIsSidebarOpen(true)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
         </button>
      </div>

      <div style={styles.mainStack}>
        {/* HUD ZONE: Pulls up tightly against the Arm */}
        <div style={styles.goalZone}>
           <div style={{ ...styles.goalWrapper, transform: `scale(${hudScale})` }}>
             <div style={styles.sideStatLeft}>
               <span style={styles.modernLabel}>TIME</span>
               <div style={styles.modernStatBox}>
                 <span style={styles.neonTextYellow}>{formatTime(time)}</span>
               </div>
             </div>

             <div style={styles.goalInner}>
               <GoalState stacks={goal.map(toColors)} title="GOAL STATE" />
             </div>

             <div style={styles.sideStatRight}>
               <span style={styles.modernLabel}>MOVES</span>
               <div style={styles.modernStatBox}>
                 <span style={styles.neonTextBlue}>{moves.toString().padStart(3, '0')}</span>
               </div>
             </div>
           </div>
        </div>

        {/* WORKSPACE: Space-efficient grid */}
        <div style={styles.workspace}>
           <div style={{ ...styles.scaler, transform: `scale(${gameScale})` }}>
              <div style={styles.armZone}>
                 <div style={{
                    transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    transform: `translateX(${getArmOffset(armIdx, isMobile)}px)`
                 }}>
                    <Arm heldBlock={held ? ID_TO_COLOR[held] : null} />
                 </div>
              </div>
              <div style={styles.tubesZone}>
                 {stacks.map((stack, i) => (
                   <div key={i} onClick={() => handleTubeClick(i)} style={{ ...styles.interactWrapper, opacity: isMoving && armIdx !== i ? 0.7 : 1 }}>
                     <TestTube blocks={toColors(stack)} />
                     <div style={{ ...styles.tubeLabel, color: armIdx === i ? "#38bdf8" : "#475569" }}>STACK 0{i + 1}</div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {completed && <ResultModal time={time} moves={moves} onRestart={restartGame} />}
    </div>
  )
}

const styles = {
  page: { height: "100dvh", width: "100vw", backgroundColor: "#020617", display: "flex", flexDirection: "column", overflow: "hidden", fontFamily: "'Roboto Mono', monospace", position: 'relative' },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 100, backdropFilter: 'blur(2px)' },
  sidebar: { position: 'absolute', top: 0, width: '280px', height: '100%', backgroundColor: '#0f172a', zIndex: 101, transition: 'right 0.3s ease', display: 'flex', flexDirection: 'column', borderLeft: '1px solid #1e293b', boxShadow: '-10px 0 30px rgba(0,0,0,0.5)' },
  sidebarHeader: { padding: '20px', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  sidebarTitle: { color: '#38bdf8', fontSize: '12px', fontWeight: 'bold', letterSpacing: '2px' },
  closeBtn: { background: 'none', border: 'none', color: '#64748b', fontSize: '20px', cursor: 'pointer' },
  sidebarContent: { padding: '20px', display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 },
  configItem: { display: 'flex', flexDirection: 'column', gap: '8px' },
  configLabel: { fontSize: '9px', color: '#64748b', fontWeight: 'bold' },
  configBtn: { backgroundColor: '#1e293b', border: '1px solid #334155', color: '#f1f5f9', padding: '12px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', textAlign: 'center', transition: 'all 0.2s', letterSpacing: '1px' },
  fullResetBtn: { backgroundColor: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '12px', borderRadius: '4px', cursor: 'pointer', width: '100%', fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px' },
  
  dashboard: { backgroundColor: "rgba(15, 23, 42, 0.95)", borderBottom: "1px solid #1e293b", padding: "12px 20px", display: "flex", justifyContent: "center", alignItems: 'center', zIndex: 50, flexShrink: 0, position: 'relative' },
  settingsTrigger: { position: 'absolute', right: '20px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '8px', borderRadius: '50%', display: 'flex', transition: 'all 0.2s' },
  headerContent: { display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" },
  title: { margin: 0, color: "#f8fafc", textShadow: "0 0 15px rgba(56, 189, 248, 0.5)", fontWeight: "800", letterSpacing: "2px" },
  statusBadge: { display: "flex", alignItems: "center", gap: "8px", fontSize: "10px", color: "#94a3b8", backgroundColor: "rgba(30, 41, 59, 0.5)", padding: "4px 10px", borderRadius: "20px" },
  statusDot: { width: "6px", height: "6px", borderRadius: "50%" },
  
  mainStack: { display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" },
  goalZone: { width: "100%", padding: "10px 0", display: "flex", justifyContent: "center", flexShrink: 0 },
  goalWrapper: { display: "flex", alignItems: "center", gap: "16px" },
  sideStatLeft: { display: "flex", flexDirection: "column", alignItems: "flex-end", width: "80px" },
  sideStatRight: { display: "flex", flexDirection: "column", alignItems: "flex-start", width: "80px" },
  modernLabel: { fontSize: "20px", color: "#64748b", fontWeight: "bold" },
  modernStatBox: { backgroundColor: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(51, 65, 85, 0.5)", borderRadius: "8px", padding: "8px 0", width: "100%", textAlign: "center" },
  neonTextYellow: { color: "#facc15", fontSize: "20px", fontWeight: "bold" },
  neonTextBlue: { color: "#38bdf8", fontSize: "20px", fontWeight: "bold" },
  
  workspace: { flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "0px" },
  scaler: { display: "flex", flexDirection: "column", alignItems: "center", gap: "0px" },
  armZone: { height: "100px", width: "100%", display: "flex", justifyContent: "center", alignItems: "flex-end", marginBottom: "5px" },
  tubesZone: { display: "flex", gap: "30px", alignItems: "flex-end" },
  interactWrapper: { display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", transition: "all 0.3s" },
  tubeLabel: { fontSize: "11px", fontWeight: "bold", marginTop: "12px" }
}