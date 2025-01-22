import "./Activity.css";

export default function ActivityToggle({ name, imgSrc, altSrc, status }) {
  return (
    <div id="activity-toggle">
      <div id="activity-toggle-box">
        <div
          className={altSrc === "heart" ? "toggle-mental" : "toggle-activity"}
        >
          <img src={imgSrc} alt={altSrc} />
        </div>
        <div>
          <p className="toggle-name">{name}</p>
          <p
            className={status < 70 ? "toggle-status-bad" : "toggle-status-good"}
          >
            {status}
          </p>
        </div>
      </div>
    </div>
  );
}
