import React, { useState, useEffect } from "react"
import Arm from "../components/Arm"
import TestTube from "../components/TestTube"
import GoalState from "../components/GoalState"
import ResultModal from "../components/ResultModal"
import "../App.css"

// --- CONSTANTS & HELPERS ---
const ID_TO_COLOR = {
  1: "#ef4444", 2: "#3b82f6", 3: "#22c55e", 
  4: "#eab308", 5: "#a855f7", 6: "#ec4899"
}
const toColors = (stack) => stack.map(id => ID_TO_COLOR[id])
const checkWin = (curr, goal) => JSON.stringify(curr) === JSON.stringify(goal);

const generateRandomState = () => {
  const blocks = [1, 2, 3, 4, 5, 6];
  for (let i = blocks.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [blocks[i], blocks[j]] = [blocks[j], blocks[i]];
  }
  const stacks = [[], [], []];
  blocks.forEach(block => {
    let inserted = false;
    let attempts = 0;
    while(!inserted && attempts < 10) {
      const r = Math.floor(Math.random() * 3);
      if (stacks[r].length < 4) {
        stacks[r].push(block);
        inserted = true;
      }
      attempts++;
    }
    if (!inserted) {
      const available = stacks.find(s => s.length < 4);
      if (available) available.push(block);
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
  
  // --- RESPONSIVE LOGIC ---
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024)
  
  useEffect(() => {
    restartGame();
    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const isMobile = width < 768;
  const hudScale = Math.min(width / 500, 0.9); // Dynamic scaling for the HUD
  const gameScale = isMobile ? Math.min(width / 420, 1) : 1;

  // --- TIMER ---
  useEffect(() => {
    if (completed) return;
    const interval = setInterval(() => setTime(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [completed]);

  // --- GAME LOGIC ---
  function handleTubeClick(i) {
    if (completed) return;
    const nextStacks = stacks.map(s => [...s])
    if (held === null) {
      if (nextStacks[i].length === 0) return;
      setHeld(nextStacks[i].pop());
    } else {
      if (nextStacks[i].length >= 4) return;
      nextStacks[i].push(held);
      setHeld(null);
      setMoves(m => m + 1);
      if (checkWin(nextStacks, goal)) setCompleted(true);
    }
    setStacks(nextStacks);
  }

  function restartGame() {
    setStacks([[1, 2, 3], [4, 5], [6]]); 
    setGoal(generateRandomState()); 
    setHeld(null);
    setMoves(0);
    setTime(0);
    setCompleted(false);
  }

  return (
    <div style={styles.page}>
      
      {/* 1. TOP HEADER */}
      <div style={styles.dashboard}>
         <div style={styles.headerContent}>
            <h1 style={{
                ...styles.title,
                fontSize: isMobile ? "20px" : "24px"
            }}>BLOCK WORLD AI</h1>
            
            <div style={styles.statusBadge}>
                <div style={{
                    ...styles.statusDot,
                    backgroundColor: held ? "#eab308" : "#22c55e",
                    boxShadow: held ? "0 0 10px #eab308" : "0 0 10px #22c55e"
                }}/>
                <span style={{ letterSpacing: "1px" }}>
                  {held ? "ARM ACTIVE" : "SYSTEM READY"}
                </span>
            </div>
         </div>
      </div>

      <div style={styles.mainStack}>
        
        {/* 2. HUD ZONE (Goal + Stats) */}
        <div style={styles.goalZone}>
           <div style={{
               ...styles.goalWrapper,
               transform: `scale(${hudScale})`
           }}>
             
             {/* LEFT STAT: TIME */}
             <div style={styles.sideStatLeft}>
               <span style={styles.modernLabel}>TIME ELAPSED</span>
               <div style={styles.modernStatBox}>
                 <span style={styles.neonTextYellow}>
                    {formatTime(time)}
                 </span>
               </div>
             </div>

             {/* CENTER: GOAL */}
             <div style={styles.goalInner}>
               <GoalState 
                  stacks={goal.map(toColors)} 
                  title="TARGET STATE" 
               />
             </div>

             {/* RIGHT STAT: STEPS */}
             <div style={styles.sideStatRight}>
               <span style={styles.modernLabel}>MOVES COUNT</span>
               <div style={styles.modernStatBox}>
                 <span style={styles.neonTextBlue}>
                    {moves.toString().padStart(3, '0')}
                 </span>
               </div>
             </div>

           </div>
        </div>

        {/* 3. WORKSPACE (Arm + Tubes) */}
        <div style={styles.workspace}>
           <div style={{ ...styles.scaler, transform: `scale(${gameScale})` }}>
              <div style={styles.armZone}>
                 <Arm heldBlock={held ? ID_TO_COLOR[held] : null} />
              </div>
              <div style={styles.tubesZone}>
                 {stacks.map((stack, i) => (
                   <div 
                      key={i} 
                      onClick={() => handleTubeClick(i)} 
                      style={styles.interactWrapper}
                   >
                     <TestTube blocks={toColors(stack)} />
                     <div style={styles.tubeLabel}>STACK 0{i + 1}</div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* 4. FOOTER */}
      <div style={styles.footerBar}>
        <button style={styles.resetBtn} onClick={restartGame}>
            INITIALIZE NEW SCENARIO
        </button>
      </div>

      {completed && <ResultModal time={time} moves={moves} onRestart={restartGame} />}
    </div>
  )
}

// --- STYLES ---
const styles = {
  page: { 
    height: "100vh", 
    width: "100vw",
    backgroundColor: "#020617", 
    display: "flex", 
    flexDirection: "column", 
    overflowY: "auto", 
    overflowX: "hidden",
    fontFamily: "'Roboto Mono', monospace" 
  },
  
  // Header
  dashboard: { 
    backgroundColor: "rgba(15, 23, 42, 0.95)", 
    borderBottom: "1px solid #1e293b", 
    padding: "16px 0",
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center", 
    zIndex: 50,
    flexShrink: 0,
    position: "sticky", 
    top: 0,
    backdropFilter: "blur(10px)"
  },
  headerContent: { display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" },
  title: { 
    margin: 0, 
    color: "#f8fafc", 
    textShadow: "0 0 15px rgba(56, 189, 248, 0.5)", 
    fontWeight: "800", 
    letterSpacing: "2px" 
  },
  statusBadge: { 
    display: "flex", 
    alignItems: "center", 
    gap: "8px", 
    fontSize: "10px", 
    color: "#94a3b8", 
    fontWeight: "bold",
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    padding: "4px 10px",
    borderRadius: "20px",
    border: "1px solid rgba(255,255,255,0.05)"
  },
  statusDot: { width: "6px", height: "6px", borderRadius: "50%", transition: "background-color 0.3s" },

  mainStack: { display: "flex", flexDirection: "column", flex: 1 },
  
  // Goal Zone (HUD)
  goalZone: { 
    width: "100%", 
    backgroundColor: "linear-gradient(180deg, #0b1221 0%, #020617 100%)", 
    borderBottom: "1px solid #1e293b", 
    padding: "16px 0", 
    zIndex: 40, 
    display: "flex", 
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
  },
  goalWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "16px", 
    transition: "transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)"
  },
  goalInner: {
    filter: "drop-shadow(0 0 20px rgba(59, 130, 246, 0.1))"
  },

  // Stats
  sideStatLeft: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end", // Align text towards center
    gap: "6px",
    width: "80px",
    animation: "fadeIn 0.6s ease-out forwards"
  },
  sideStatRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start", // Align text towards center
    gap: "6px",
    width: "80px",
    animation: "fadeIn 0.6s ease-out 0.2s forwards" // Slight delay
  },
  modernLabel: {
    fontSize: "9px",
    color: "#64748b",
    fontWeight: "bold",
    letterSpacing: "1px",
    textTransform: "uppercase"
  },
  modernStatBox: {
    backgroundColor: "rgba(15, 23, 42, 0.6)", 
    border: "1px solid rgba(51, 65, 85, 0.5)",
    borderRadius: "8px",
    padding: "8px 0",
    width: "100%",
    textAlign: "center",
    backdropFilter: "blur(4px)",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255,255,255,0.05)"
  },
  neonTextYellow: {
    color: "#facc15", 
    fontSize: "16px",
    fontWeight: "bold",
    textShadow: "0 0 10px rgba(250, 204, 21, 0.4)"
  },
  neonTextBlue: {
    color: "#38bdf8", 
    fontSize: "16px",
    fontWeight: "bold",
    textShadow: "0 0 10px rgba(56, 189, 248, 0.4)"
  },

  // Workspace
  workspace: { 
      flex: 1, 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      backgroundImage: "radial-gradient(circle at 50% 30%, #1e293b 0%, #020617 70%)", 
      position: "relative",
      padding: "40px 0"
  },
  scaler: { 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      transition: "transform 0.3s ease", 
      marginBottom: "20px"
  },
  armZone: { 
    height: "100px", 
    width: "100%", 
    marginBottom: "10px", 
    display: "flex", 
    justifyContent: "center", 
    alignItems: "flex-end", 
    position: "relative",
    filter: "drop-shadow(0 10px 15px rgba(0,0,0,0.5))"
  },
  tubesZone: { display: "flex", gap: "24px", alignItems: "flex-end", padding: "0 20px" },
  interactWrapper: { display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", cursor: "pointer", padding: "10px", margin: "-10px", transition: "transform 0.1s" },
  tubeLabel: { fontSize: "11px", color: "#475569", fontWeight: "bold", marginTop: "12px", letterSpacing: "1px" },
  
  // Footer
  footerBar: { 
      padding: "20px", 
      display: "flex", 
      justifyContent: "center", 
      backgroundColor: "#020617", 
      borderTop: "1px solid #1e293b",
      flexShrink: 0
  },
  resetBtn: { 
    backgroundColor: "transparent", 
    border: "1px solid #ef4444", 
    color: "#ef4444", 
    padding: "12px 24px", 
    borderRadius: "4px", 
    fontSize: "12px", 
    fontWeight: "bold", 
    letterSpacing: "1px",
    cursor: "pointer", 
    transition: "all 0.2s",
    textTransform: "uppercase",
    boxShadow: "0 0 15px rgba(239, 68, 68, 0.1)"
  }
}