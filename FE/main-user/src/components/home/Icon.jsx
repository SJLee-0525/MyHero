import "./Home.css";

export default function Icon({
  type,
  state,
  imgSrc,
  altSrc,
  onClickIcon,
  children,
}) {
  return (
    <div id={type}>
      <div className={!state ? "disabled" : "enabled"}>
        <button onClick={onClickIcon}>
          <img src={imgSrc} alt={altSrc} />
          {type === "icon" && <p className="icon-name">{children}</p>}
        </button>
      </div>
    </div>
  );
}
