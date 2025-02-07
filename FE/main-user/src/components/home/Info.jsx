import Weather from "./information/Weather";
import Schedule from "./information/Schedule";
import Environment from "./information/Environment";
import "./Home.css";

export default function Info() {
    return (
        <div id="info">
            <div id="info-group">
                <Weather /> 
                <Schedule />
            </div>
            <Environment />
        </div>
    );
}