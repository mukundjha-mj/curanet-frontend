export function AuthVisualPanel() {
  return (
    <div
      className="relative hidden overflow-hidden md:block"
      style={{
        background:
          "linear-gradient(135deg, #0a0f1e 0%, #0d1b3e 35%, #0f2460 70%, #1a3a7a 100%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-20%",
            left: "-15%",
            width: "55%",
            height: "55%",
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 40% 40%, rgba(56,182,255,0.55) 0%, rgba(0,102,255,0.35) 40%, transparent 70%)",
            animation: "cura-float1 8s ease-in-out infinite",
            filter: "blur(2px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-10%",
            right: "-10%",
            width: "50%",
            height: "50%",
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 60% 60%, rgba(0,180,255,0.5) 0%, rgba(0,80,220,0.3) 45%, transparent 70%)",
            animation: "cura-float2 10s ease-in-out infinite",
            filter: "blur(3px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: "40%",
            width: "30%",
            height: "30%",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(100,220,255,0.3) 0%, rgba(0,140,255,0.15) 60%, transparent 80%)",
            animation: "cura-float3 12s ease-in-out infinite",
            filter: "blur(1px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(56,182,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(56,182,255,0.04) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <img
        src="/CuraNet.png"
        alt="CuraNet logo"
        className="absolute inset-0 h-full w-full object-contain p-10 drop-shadow-2xl"
        style={{
          filter:
            "drop-shadow(0 0 40px rgba(56,182,255,0.6)) drop-shadow(0 0 80px rgba(0,120,255,0.3))",
          position: "relative",
          zIndex: 10,
        }}
      />

      <style>{`
        @keyframes cura-float1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(6%, 8%) scale(1.08); }
          66% { transform: translate(-4%, 5%) scale(0.95); }
        }
        @keyframes cura-float2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          40% { transform: translate(-8%, -6%) scale(1.1); }
          70% { transform: translate(4%, -3%) scale(0.92); }
        }
        @keyframes cura-float3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-12%, 10%) scale(1.15); }
        }
      `}</style>
    </div>
  )
}
