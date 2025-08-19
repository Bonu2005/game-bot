import { useEffect, useState } from "react";
import image3 from "../../assets/imgs/image 3.svg";
import shareplay from "../../assets/imgs/shareplay.svg";
import play from "../../assets/imgs/play.circle.fill.svg";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Start = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [telegramId, setTelegramId] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("telegram_id");
    const name = params.get("username");
    console.log(id,name);
    
   
    
    if (id) setTelegramId(id);
    if (name) setUsername(name);
  }, []);

  const handleStart = async () => {
    try {
      setLoading(true);

  
      const res = await axios.post("http://localhost:3000/game/start", {
        telegramId,
        username,
        level: null, 
      });

      // сохраняем session_id
      localStorage.setItem("session_id", res.data.session_id);

      // переход к выбору уровня
      navigate("/chooseLevel");
    } catch (err) {
      console.error("Ошибка при старте игры:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div className="flex flex-col items-center justify-center px-6">
      {/* Заголовок */}
      <h1 className="text-white font-bold text-[24px] mb-6">Word Quiz  {username}</h1>

      {/* Основное изображение */}
      <img src={image3} alt="Quiz" className="w-[220px] h-auto mb-10" />

      {/* Кнопка Invite Friends */}
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

      {/* Кнопка Play */}
      <Link to={"/chooseLevel" } className="flex items-center justify-center w-full max-w-[320px] h-[52px] rounded-full bg-[#FFA500] shadow-md">
            <button
        onClick={handleStart}
        disabled={loading}

      >
        <img src={play} alt="Play" className="w-6 h-6 mr-2" />
        <p className="text-white text-[16px] font-semibold">
          {loading ? "Starting..." : "Play"}
        </p>
      </button></Link>

    </div>
  );
};

export default Start;