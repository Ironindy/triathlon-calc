export default function Splash() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "#FFFFFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999
      }}
    >
      <img
        src="/icon.png"
        alt="철인계산기"
        style={{
          width: "55vw",
          maxWidth: "260px",
          height: "auto"
        }}
      />
    </div>
  );
}
