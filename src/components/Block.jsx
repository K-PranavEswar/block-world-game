import React from 'react';

export default function Block({ color, label }) {
  return (
    <div
      style={{
        ...styles.block,
        backgroundColor: color,
      }}
    >
      {/* 1. Top Highlight (simulates light source) */}
      <div style={styles.highlight} />

      {/* 2. Label (1, 2, 3...) */}
      <span style={styles.label}>
        {label}
      </span>
    </div>
  )
}

const styles = {
  block: {
    position: "relative",
    width: "36px",
    height: "24px",
    margin: "4px auto",
    borderRadius: "4px",
    
    // 3D Bevel Effect
    boxShadow: `
      0 4px 6px rgba(0,0,0,0.3), 
      inset 0 1px 0 rgba(255,255,255,0.4), 
      inset 0 -2px 0 rgba(0,0,0,0.1)
    `,
    
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.2s ease",
    cursor: "pointer",
  },

  highlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
    background: "linear-gradient(to bottom, rgba(255,255,255,0.15), transparent)",
    borderRadius: "4px 4px 0 0",
    pointerEvents: "none"
  },

  // Style for the text inside the block
  label: {
    zIndex: 2, 
    fontSize: "12px",
    fontWeight: "800",
    fontFamily: "'Roboto Mono', monospace", 
    color: "rgba(0, 0, 0, 0.6)", // Dark, stamped look
    textShadow: "0 1px 0 rgba(255, 255, 255, 0.2)", 
    userSelect: "none", 
    pointerEvents: "none"
  }
}