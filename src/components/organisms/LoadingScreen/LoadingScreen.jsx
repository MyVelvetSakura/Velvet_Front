import "./LoadingScreen.css";
import clouds from "../../../assets/images/loading/clouds.png";
import stars from "../../../assets/images/loading/stars.png";
import sakurachibi from "../../../assets/images/loading/sakurachibi.png";
import circle from "../../../assets/images/loading/magic-circle.png";
import logo from "../../../assets/images/loading/logo.png";
import card from "../../../assets/images/loading/card.png";
import wand from "../../../assets/images/loading/wand.png";

export default function LoadingScreen({ progress }) {
  return (
    <div className="loading">
      <div className="gradient"></div>

      <img src={clouds} className="clouds" alt="" />
      <img src={stars} className="stars" alt="" />

      {/* Capa de destellos extra, generada en CSS puro */}
      <div className="sparkleLayer">
        {Array.from({ length: 25 }).map((_, i) => (
          <span
            key={i}
            className="sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="centerpiece">
        <img src={circle} className="magicCircle" alt="" />
        <img src={sakurachibi} className="sakurachibi" alt="" />
        <img src={logo} className="logo" alt="" />
      </div>
        <img src={wand} className="wand" alt="" />
      <img src={card} className="card" alt="" />

      <h2 className="title">Capturando cartas...</h2>

      <div className="bar">
        <span className="wing wingLeft">🪽</span>
        <div className="barTrack">
          <div className="progress" style={{ width: `${progress}%` }} />
          <span className="progressText">{progress}%</span>
        </div>
        <span className="wing wingRight">🪽</span>
      </div>

      <p className="caption">La magia nos acompaña</p>

      {Array.from({ length: 30 }).map((_, index) => (
        <span
          key={index}
          className="petal"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${6 + Math.random() * 6}s`,
          }}
        />
      ))}
    </div>
  );
}