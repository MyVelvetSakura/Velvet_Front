import { useState } from "react";
import { useNavigate } from "react-router";
import styles from "./intro.module.css";

const SLIDES = [
    {
        icon: "🌸",
        title: "Bienvenid@ a Velvet Sakura",
        text: "Un rincón mágico inspirado en Cardcaptor Sakura donde las cartas del destino te acompañan en tus preguntas más importantes.",
    },
    {
        icon: "🔮",
        title: "Elige tu mazo",
        text: "Antes de cada tirada, decides con qué energía quieres consultar: las cartas Sakura, de aire luminoso, o las cartas Clow, de aire más profundo y misterioso.",
    },
    {
        icon: "💭",
        title: "Formula tu pregunta",
        text: "Escribe lo que quieras preguntarle al destino. Si prefieres no concretar nada, también puedes saltarte este paso y dejar que las cartas hablen por sí solas.",
    },
    {
        icon: "🃏",
        title: "Pasado, presente y futuro",
        text: "Elige tres cartas del mazo barajado. Al revelarlas, cada una representa una etapa: lo que fue, lo que es, y lo que está por venir.",
    },
    {
        icon: "✨",
        title: "Una interpretación única",
        text: "Con el significado real de cada carta como base, una voz mágica teje una interpretación conectada directamente con tu pregunta.",
    },
    {
        icon: "🪶",
        title: "Progresa con cada tirada",
        text: "Gana experiencia, sube de nivel y consigue Plumas de Yue con cada lectura. Desbloquea logros y usa tus plumas para repetir una tirada si lo necesitas.",
    },
];

const Intro = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);

    const finish = () => {
        localStorage.setItem("hasSeenIntro", "true");
        navigate("/home", { replace: true });
    };

    const next = () => {
        if (step === SLIDES.length - 1) {
            finish();
        } else {
            setStep((s) => s + 1);
        }
    };

    const prev = () => {
        setStep((s) => Math.max(0, s - 1));
    };

    const slide = SLIDES[step];

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <button className={styles.skipBtn} onClick={finish}>
                    Saltar intro
                </button>

                <div className={styles.iconCircle}>
                    <span className={styles.icon}>{slide.icon}</span>
                </div>

                <h2 className={styles.title}>{slide.title}</h2>
                <p className={styles.text}>{slide.text}</p>

                <div className={styles.dots}>
                    {SLIDES.map((_, i) => (
                        <button
                            key={i}
                            className={`${styles.dot} ${i === step ? styles.activeDot : ""}`}
                            onClick={() => setStep(i)}
                            aria-label={`Ir al paso ${i + 1}`}
                        />
                    ))}
                </div>

                <div className={styles.actions}>
                    {step > 0 && (
                        <button className={styles.reset_btn} onClick={prev}>
                            Atrás
                        </button>
                    )}
                    <button className={styles.subm_btn} onClick={next}>
                        {step === SLIDES.length - 1 ? "Empezar" : "Siguiente"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Intro;