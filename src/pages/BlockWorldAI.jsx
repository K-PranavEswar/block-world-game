import React, { useState, useEffect } from "react"
import Arm from "../components/Arm"
import TestTube from "../components/TestTube"
import GoalState from "../components/GoalState"
import Timer from "../components/Timer"
import MoveCounter from "../components/MoveCounter"
import ResultModal from "../components/ResultModal"
import "../app.css"

const ID_TO_COLOR = {
  1: "#ef4444", 2: "#3b82f6", 3: "#22c55e", 
  4: "#eab308", 5: "#a855f7", 6: "#ec4899"
}
const toColors = (stack) => stack.map(id => ID_TO_COLOR[id])
const checkWin = (curr, goal) => JSON.stringify(curr) === JSON.stringify(goal);

// --- RANDOMIZER LOGIC ---
const generateRandomState = () => {
  const blocks = [1, 2, 3, 4, 5, 6];
  
  // Fisher-Yates Shuffle
  for (let i = blocks.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [blocks[i], blocks[j]] = [blocks[j], blocks[i]];
  }

  // Distribute into 3 stacks
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

export default function BlockWorldAI() {
  const [stacks, setStacks] = useState([[1, 2, 3], [4, 5], [6]]) 
  const [goal, setGoal] = useState(generateRandomState()) 
  
  const [held, setHeld] = useState(null)
  const [moves, setMoves] = useState(0)
  const [time, setTime] = useState(0)
  const [completed, setCompleted] = useState(false)

  const [width, setWidth] = useState(window.innerWidth)
  
  useEffect(() => {
    restartGame();
    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Mobile Breakpoint
  const isMobile = width < 768;
  const gameScale = isMobile ? Math.min(width / 420, 1) : 1; // Slightly adjusted scale divisor

  useEffect(() => {
    if (completed) return;
    const interval = setInterval(() => setTime(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [completed]);

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
      
      {/* HEADER: Updated with dynamic styles for mobile */}
      <div style={{
          ...styles.dashboard,
          flexDirection: isMobile ? "column" : "row",
          padding: isMobile ? "12px 16px" : "12px 24px",
          gap: isMobile ? "12px" : "0",
          height: "auto"
      }}>
         <div style={{
             ...styles.headerLeft,
             alignItems: isMobile ? "center" : "flex-start",
             width: isMobile ? "100%" : "auto"
         }}>
            <h1 style={{
                ...styles.title,
                fontSize: isMobile ? "20px" : "22px"
            }}>BLOCK WORLD AI</h1>
            <div style={styles.statusBadge}>
                <div style={{
                    ...styles.statusDot,
                    backgroundColor: held ? "#eab308" : "#22c55e",
                    boxShadow: held ? "0 0 8px #eab308" : "0 0 8px #22c55e"
                }}/>
                {held ? "ARM ACTIVE" : "SYSTEM READY"}
            </div>
         </div>

         <div style={{
             ...styles.statsRow,
             marginLeft: isMobile ? "0" : "auto",
             justifyContent: "center",
             width: isMobile ? "100%" : "auto"
         }}>
            <Timer time={time} />
            <MoveCounter moves={moves} />
         </div>
      </div>

      <div style={styles.mainStack}>
        
        {/* GOAL ZONE */}
        <div style={styles.goalZone}>
           <div style={styles.goalInner}>
             <GoalState 
                stacks={goal.map(toColors)} 
                title="GOAL STATE" 
             />
           </div>
        </div>

        {/* WORKSPACE */}
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
                     <div style={styles.tubeLabel}>STACK {i + 1}</div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      <div style={styles.footerBar}>
        <button style={styles.resetBtn} onClick={restartGame}>
            GENERATE NEW SCENARIO
        </button>
      </div>

      {completed && <ResultModal time={time} moves={moves} onRestart={restartGame} />}
    </div>
  )
}

const styles = {
  page: { height: "100vh", backgroundColor: "#020617", display: "flex", flexDirection: "column", overflow: "hidden" },
  
  // Dashboard base styles (Dynamic parts handled inline above)
  dashboard: { 
    backgroundColor: "#0f172a", 
    borderBottom: "1px solid #1e293b", 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center", 
    zIndex: 50,
    flexShrink: 0 
  },
  
  headerLeft: { display: "flex", flexDirection: "column", gap: "6px" },
  title: { margin: 0, fontFamily: "'Roboto Mono', monospace", color: "#ffffff", textShadow: "0 0 12px rgba(56, 189, 248, 0.6)", fontWeight: "800", letterSpacing: "1px" },
  statusBadge: { display: "flex", alignItems: "center", gap: "8px", fontSize: "10px", fontFamily: "'Roboto Mono', monospace", color: "#94a3b8", fontWeight: "bold" },
  statusDot: { width: "6px", height: "6px", borderRadius: "50%", transition: "background-color 0.3s" },
  statsRow: { display: "flex", gap: "12px" },

  mainStack: { display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" },
  
  goalZone: { 
    width: "100%", 
    backgroundColor: "#0b1221", 
    borderBottom: "1px solid #1e293b", 
    padding: "10px 10px 0px 10px", 
    zIndex: 40, 
    display: "flex", 
    justifyContent: "center",
    overflow: "hidden" 
  },
  goalInner: { 
    width: "100%", 
    maxWidth: "800px", 
    display: "flex", 
    justifyContent: "center",
    transform: "scale(0.85)",
    transformOrigin: "center"
  },

  workspace: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", backgroundImage: "radial-gradient(circle at 50% 80%, #1e293b 0%, #020617 60%)", overflow: "hidden" },
  
  scaler: { 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center", 
    transition: "transform 0.3s ease", 
    marginBottom: "40px",
    marginTop: "0px" 
  },
  
  armZone: { 
    height: "100px", 
    width: "100%", 
    marginBottom: "10px", 
    display: "flex", 
    justifyContent: "center", 
    alignItems: "flex-end", 
    position: "relative" 
  },
  
  tubesZone: { display: "flex", gap: "24px", alignItems: "flex-end", padding: "0 20px" },
  interactWrapper: { display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", cursor: "pointer", padding: "10px", margin: "-10px" },
  tubeLabel: { fontFamily: "'Roboto Mono', monospace", fontSize: "12px", color: "#475569", fontWeight: "bold", marginTop: "10px" },
  footerBar: { padding: "10px", display: "flex", justifyContent: "center", backgroundColor: "#020617", borderTop: "1px solid #1e293b" },
  resetBtn: { backgroundColor: "transparent", border: "1px solid #ef4444", color: "#ef4444", padding: "8px 16px", borderRadius: "6px", fontFamily: "'Roboto Mono', monospace", fontSize: "11px", fontWeight: "bold", cursor: "pointer", transition: "all 0.2s" }
}