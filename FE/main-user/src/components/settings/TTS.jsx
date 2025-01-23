import Volume from "./tts_detail/Volume";
import Type from "./tts_detail/Type";
import Personality from "./tts_detail/Personality";

export default function TTS() {
    return (
        <div 
            id="tts"
            style={{ margin: "5px", height: "90px"}}
        >
            <Volume/>
            <Type/>
            <Personality/>
        </div>
    )
}