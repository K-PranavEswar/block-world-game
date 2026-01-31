import React, { useState } from 'react';
import TestTube from "./TestTube";

export default function GoalSidebar({ 
  goal, 
  title = "GOAL STATE", 
  accentColor = "#10b981", // Default Emerald Green
  allowCollapse = true
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div style={styles.panel}>
      {/* Header: Clickable to toggle collapse */}
      <div 
        style={{
            ...styles.header,
            cursor: allowCollapse ? "pointer" : "default"
        }} 
        onClick={() => allowCollapse && setIsCollapsed(!isCollapsed)}
      >
        <div style={styles.headerLeft}>
            {/* Status Dot: Changes based on accentColor */}
            <div style={{
                ...styles.statusDot,
                backgroundColor: accentColor,
                boxShadow: `0 0 8px ${accentColor}`
            }} />
            <h3 style={styles.title}>{title}</h3>
        </div>

        {/* Toggle Button (Only shows if allowCollapse is true) */}
        {allowCollapse && (
            <button style={styles.toggleButton}>
                {isCollapsed ? "[ + ]" : "[ − ]"}
            </button>
        )}
      </div>

      <div style={styles.divider} />

      {/* The Goal Grid: Animated Height */}
      <div style={{
          ...styles.contentContainer,
          maxHeight: isCollapsed ? "0px" : "500px", // Animate max-height
          opacity: isCollapsed ? 0 : 1,
          marginTop: isCollapsed ? "0" : "8px"
      }}>
        <div style={styles.tubeGrid}>
            {goal.map((tube, index) => (
            <div key={index} style={styles.tubeWrapper}>
                <TestTube
                    blocks={tube}
                    disabled={true}
                    small={true}
                />
                <div style={styles.tubeLabel}>{index + 1}</div>
            </div>
            ))}
        </div>
      </div>

      {/* Footer message (Hidden when collapsed) */}
      {!isCollapsed && (
          <div style={styles.footerDetails}>MATCH PENDING</div>
      )}
    </div>
  );
}

const styles = {
  panel: {
    width: "100%",
    backgroundColor: "#0f172a",
    borderRadius: "12px",
    border: "1px solid #334155",
    padding: "16px",
    boxSizing: "border-box",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
    display: "flex",
    flexDirection: "column",
    transition: "all 0.3s ease", // Smooth transition for height changes
    overflow: "hidden" // Important for collapse animation
  },

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between", // Pushes toggle button to right
    marginBottom: "4px",
    userSelect: "none"
  },

  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },

  statusDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    transition: "background-color 0.3s ease"
  },

  title: {
    margin: 0,
    fontSize: "13px",
    fontFamily: "'Roboto Mono', monospace",
    fontWeight: "700",
    color: "#94a3b8",
    letterSpacing: "1.5px",
    textTransform: "uppercase"
  },

  // The Tech-style Toggle Button
  toggleButton: {
    background: "none",
    border: "none",
    color: "#64748b",
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "12px",
    fontWeight: "bold",
    cursor: "pointer",
    padding: "4px",
    transition: "color 0.2s"
  },

  divider: {
    width: "100%",
    height: "1px",
    backgroundColor: "#334155",
    margin: "4px 0" // Tight spacing for cleaner collapse
  },

  // Container to handle the slide animation
  contentContainer: {
    transition: "max-height 0.4s ease, opacity 0.3s ease, margin 0.3s ease",
    overflow: "hidden" // Hides content as it shrinks
  },

  tubeGrid: {
    display: "flex",
    flexWrap: "nowrap", // Horizontal scroll usually better for goals
    overflowX: "auto",  // Allow scroll if many goals
    justifyContent: "flex-start",
    gap: "12px",
    padding: "4px 0",
    scrollbarWidth: "none" // Hides scrollbar for Firefox
  },

  tubeWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
    minWidth: "50px" // Ensures tubes don't squish
  },

  tubeLabel: {
    fontSize: "11px",
    color: "#64748b",
    fontFamily: "'Roboto Mono', monospace",
    fontWeight: "bold"
  },
  
  footerDetails: {
    fontSize: "10px",
    textAlign: "right",
    color: "#475569",
    marginTop: "8px",
    fontFamily: "'Roboto Mono', monospace"
  }
};