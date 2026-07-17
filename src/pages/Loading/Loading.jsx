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
          setTimeout(() => navigate("/home", { replace: true }), 500);
          return 100;
        }
        return prev + 1;
      });
   }, 90);
    return () => clearInterval(interval);
  }, [navigate]);
  return (
    <>
      <LoadingScreen progress={progress} />
    </>
  );
};

export default Loading;
