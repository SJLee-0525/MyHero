import "./Settings.css";

export default function Settings({type, children}) {
    return (
      <div id={type}>
        {type === "box" && <p className="box-name">{children}</p>}
      </div>
    ); 
  }