export default function Splash() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "#3093F8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999
      }}
    >
      <img
        src="/icon-512.png"
        alt="철인계산기"
        style={{
          width: "40vw",
          maxWidth: "180px",
          height: "auto"
        }}
      />
    </div>
  );
}
