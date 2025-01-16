export default function SideNavElems({
  imgSrc,
  altSrc,
  identifier,
  activeIdentifier,
  onClickElem,
}) {
  return (
    <li className="side-nav-li">
      <button
        className={
          activeIdentifier === identifier
            ? "side-nav-elem-active"
            : "side-nav-elem"
        }
        onClick={() => onClickElem(identifier)}
      >
        <div className="side-nav-icon">
          <img src={imgSrc} alt={altSrc} />
        </div>
        <div className="side-nav-text">{identifier}</div>
      </button>
    </li>
  );
}
