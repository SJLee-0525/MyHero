import "../Home.css"

export default function StatusWidget({
    name,
    status,
    imgSrc,
    altSrc,
}) {
    return (
        <div className={status}>
            <div id="info-title">{name}</div>
            <img src={imgSrc} alt={altSrc} />
        </div>
    )
}