import React from "react";
import "./Settings.css";

import wallpaper1 from "../../assets/wallpaper1.png";
import wallpaper2 from "../../assets/wallpaper2.png";
import wallpaper3 from "../../assets/wallpaper3.jpg";
import wallpaper4 from "../../assets/wallpaper4.png";

export default function Backgrounds() {
    const images = [wallpaper1, wallpaper2, wallpaper3, wallpaper4];
    
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
                    style={{ margin: "5px", height: "90px"}}        
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