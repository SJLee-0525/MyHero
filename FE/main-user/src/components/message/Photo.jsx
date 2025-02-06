import React from "react";
import "./Message.css";

import camera from "../../assets/icons/camera_shoot.png";

export default function Photo() {
    const handlePhotoUpload = () => {
        alert("사진을 촬영하려면 클릭하세요.");
    };

    return (
        <div className="photo-upload" onClick={handlePhotoUpload}>
            <img src={camera} alt="camera" />
            <p>사진을 촬영하려면 클릭하세요</p>
        </div>
    );
}