import React from 'react';
import Block from "./Block";

const COLOR_TO_LABEL = {
  "#ef4444": "1", 
  "#3b82f6": "2", 
  "#22c55e": "3", 
  "#eab308": "4", 
  "#a855f7": "5", 
  "#ec4899": "6"
};

export default function TestTube({ blocks, onClick, disabled, small }) {
  const isInteractive = !disabled;
  
  return (
    <div
      style={{
        ...styles.container,
        ...(small ? styles.smallContainer : {}),
        cursor: isInteractive ? "pointer" : "default",
        opacity: disabled && !small ? 0.8 : 1 
      }}
      onClick={isInteractive ? onClick : undefined}
    >
      {/* 1. The Glass Vessel */}
      <div style={{
        ...styles.glass,
        ...(small ? styles.smallGlass : {})
      }}>
        
        {!small && (
           <div style={styles.markersContainer}>
             <div style={styles.marker} />
             <div style={styles.marker} />
             <div style={styles.marker} />
           </div>
        )}

        {/* 2. The Blocks */}
        <div style={styles.inner}>
          {blocks.map((color, index) => {
            const label = COLOR_TO_LABEL[color] || "?";
            return (
              <div key={index} style={{ zIndex: 10 }}>
                <Block color={color} label={label} />
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. The Metallic Base */}
      <div style={{
        ...styles.base,
        ...(small ? styles.smallBase : {})
      }}>
        <div style={styles.baseHighlight} />
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    transition: "transform 0.2s ease",
    position: "relative",
    touchAction: "manipulation", 
  },
  
  smallContainer: {},

  glass: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end", 
    width: "70px",
    height: "200px",
    backgroundColor: "rgba(255, 255, 255, 0.05)", 
    borderLeft: "2px solid rgba(255, 255, 255, 0.2)",
    borderRight: "2px solid rgba(255, 255, 255, 0.2)",
    borderBottom: "4px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "0 0 24px 24px",
    boxShadow: "inset 0 0 15px rgba(0, 0, 0, 0.2)",
    paddingBottom: "4px",
    overflow: "hidden"
  },

  // UPDATED HEIGHT HERE
  smallGlass: {
    width: "46px",
    height: "150px", // Increased to fit 5 blocks (5 * 24px + margins)
    borderLeft: "1px solid rgba(255, 255, 255, 0.15)",
    borderRight: "1px solid rgba(255, 255, 255, 0.15)",
    borderBottom: "2px solid rgba(255, 255, 255, 0.15)",
    borderRadius: "0 0 12px 12px"
  },

  inner: {
    display: "flex",
    flexDirection: "column-reverse", 
    justifyContent: "flex-start",
    width: "100%",
    paddingBottom: "2px",
    alignItems: "center"
  },

  base: {
    width: "80px",
    height: "12px",
    marginTop: "2px",
    backgroundColor: "#334155", 
    borderRadius: "6px",
    borderTop: "1px solid #475569",
    boxShadow: "0 4px 6px rgba(0,0,0,0.4)",
    position: "relative",
    overflow: "hidden"
  },

  smallBase: {
    width: "50px",
    height: "8px",
    borderRadius: "4px"
  },

  baseHighlight: {
    width: "100%",
    height: "50%",
    backgroundColor: "rgba(255,255,255,0.1)",
    position: "absolute",
    top: 0
  },

  markersContainer: {
    position: "absolute",
    right: "4px",
    top: "20px",
    bottom: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "flex-end",
    opacity: 0.3
  },

  marker: {
    width: "8px",
    height: "1px",
    backgroundColor: "#fff"
  }
}