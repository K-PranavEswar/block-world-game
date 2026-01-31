import React from 'react';

export default function ResultModal({ time, moves, onRestart }) {
  // Determine Rank and Color Theme
  let title = "KEEP PRACTICING";
  let themeColor = "#94a3b8"; // Gray

  if (time <= 120) {
    title = "UNSTOPPABLE 🏆";
    themeColor = "#fbbf24"; // Gold
  } else if (time <= 240) {
    title = "PANDA STYLE 🐼";
    themeColor = "#4ade80"; // Green
  } else if (time <= 360) {
    title = "SLOW & STEADY 🐢";
    themeColor = "#60a5fa"; // Blue
  }

  // Helper to format time as MM:SS
  const formattedTime = `${Math.floor(time / 60)}:${String(time % 60).padStart(2, "0")}`;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        
        {/* Header Section */}
        <h2 style={{ ...styles.title, color: themeColor }}>
          {title}
        </h2>
        
        <div style={styles.divider} />

        {/* Stats Grid */}
        <div style={styles.statsContainer}>
          {/* Time Stat */}
          <div style={styles.statBox}>
            <span style={styles.statLabel}>DURATION</span>
            <span style={styles.statValue}>{formattedTime}</span>
          </div>

          {/* Moves Stat */}
          <div style={styles.statBox}>
            <span style={styles.statLabel}>OPERATIONS</span>
            <span style={styles.statValue}>{moves}</span>
          </div>
        </div>

        {/* Action Button */}
        <button 
          style={styles.button} 
          onClick={onRestart}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#38bdf8";
            e.currentTarget.style.boxShadow = "0 0 12px rgba(56, 189, 248, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#0ea5e9";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          INITIALIZE RESTART
        </button>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    backdropFilter: "blur(4px)", // Blurs the game behind the modal
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999
  },

  modal: {
    backgroundColor: "#0f172a", // Dark Slate
    border: "1px solid #334155",
    padding: "32px",
    borderRadius: "16px",
    textAlign: "center",
    minWidth: "320px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    animation: "fadeIn 0.3s ease-out"
  },

  title: {
    margin: "0",
    fontSize: "24px",
    fontFamily: "'Courier New', Courier, monospace",
    fontWeight: "800",
    letterSpacing: "1px",
    textTransform: "uppercase",
    textShadow: "0 2px 4px rgba(0,0,0,0.5)"
  },

  divider: {
    width: "100%",
    height: "1px",
    backgroundColor: "#334155",
    margin: "4px 0"
  },

  statsContainer: {
    display: "flex",
    gap: "16px",
    justifyContent: "center"
  },

  statBox: {
    flex: 1,
    backgroundColor: "#1e293b",
    padding: "12px",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    border: "1px solid #334155"
  },

  statLabel: {
    fontSize: "10px",
    color: "#94a3b8",
    fontWeight: "700",
    letterSpacing: "1px",
    textTransform: "uppercase"
  },

  statValue: {
    fontSize: "20px",
    color: "#f8fafc",
    fontFamily: "'Courier New', Courier, monospace",
    fontWeight: "bold"
  },

  button: {
    marginTop: "8px",
    padding: "12px 24px",
    backgroundColor: "#0ea5e9", // Sky Blue
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontFamily: "'Courier New', Courier, monospace",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.2s ease",
    textTransform: "uppercase",
    letterSpacing: "1px"
  }
}

// Add keyframes for modal entry
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(styleSheet);