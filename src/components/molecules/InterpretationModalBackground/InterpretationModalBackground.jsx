import styles from "./interpretation-modal-background.module.css";

const InterpretationModalBackground = () => (
  <svg className={styles.background} viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
    <rect x="10" y="10" width="380" height="480" rx="16" className={styles.frame} />
    <rect x="20" y="20" width="360" height="460" rx="12" className={styles.frameInner} strokeDasharray="3 6" />

    <g className={styles.centerSigil} transform="translate(200,250)">
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i * 60 * Math.PI) / 180;
        const x = 90 * Math.cos(angle);
        const y = 90 * Math.sin(angle);
        return <line key={i} x1="0" y1="0" x2={x} y2={y} />;
      })}
      <circle r="6" className={styles.centerDot} />
    </g>

    {[
      { x: 55, y: 60 },
      { x: 345, y: 60 },
      { x: 55, y: 440 },
      { x: 345, y: 440 },
    ].map((pos, i) => (
      <g key={i} className={styles.sakuraFlower} transform={`translate(${pos.x},${pos.y})`}>
        {Array.from({ length: 5 }).map((_, j) => {
          const angle = (j * 72 * Math.PI) / 180;
          const px = 12 * Math.cos(angle);
          const py = 12 * Math.sin(angle);
          return (
            <ellipse
              key={j}
              cx={px}
              cy={py}
              rx="7"
              ry="10"
              transform={`rotate(${(angle * 180) / Math.PI + 90}, ${px}, ${py})`}
            />
          );
        })}
        <circle r="4" className={styles.flowerCenter} />
      </g>
    ))}

    {[
      { x: 100, y: 130 }, { x: 300, y: 150 }, { x: 90, y: 370 },
      { x: 310, y: 350 }, { x: 200, y: 90 }, { x: 200, y: 410 },
    ].map((pos, i) => (
      <g key={i} className={styles.tinyStar} transform={`translate(${pos.x},${pos.y})`}>
        <path d="M 0,-6 L 1.5,-1.5 L 6,0 L 1.5,1.5 L 0,6 L -1.5,1.5 L -6,0 L -1.5,-1.5 Z" />
      </g>
    ))}

    <path
      className={styles.moon}
      transform="translate(200,50)"
      d="M -9,-12 A 14,14 0 1 0 -9,12 A 10,10 0 1 1 -9,-12 Z"
    />
  </svg>
);

export default InterpretationModalBackground;