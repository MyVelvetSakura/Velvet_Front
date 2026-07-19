import useTheme from "../../../hooks/useTheme";
import styles from "./theme-decoration.module.css";

const TarotCircle = () => (
  <svg className={styles.astralCircle} viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
    {/* Anillos concéntricos */}
    <circle cx="200" cy="200" r="190" className={styles.ringOuter} />
    <circle cx="200" cy="200" r="175" className={styles.ringOuterDashed} strokeDasharray="4 6" />
    <circle cx="200" cy="200" r="130" className={styles.ringMid} />
    <circle cx="200" cy="200" r="70" className={styles.ringInner} />

    {/* Líneas de 8 puntas cruzando todo el círculo, del centro al borde exterior */}
    <g className={styles.centerStar} transform="translate(200,200)">
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 45 * Math.PI) / 180;
        const x = 190 * Math.cos(angle);
        const y = 190 * Math.sin(angle);
        return <line key={i} x1="0" y1="0" x2={x} y2={y} />;
      })}
      <circle r="8" className={styles.centerDot} />
    </g>

    {/* Símbolos grandes centrados en cada uno de los 8 sectores.
        Nota: en SVG el eje Y crece hacia abajo, así que angle:270 = arriba, angle:90 = abajo */}
    {[
      { angle: 270, type: "sun" },   // arriba
      { angle: 90, type: "moon" },   // abajo
      { angle: 22.5, type: "star" },
      { angle: 67.5, type: "star" },
      { angle: 112.5, type: "star" },
      { angle: 157.5, type: "star" },
      { angle: 202.5, type: "star" },
      { angle: 247.5, type: "star" },
    ].map(({ angle, type }, i) => {
      const rad = (angle * Math.PI) / 180;
      const radius = 128;
      const x = 200 + radius * Math.cos(rad);
      const y = 200 + radius * Math.sin(rad);

      if (type === "sun") {
        return (
          <g key={i} className={styles.sunGlyph} transform={`translate(${x},${y})`}>
            <circle r="14" />
            {Array.from({ length: 8 }).map((_, j) => {
              const a = (j * 45 * Math.PI) / 180;
              const x1 = 19 * Math.cos(a);
              const y1 = 19 * Math.sin(a);
              const x2 = 27 * Math.cos(a);
              const y2 = 27 * Math.sin(a);
              return <line key={j} x1={x1} y1={y1} x2={x2} y2={y2} />;
            })}
          </g>
        );
      }

      if (type === "moon") {
        return (
          <path
            key={i}
            className={styles.moonGlyph}
            transform={`translate(${x},${y})`}
            d="M -12,-16 A 18,18 0 1 0 -12,16 A 13,13 0 1 1 -12,-16 Z"
          />
        );
      }

      return (
        <g key={i} className={styles.smallStar} transform={`translate(${x},${y})`}>
          {Array.from({ length: 6 }).map((_, j) => {
            const a = (j * 60 * Math.PI) / 180;
            const lx = 16 * Math.cos(a);
            const ly = 16 * Math.sin(a);
            return <line key={j} x1="0" y1="0" x2={lx} y2={ly} />;
          })}
          <circle r="3" className={styles.centerDot} />
        </g>
      );
    })}

    {/* Filigranas ornamentales en las 4 esquinas del anillo medio */}
    {[45, 135, 225, 315].map((deg, i) => {
      const angle = (deg * Math.PI) / 180;
      const x = 200 + 150 * Math.cos(angle);
      const y = 200 + 150 * Math.sin(angle);
      return (
        <g key={i} className={styles.flourish} transform={`translate(${x},${y}) rotate(${deg})`}>
          <path d="M 0,-6 Q 6,0 0,6 Q -6,0 0,-6 Z" />
        </g>
      );
    })}

    {/* Puntos de luz distribuidos en el anillo exterior */}
    {Array.from({ length: 16 }).map((_, i) => {
      const angle = (i * 22.5 * Math.PI) / 180;
      const x = 200 + 190 * Math.cos(angle);
      const y = 200 + 190 * Math.sin(angle);
      return <circle key={i} cx={x} cy={y} r="2.2" className={styles.node} />;
    })}
  </svg>
);

const ThemeDecoration = () => {
  const { theme } = useTheme();

  if (theme === "clow") {
    return (
      <div className={styles.clowLayer}>
        <TarotCircle />
        {Array.from({ length: 40 }).map((_, i) => (
          <span
            key={i}
            className={styles.star}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={styles.sakuraLayer}>
      {Array.from({ length: 20 }).map((_, i) => (
        <span
          key={i}
          className={styles.petal}
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${6 + Math.random() * 6}s`,
          }}
        />
      ))}
    </div>
  );
};

export default ThemeDecoration;