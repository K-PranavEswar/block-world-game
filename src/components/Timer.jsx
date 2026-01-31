import React from 'react';

export default function Timer({ time }) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <div style={styles.container}>
      <div style={styles.label}>TIME</div>
      
      <div style={styles.screen}>
        {/* Minutes */}
        <span style={styles.digit}>
          {String(minutes).padStart(2, '0')}
        </span>

        {/* Blinking Colon */}
        <span style={styles.colon}>:</span>

        {/* Seconds */}
        <span style={styles.digit}>
          {String(seconds).padStart(2, '0')}
        </span>
      </div>

      {/* Animation Style */}
      <style>
        {`
          @keyframes blink {
            0%, 100% { opacity: 1; text-shadow: 0 0 10px rgba(251, 191, 36, 0.5); }
            50% { opacity: 0.2; text-shadow: none; }
          }
        `}
      </style>
    </div>
  )
}

const styles = {
  container: {
    minWidth: "110px", // Slightly wider for the 00:00 format
    padding: "12px",
    backgroundColor: "#0f172a", // Dark Slate Panel
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
    color: "#64748b",
    letterSpacing: "1px",
    textTransform: "uppercase"
  },

  screen: {
    backgroundColor: "#000000",
    width: "100%",
    padding: "4px 0",
    borderRadius: "6px",
    border: "1px solid #1e293b",
    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.5)", // Recessed look
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Courier New', Courier, monospace", // Fixed width font
    fontSize: "24px",
    fontWeight: "700",
    color: "#fbbf24", // Amber / Gold color
    letterSpacing: "2px"
  },

  digit: {
    // Constant glow
    textShadow: "0 0 10px rgba(251, 191, 36, 0.5)", 
  },

  colon: {
    margin: "0 2px",
    animation: "blink 1s step-end infinite", // The heartbeat effect
    color: "#fbbf24"
  }
}