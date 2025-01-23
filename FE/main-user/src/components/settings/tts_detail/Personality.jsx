import React from "react";
import { useState } from "react";
import "../Settings.css";

export default function Personality() {
    const [subCategoryId, setSubCategoryId] = useState(0);

    const categoryHandler = (e) => {
        setSubCategoryId(Number(e.target.value));
        console.log(subCategoryId);
    };

    return (
        <div id="tts-change">
           대화 성향
           <br/>
            <label className="voice-control">
                <input
                type="radio"
                value={1}
                onChange={categoryHandler}
                checked={subCategoryId == 1}
                />
                    친절
            </label>
            <label className="voice-control">
                <input
                type="radio"
                value={2}
                onChange={categoryHandler}
                checked={subCategoryId == 2}
                />
                    무뚝뚝
            </label>
        </div>
    );
}