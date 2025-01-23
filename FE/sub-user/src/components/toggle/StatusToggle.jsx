import "./Toggle.css";

export default function StatusToggle({
  name,
  imgSrc,
  altSrc,
  statusLevel,
  status,
}) {
  return (
    <div id="status-toggle">
      <div id="status-toggle-box">
        <div className={statusLevel}>
          <img src={imgSrc} alt={altSrc} />
        </div>
        <div>
          <p className="toggle-name">{name}</p>
          <p className={`${statusLevel}-status`}>{status}</p>
        </div>
      </div>
    </div>
  );
}
