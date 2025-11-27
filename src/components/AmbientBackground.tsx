export default function AmbientBackground() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        overflow: 'hidden',
      }}
    >
      {/* Sky gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, #87CEEB 0%, #B0E0E6 30%, #E0F7FA 60%, #8FBC8F 80%, #556B2F 100%)',
        }}
      />

      {/* Sun glow */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          right: '15%',
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #FFE4B5 0%, #FFD700 30%, transparent 70%)',
          boxShadow: '0 0 60px #FFD70050',
        }}
      />

      {/* Ground */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '25%',
          background: 'linear-gradient(180deg, #556B2F 0%, #3D5229 50%, #2E4220 100%)',
        }}
      />

      {/* Grass texture */}
      <div
        style={{
          position: 'absolute',
          bottom: '20%',
          left: 0,
          right: 0,
          height: 40,
          background: `repeating-linear-gradient(
            90deg,
            transparent,
            transparent 3px,
            #228B2220 3px,
            #228B2220 6px
          )`,
        }}
      />
    </div>
  );
}
