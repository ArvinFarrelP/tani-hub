import React from "react";
import { colors } from "../utils/theme";

export default function MobileHeader({ onMenuClick }) {
  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 64,
        background: "#fff",
        borderBottom: `1px solid ${colors.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        zIndex: 150,
        boxShadow: "0 2px 8px rgba(0,0,0,.06)",
      }}
    >
      {/* Left */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <button
          onClick={onMenuClick}
          style={{
            width: 40,
            height: 40,
            border: "none",
            borderRadius: 10,
            background: colors.primaryDark,
            color: "#fff",
            fontSize: 22,
            cursor: "pointer",
          }}
        >
          ☰
        </button>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: colors.primaryLight,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
            }}
          >
            🌾
          </div>

          <div>
            <div
              style={{
                fontWeight: 700,
                color: colors.primaryDark,
                fontSize: 16,
              }}
            >
              Tani Hub
            </div>

            <div
              style={{
                fontSize: 11,
                color: colors.textMuted,
              }}
            >
              Agritech Platform
            </div>
          </div>
        </div>
      </div>

      {/* Right */}
      <button
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          border: `1px solid ${colors.border}`,
          background: "#fff",
          cursor: "pointer",
          fontSize: 20,
        }}
      >
        🔔
      </button>
    </header>
  );
}