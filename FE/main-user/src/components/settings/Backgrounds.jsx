import React from "react";
import { useState, useEffect } from "react";
import "./Settings.css";

import wallpaper1 from "../../assets/wallpaper1.png";
import wallpaper2 from "../../assets/wallpaper2.png";
import wallpaper3 from "../../assets/wallpaper3.jpg";
import wallpaper4 from "../../assets/wallpaper4.png";

export default function Backgrounds() {
    const images = [wallpaper1, wallpaper2, wallpaper3, wallpaper4];
    const [selectedBackground, setSelectedBackground] = useState(localStorage.getItem("background") || wallpaper1);

    useEffect(() => {
        document.body.style.background = `url(${selectedBackground})`;
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
    }, [selectedBackground]);

    const changeBackground = (image) => {
        setSelectedBackground(image);
        localStorage.setItem("background", image);
    };

    return (
        <div style={{
            width: "360px",
            display: "grid",
            gridTemplateRows: "1fr",
            gridTemplateColumns: "1fr 1fr"
        }}
        >
            {images.map((image, key) => (
                <div
                    key={key}
                    style={{ margin: "5px", height: "90px", cursor: "pointer", border: selectedBackground === image ? "3px solid green" : "none"}}        
                    onClick={() => changeBackground(image)}       
                >
                    <img
                        src={image}
                        alt={`Wallpaper ${key + 1}`}
                        style={{width: '100%', height: '100%', objectFit: 'cover'}}
                    />
                </div>
            ))}
        </div>
    );
}