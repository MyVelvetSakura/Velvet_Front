import { useState, useEffect } from "react";
import styles from "./scroll-to-top-history.module.css";

const ScrollToTopHistory = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > 300);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (!isVisible) return null;

    return (
        <button
            className={styles.scrollBtn}
            onClick={scrollToTop}
            title="Volver arriba"
            aria-label="Volver arriba"
        >
            ↑
        </button>
    );
};

export default ScrollToTopHistory;