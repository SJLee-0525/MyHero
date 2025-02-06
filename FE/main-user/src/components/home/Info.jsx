import Weather from "./information/Weather";
import Environment from "./information/Environment";
import "./Home.css";

export default function Info({ type }) {
    return (
        <div id="info">
            <Weather />
            <Environment />
        </div>
    );
}