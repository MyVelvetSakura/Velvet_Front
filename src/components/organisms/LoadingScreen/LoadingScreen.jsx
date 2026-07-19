import "./LoadingScreen.css";
import clouds from "../../../assets/images/loading/clouds.png";
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
    </div>
  );
}