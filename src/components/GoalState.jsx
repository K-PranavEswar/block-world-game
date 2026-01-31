import React from 'react';
import TestTube from "./TestTube";

// Configuration for mapping IDs to colors (Matches BlockWorldAI)
const ID_TO_COLOR = {
  1: "#ef4444", // Red
  2: "#3b82f6", // Blue
  3: "#22c55e", // Green
  4: "#eab308", // Yellow
  5: "#a855f7", // Purple
  6: "#ec4899"  // Pink
};

// Helper: If stack contains numbers, convert to colors. If already colors, pass through.
const normalizeStack = (stack) => {
  return stack.map(block => ID_TO_COLOR[block] || block);
};

export default function GoalState({ stacks, title = "TARGET SEQUENCE" }) {
  return (
    <div style={styles.container}>
      {/* Header Section */}
      <div style={styles.header}>
        <div style={styles.statusDot} />
        <h3 style={styles.title}>{title}</h3>
      </div>
      
      <div style={styles.divider} />

      {/* Stacks Visualization */}
      <div style={styles.grid}>
        {stacks.map((stack, i) => (
          <div key={i} style={styles.stackWrapper}>
             {/* Reusing TestTube for consistent visuals */}
             <TestTube 
                blocks={normalizeStack(stack)} 
                disabled={true} 
                small={true} // Use the smaller, compact version
             />
             {/* Numeric Label */}
             <div style={styles.label}>{i + 1}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#0f172a", // Dark Slate Panel
    border: "1px solid #334155", // Metallic Border
    borderRadius: "12px",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
    width: "fit-content",
    margin: "0 auto",
    minWidth: "280px"
  },

  header: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "8px",
    width: "100%",
    justifyContent: "center"
  },

  // Blue "Target" Indicator
  statusDot: {
    width: "8px",
    height: "8px",
    backgroundColor: "#3b82f6", 
    borderRadius: "50%",
    boxShadow: "0 0 8px #3b82f6"
  },

  title: {
    margin: 0,
    color: "#94a3b8",
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "14px",
    letterSpacing: "1.5px",
    fontWeight: "700",
    textTransform: "uppercase"
  },

  divider: {
    width: "100%",
    height: "1px",
    backgroundColor: "#334155",
    marginBottom: "16px",
    opacity: 0.5
  },

  grid: {
    display: "flex",
    alignItems: "flex-end",
    gap: "16px",
    justifyContent: "center"
  },

  stackWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px"
  },

  label: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "12px",
    color: "#64748b",
    fontWeight: "bold"
  }
};