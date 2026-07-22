import { useContext } from "react";
import { AudioContext } from "../context/audio/AudioContext";

const useAudioPlayer = () => useContext(AudioContext);

export default useAudioPlayer;