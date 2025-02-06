import Weather from "./information/Weather";
import Environment from "./information/Environment";
import "./Home.css";

export default function Info() {
    return (
        <div id="info">
            <Weather />
            <Environment />
        </div>
    );
}