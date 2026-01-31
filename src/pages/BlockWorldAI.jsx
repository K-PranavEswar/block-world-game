import React, { useState, useEffect } from "react"
import Arm from "../components/Arm"
import TestTube from "../components/TestTube"
import GoalState from "../components/GoalState"
import ResultModal from "../components/ResultModal"

const ID_TO_COLOR = {
  1: "#ef4444", 2: "#3b82f6", 3: "#22c55e",
  4: "#eab308", 5: "#a855f7", 6: "#ec4899",
}

const toColors = (stack) => stack.map((id) => ID_TO_COLOR[id])

const checkWin = (curr, goal) => {
  if (!goal || goal.length === 0) return false
  return JSON.stringify(curr) === JSON.stringify(goal)
}

const getArmOffset = (index, isMobile) => {
  const gap = isMobile ? 80 : 120
  return (index - 1) * gap
}

const generateRandomState = () => {
  const blocks = [1, 2, 3, 4, 5, 6]
  for (let i = blocks.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[blocks[i], blocks[j]] = [blocks[j], blocks[i]]
  }
  const stacks = [[], [], []]
  blocks.forEach((block) => {
    let inserted = false
    while (!inserted) {
      const r = Math.floor(Math.random() * 3)
      if (stacks[r].length < 4) {
        stacks[r].push(block)
        inserted = true
      }
    }
  })
  return stacks
}

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0")
  const s = (seconds % 60).toString().padStart(2, "0")
  return `${m}:${s}`
}

const styles = {
  page: {
    height: "100dvh", width: "100vw", backgroundColor: "#020617",
    display: "flex", flexDirection: "column", overflow: "hidden",
    fontFamily: "'Roboto Mono', monospace", position: "relative", color: "#f8fafc",
  },
  overlay: {
    position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.6)",
    zIndex: 100, backdropFilter: "blur(4px)", transition: "opacity 0.3s",
  },
  sidebar: {
    position: "absolute", top: 0, width: "320px", height: "100%",
    backgroundColor: "#0f172a", zIndex: 101, transition: "right 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    display: "flex", flexDirection: "column", borderLeft: "1px solid #1e293b",
    boxShadow: "-15px 0 35px rgba(0,0,0,0.6)",
  },
  sidebarHeader: {
    padding: "24px", borderBottom: "1px solid #1e293b",
    display: "flex", justifyContent: "space-between", alignItems: "center",
  },
  logScroll: {
    padding: "12px", overflowY: "auto", flex: 1,
    display: "flex", flexDirection: "column", gap: "8px",
  },
  logLine: {
    fontSize: "11px", display: "flex", flexDirection: "column",
    gap: "2px", borderLeft: "2px solid #38bdf8", paddingLeft: "8px",
    paddingY: "4px", backgroundColor: "rgba(56, 189, 248, 0.05)",
  },
  dashboard: {
    backgroundColor: "#0f172a", borderBottom: "1px solid #1e293b",
    padding: "15px 24px", display: "flex", justifyContent: "center",
    alignItems: "center", position: "relative",
  },
  settingsTrigger: {
    position: "absolute", right: "24px", background: "none",
    border: "1px solid #38bdf8", color: "#38bdf8", cursor: "pointer",
    padding: "6px 12px", borderRadius: "4px", fontSize: "10px", fontWeight: "bold"
  },
  mainStack: { display: "flex", flexDirection: "column", flex: 1 },
  workspace: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center" },
  tubeInteraction: { display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer" },
}

export default function BlockWorldAI() {
  const [stacks, setStacks] = useState([[1, 2, 3], [4, 5], [6]])
  const [goal, setGoal] = useState(() => generateRandomState())
  const [held, setHeld] = useState(null)
  const [moves, setMoves] = useState(0)
  const [time, setTime] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [armIdx, setArmIdx] = useState(1)
  const [isMoving, setIsMoving] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [history, setHistory] = useState([])
  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (completed || moves === 0) return
    const interval = setInterval(() => setTime((t) => t + 1), 1000)
    return () => clearInterval(interval)
  }, [completed, moves])

  const logAction = (action) => {
    const timestamp = new Date().toLocaleTimeString("en-GB", { hour12: false })
    setHistory((h) => [{ timestamp, action }, ...h].slice(0, 50))
  }

  const handleTubeClick = (i) => {
    if (completed || isMoving || isSidebarOpen) return
    setArmIdx(i)
    setIsMoving(true)

    setTimeout(() => {
      const nextStacks = stacks.map((s) => [...s])
      const targetStack = nextStacks[i]

      if (held === null) {
        if (targetStack.length > 0) {
          const blockId = targetStack.pop()
          const belowBlock = targetStack.length > 0 ? targetStack[targetStack.length - 1] : "TABLE"
          setHeld(blockId)
          
          if (belowBlock === "TABLE") {
            logAction(`PICKUP(${blockId})`)
          } else {
            logAction(`UNSTACK(${blockId}, ${belowBlock})`)
          }
        }
      } else {
        if (targetStack.length < 4) {
          const blockBelow = targetStack.length > 0 ? targetStack[targetStack.length - 1] : "TABLE"
          targetStack.push(held)
          
          if (blockBelow === "TABLE") {
            logAction(`PUTDOWN(${held})`)
          } else {
            logAction(`STACK(${held}, ${blockBelow})`)
          }

          setHeld(null)
          setMoves((m) => m + 1)
          if (checkWin(nextStacks, goal)) {
            setCompleted(true)
            logAction("SYSTEM_EVENT: GOAL_REACHED")
          }
        }
      }

      setStacks(nextStacks)
      setIsMoving(false)
    }, 400)
  }

  const isMobile = width < 768
  const hudScale = isMobile ? 0.8 : 0.9
  const gameScale = isMobile ? 0.85 : 1

  return (
    <div style={styles.page}>
      {isSidebarOpen && <div style={styles.overlay} onClick={() => setIsSidebarOpen(false)} />}
      
      <div style={{ ...styles.sidebar, right: isSidebarOpen ? "0" : "-320px" }}>
        <div style={styles.sidebarHeader}>
          <span style={{ fontSize: "11px", fontWeight: "bold", letterSpacing: "2px", color: "#38bdf8" }}>ACTION LOG</span>
          <button onClick={() => setIsSidebarOpen(false)} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: "16px" }}>✕</button>
        </div>
        <div style={styles.logScroll}>
          {history.map((item, idx) => (
            <div key={idx} style={styles.logLine}>
              <span style={{ fontSize: "9px", color: "#475569" }}>[{item.timestamp}]</span>
              <span style={{ color: "#38bdf8", fontWeight: "bold" }}>{item.action}</span>
            </div>
          ))}
        </div>
        <div style={{ padding: "20px", borderTop: "1px solid #1e293b" }}>
          <button onClick={() => window.location.reload()} style={{ width: "100%", padding: "12px", background: "none", border: "1px solid #ef4444", color: "#ef4444", fontSize: "10px", fontWeight: "bold", cursor: "pointer" }}>RESET SYSTEM</button>
        </div>
      </div>

      <div style={styles.dashboard}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <h1 style={{ margin: 0, fontSize: "16px", letterSpacing: "4px", fontWeight: "900" }}>BLOCK WORLD AI</h1>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "10px", color: held ? "#eab308" : "#22c55e" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: held ? "#eab308" : "#22c55e" }} />
            <span>{held ? "EXECUTING" : "IDLE"}</span>
          </div>
        </div>
        <button style={styles.settingsTrigger} onClick={() => setIsSidebarOpen(true)}>VIEW LOGS</button>
      </div>

      <div style={styles.mainStack}>
        <div style={{ padding: "20px 0", display: "flex", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "30px", transform: `scale(${hudScale})` }}>
            <div style={{ textAlign: "center", minWidth: "80px" }}>
              <div style={{ fontSize: "20px", color: "#475569", fontWeight: "bold" }}>TIMER</div>
              <div style={{ fontSize: "20px", color: "#38bdf8", fontWeight: "bold" }}>{formatTime(time)}</div>
            </div>
            <GoalState stacks={goal.map(toColors)} title="GOAL STATE" />
            <div style={{ textAlign: "center", minWidth: "80px" }}>
              <div style={{ fontSize: "20px", color: "#475569", fontWeight: "bold" }}>MOVES</div>
              <div style={{ fontSize: "20px", color: "#38bdf8", fontWeight: "bold"}}>{moves.toString().padStart(3, '0')}</div>
            </div>
          </div>
        </div>

        <div style={styles.workspace}>
          <div style={{ transform: `scale(${gameScale})`, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ height: "100px", display: "flex", justifyContent: "center", alignItems: "flex-end", marginBottom: "15px" }}>
              <div style={{ transform: `translateX(${getArmOffset(armIdx, isMobile)}px)`, transition: "transform 0.4s" }}>
                <Arm heldBlock={held ? ID_TO_COLOR[held] : null} />
              </div>
            </div>

            <div style={{ display: "flex", gap: "30px", alignItems: "flex-end" }}>
              {stacks.map((stack, i) => (
                <div key={i} onClick={() => handleTubeClick(i)} style={styles.tubeInteraction}>
                  <TestTube blocks={toColors(stack)} />
                  <span style={{ fontSize: "10px", marginTop: "12px", color: armIdx === i ? "#38bdf8" : "#475569", fontWeight: "bold" }}>STACK {i}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {completed && <ResultModal time={time} moves={moves} onRestart={() => window.location.reload()} />}
    </div>
  )
}