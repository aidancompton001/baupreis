import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "BauPreis AI — Baupreise in Echtzeit";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
          padding: "60px",
        }}
      >
        {/* Logo / Brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "72px",
              height: "72px",
              borderRadius: "16px",
              backgroundColor: "rgba(255,255,255,0.2)",
              marginRight: "20px",
              fontSize: "40px",
              color: "white",
              fontWeight: 700,
            }}
          >
            B
          </div>
          <span
            style={{
              fontSize: "52px",
              fontWeight: 700,
              color: "white",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            BauPreis AI
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: "56px",
            fontWeight: 700,
            color: "white",
            textAlign: "center",
            lineHeight: 1.2,
            marginBottom: "20px",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Baupreise in Echtzeit
        </div>

        {/* Subheadline */}
        <div
          style={{
            fontSize: "28px",
            fontWeight: 400,
            color: "rgba(255,255,255,0.85)",
            textAlign: "center",
            lineHeight: 1.4,
            maxWidth: "800px",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          AI-gestützte Preisprognosen für die deutsche Baubranche
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            bottom: "40px",
            fontSize: "20px",
            color: "rgba(255,255,255,0.6)",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          baupreis.ais152.com
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
