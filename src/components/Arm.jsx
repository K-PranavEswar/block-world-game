import React from 'react';
import PropTypes from 'prop-types';
import Block from './Block'; // Import the 3D Block component

// Map Colors to Labels so the Arm displays "1", "2", etc.
const COLOR_TO_LABEL = {
  "#ef4444": "1", // Red
  "#3b82f6": "2", // Blue
  "#22c55e": "3", // Green
  "#eab308": "4", // Yellow
  "#a855f7": "5", // Purple
  "#ec4899": "6"  // Pink
};

export default function Arm({ heldBlock }) {
  // Determine if the claw should be closed (holding) or open
  const isHolding = Boolean(heldBlock);
  
  // Get the label (1-6) if holding a block
  const label = isHolding ? (COLOR_TO_LABEL[heldBlock] || "?") : "";

  return (
    <div style={styles.armContainer}>
      {/* 1. The Piston/Rod (The main arm shaft) */}
      <div style={styles.piston}>
        <div style={styles.pistonDetail} />
      </div>

      {/* 2. The Mechanical Joint (The wrist) */}
      <div style={styles.wrist}>
         {/* Status Light: Green if holding, Red if idle */}
        <div style={{
            ...styles.statusLight,
            backgroundColor: isHolding ? '#4ade80' : '#f87171',
            boxShadow: isHolding ? '0 0 8px #4ade80' : 'none'
        }} />
      </div>

      {/* 3. The Left Gripper (Animates) */}
      <div style={{
        ...styles.gripper,
        ...styles.gripperLeft,
        transform: isHolding ? 'rotate(0deg) translateX(0px)' : 'rotate(-25deg) translateX(-5px)',
      }} />

      {/* 4. The Right Gripper (Animates) */}
      <div style={{
        ...styles.gripper,
        ...styles.gripperRight,
        transform: isHolding ? 'rotate(0deg) translateX(0px)' : 'rotate(25deg) translateX(5px)',
      }} />

      {/* 5. The Held Block */}
      <div
        style={{
          ...styles.blockContainer,
          opacity: isHolding ? 1 : 0,
          transform: isHolding ? 'translateY(0)' : 'translateY(20px)',
        }}
      >
        {isHolding && (
          // Use the actual Block component to match the tubes
          <Block color={heldBlock} label={label} />
        )}
      </div>
    </div>
  );
}

Arm.propTypes = {
  heldBlock: PropTypes.string,
};

// --- Styles ---
const styles = {
  armContainer: {
    position: "relative",
    width: "100px", // Slightly wider to accommodate the 3D block
    height: "100px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    transition: "all 0.3s ease"
  },

  // The main metallic rod
  piston: {
    width: "14px",
    height: "35px",
    background: "linear-gradient(90deg, #475569 0%, #94a3b8 50%, #475569 100%)", // Darker metal
    border: "1px solid #334155",
    borderBottom: "none",
    position: "relative",
    zIndex: 2,
    boxShadow: "inset 0 2px 5px rgba(0,0,0,0.5)"
  },
  
  pistonDetail: {
    width: "4px",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.2)",
    margin: "0 auto",
    borderLeft: "1px solid rgba(255,255,255,0.1)",
    borderRight: "1px solid rgba(255,255,255,0.1)"
  },

  // The 'wrist' connecting rod to claws
  wrist: {
    width: "40px",
    height: "14px",
    backgroundColor: "#1e293b", // Darker Slate
    borderRadius: "4px",
    zIndex: 3,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 6px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
    border: "1px solid #334155"
  },

  statusLight: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    transition: "background-color 0.2s ease, box-shadow 0.2s ease"
  },

  // Shared gripper styles
  gripper: {
    position: "absolute",
    top: "44px", // Adjusted for new sizing
    width: "10px",
    height: "32px",
    backgroundColor: "#64748b",
    borderRadius: "0 0 4px 4px",
    border: "1px solid #334155",
    transformOrigin: "top center",
    transition: "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    zIndex: 4
  },

  gripperLeft: {
    left: "32px", // Adjusted to hug the 36px block
    borderTopRightRadius: "0",
    borderRight: "none" // Seamless join with wrist
  },

  gripperRight: {
    right: "32px", // Adjusted to hug the 36px block
    borderTopLeftRadius: "0",
    borderLeft: "none"
  },

  // Container to handle block entry animation
  blockContainer: {
    position: "absolute",
    top: "42px", // Hangs the block just below the wrist
    zIndex: 1, // Behind the grippers visually
    transition: "all 0.3s ease",
    // We don't apply width here to let the Block component determine it
  }
};