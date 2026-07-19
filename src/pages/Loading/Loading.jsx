import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import LoadingScreen from "../../components/organisms/LoadingScreen/LoadingScreen";
import clouds from "../../assets/images/loading/clouds.png";
import sakurachibi from "../../assets/images/loading/sakurachibi.png";
import circle from "../../assets/images/loading/magic-circle.png";
import logo from "../../assets/images/loading/logo.png";
import card from "../../assets/images/loading/card.png";
import wand from "../../assets/images/loading/wand.png";

const ASSETS_TO_PRELOAD = [clouds, sakurachibi, circle, logo, card, wand];

const Loading = () => {
    const [progress, setProgress] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        let loaded = 0;
        const total = ASSETS_TO_PRELOAD.length;

        const updateProgress = () => {
            loaded += 1;
            setProgress(Math.round((loaded / total) * 100));
        };

        const promises = ASSETS_TO_PRELOAD.map((src) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.src = src;
                img.onload = () => {
                    updateProgress();
                    resolve();
                };
                img.onerror = () => {
                    updateProgress();
                    resolve();
                };
            });
        });

        Promise.all(promises).then(() => {
            setTimeout(() => navigate("/home", { replace: true }), 500);
        });
    }, [navigate]);

    return (
        <>
            <LoadingScreen progress={progress} />
        </>
    )
}

export default Loading;