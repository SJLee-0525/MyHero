export default function TopNavSideNavElems({
  imgSrc,
  altSrc,
  identifier,
  activeIdentifier,
  onClickElem,
}) {
  return (
    <li className="sidebar-nav-li">
      <button
        className={`sidebar-nav-elem ${
          activeIdentifier === identifier ? "active" : ""
        }`}
        onClick={() => onClickElem(identifier)}
      >
        <div className="sidebar-nav-icon">
          <img src={imgSrc} alt={altSrc} />
        </div>
        <div className="sidebar-nav-text">{identifier}</div>
      </button>
    </li>
  );
}
