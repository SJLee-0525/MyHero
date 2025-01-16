export default function TopNavSideElems({ imgSrc, altSrc, identifier, activeIdentifier, onClickElem }) {
  return (
    <li className="top-side-bar-nav-li">
      <button className={activeIdentifier === identifier ? "top-side-bar-nav-elem-active" : "top-side-bar-nav-elem"} onClick={() => onClickElem(identifier)}>
        <div className="top-side-bar-nav-icon">
          <img src={imgSrc} alt={altSrc} />
        </div>
        <div className="top-side-bar-nav-text">{identifier}</div>
      </button>
    </li>
  )
}
