import "./Toggle.css";

export default function Toggle({
  name,
  status,
  onClickToggle,
  imgSrc,
  altSrc,
}) {
  return (
    <div id="toggle">
      <div id="toggle-box">
        <div className={status ? "toggle-active" : "toggle-deactive"}>
          <button className="toggle-button" onClick={() => onClickToggle(name)}>
            <img src={imgSrc} alt={altSrc} />
          </button>
        </div>
        <p>{name}</p>
      </div>
    </div>
  );
}
