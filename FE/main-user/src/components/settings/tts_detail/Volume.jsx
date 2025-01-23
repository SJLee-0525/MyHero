import React from "react";
import { useState } from "react";
import "../Settings.css";

export default function Volume() {
    const [volume, setVolume] = useState(0.5);

    return (
        <div id="tts-change">
           소리 크기
           <input
               className="volume-control"
               type="range"
               min={0}
               max={1}
               color="gray"
               step={0.02}
               value={volume}
               onChange={(event) => {
                   setVolume(event.target.valueAsNumber);
               }}
           />
        </div>
    );
}