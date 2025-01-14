export default function StatusIcon({ imgSrc, altSrc, status, onClickIcon }) {
  return (
    <button onClick={onClickIcon} className={status ? "selected" : undefined}>
      <img src={imgSrc} alt={altSrc} />
    </button>
  );
}
