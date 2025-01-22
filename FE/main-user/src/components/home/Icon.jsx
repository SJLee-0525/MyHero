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
      <button onClick={onClickIcon}>
        <img
          src={imgSrc}
          alt={altSrc}
          className={!state ? "disable-img" : "enable-img"}
        />
        {type === "icon" && <p className="icon-name">{children}</p>}
      </button>
    </div>
  );
}
