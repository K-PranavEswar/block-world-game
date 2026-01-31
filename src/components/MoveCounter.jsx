import React from 'react';

export default function MoveCounter({ moves }) {
  return (
    <div style={styles.container}>
      {/* Label: Technical Uppercase */}
      <div style={styles.label}>STEPS</div>
      
      {/* Screen: The dark recessed area */}
      <div style={styles.screen}>
        {/* Value: The glowing digits */}
        {/* key={moves} triggers the animation every time the number changes */}
        <span key={moves} style={styles.value}>
          {String(moves).padStart(3, '0')}
        </span>
      </div>

      {/* Inline keyframes for the "pop" animation */}
      <style>
        {`
          @keyframes popIn {
            0% { transform: scale(1.2); opacity: 0.7; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
    </div>
  )
}

const styles = {
  container: {
    minWidth: "100px",
    padding: "12px",
    backgroundColor: "#0f172a", // Dark Slate (Panel Body)
    borderRadius: "12px",
    border: "1px solid #334155", // Metallic Edge
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px"
  },

  label: {
    fontSize: "10px",
    fontFamily: "'Courier New', Courier, monospace",
    fontWeight: "700",
    color: "#64748b", // Muted text
    letterSpacing: "1px",
    textTransform: "uppercase"
  },

  screen: {
    backgroundColor: "#000000", // Pure black screen
    width: "100%",
    padding: "4px 0",
    borderRadius: "6px",
    border: "1px solid #1e293b",
    // Inset shadow creates the "recessed" screen look
    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.5)", 
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden"
  },

  value: {
    fontSize: "24px",
    fontFamily: "'Courier New', Courier, monospace",
    fontWeight: "700",
    color: "#38bdf8", // Cyan Glow
    textShadow: "0 0 10px rgba(56, 189, 248, 0.5)", // The glowing light effect
    animation: "popIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
  }
}