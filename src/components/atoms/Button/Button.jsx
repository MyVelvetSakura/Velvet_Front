import { useNavigate } from "react-router";
import "./button.css";

const Button=({text, BtnClass,path})=>{
    const navigate = useNavigate();
return(
<>
<button className={BtnClass} onClick={() => navigate(path)}>{text}</button>
</>

)
}

export default Button;