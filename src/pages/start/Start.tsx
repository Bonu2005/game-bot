import { useState } from "react";
import image3 from "../../assets/imgs/image 3.svg";
import shareplay from "../../assets/imgs/shareplay.svg";
import play from "../../assets/imgs/play.circle.fill.svg";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Start = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    try {
      setLoading(true);
      const telegramId = localStorage.getItem("telegramId");
      const username = localStorage.getItem("username");

      if (!telegramId || !username) {
        alert("Ошибка: нет данных пользователя");
        return;
      }

    
      const res = await axios.post("http://3.76.216.99:3000/game/start", {
        telegramId:"123456",
        username :"Bonu",
        level: null,
      });

 
      localStorage.setItem("session_id", res.data.session_id);

      navigate("/chooseLevel");
    } catch (err) {
      console.error("Ошибка при старте игры:", err);
      alert("Не удалось начать игру");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-6">
   
      <h1 className="text-white font-bold text-[24px] mb-6">Word Quiz</h1>

   
      <img src={image3} alt="Quiz" className="w-[220px] h-auto mb-10" />

   
      <div
        className="flex items-center justify-center w-full max-w-[320px] h-[52px] rounded-full bg-white mb-4 shadow-md cursor-pointer"
        onClick={() => {
          window.open(
            "https://t.me/WordEngUz_bot?game=english&text=Check out this cool game!",
            "_blank"
          );
        }}
      >
        <img src={shareplay} alt="Invite" className="w-5 h-5 mr-2" />
        <p className="text-black text-[16px] font-medium">Invite friends</p>
      </div>

    
      <button
        onClick={handleStart}
        disabled={loading}
        className="flex items-center justify-center w-full max-w-[320px] h-[52px] rounded-full bg-[#FFA500] shadow-md"
      >
        <img src={play} alt="Play" className="w-6 h-6 mr-2" />
        <p className="text-white text-[16px] font-semibold">
          {loading ? "Starting..." : "Play"}
        </p>
      </button>
    </div>
  );
};

export default Start;
