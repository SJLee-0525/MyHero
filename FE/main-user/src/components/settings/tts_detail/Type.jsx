import React from "react";
import { useState } from "react";
import "../Settings.css";

export default function Type() {
    const [subCategoryId, setSubCategoryId] = useState(0);

    const categoryHandler = (e) => {
        setSubCategoryId(Number(e.target.value));
        console.log(subCategoryId);
    };

    return (
        <div id="tts-change">
           음성 종류
           <br/>
            <label className="voice-control">
                <input
                    type="radio"
                    value={1}
                    onChange={categoryHandler}
                    checked={subCategoryId == 1}
                />
                    음성1
            </label>
            <label className="voice-control">
                <input
                    type="radio"
                    value={2}
                    onChange={categoryHandler}
                    checked={subCategoryId == 2}
                />
                    음성2
            </label>
            <label className="voice-control">
                <input
                    type="radio"
                    value={3}
                    onChange={categoryHandler}
                    checked={subCategoryId == 3}
                />
                    음성3
            </label>
        </div>
    );
}