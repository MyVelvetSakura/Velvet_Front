import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import LoadingScreen from "../../components/organisms/LoadingScreen/LoadingScreen";

const Loading = () => {
    const [progress, setProgress] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => navigate("/home", { replace: true }), 400);
                    return 100;
                }
                return prev + 2;
            });
        }, 30);

        return () => clearInterval(interval);
    }, [navigate]);

    return (
        <>
            <LoadingScreen progress={progress} />
        </>
    )
}

export default Loading;