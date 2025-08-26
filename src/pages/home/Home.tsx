import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import logo from "../../assets/imgs/Logo Example.svg";
import loader from "../../assets/imgs/loader.png";

type InitParams = {
  user?: { id: number; username?: string };
  chat?: { id: number };
  chat_instance?: string;
  inline_message_id?: string;
};

const API_URL = "https://telsot.uz/game"; // 👈 сюда твой бэкенд

const Home = () => {
  const ip: InitParams = (window as any).TelegramGameProxy?.initParams || {};
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const telegramId = ip.user?.id || params.get("user_id");
  const username = ip.user?.username || ip.user?.username || params.get("username");
  const chatId = ip.chat?.id || params.get("chat_id");
  const [sessionId, setSession] = useState(null)

  useEffect(() => {
    const startGame = async () => {
      try {
        navigate("/start", {
          state: {
            telegramId,
            username,
            chatId,
            // sessionId: res.data.session_id,
          },
          replace: true,
        });
        const res = await axios.post(`${API_URL}/start`, {
          telegramId: "7427077349",
          username: "Bonu",
          chatId,
        });

        console.log("Response data:", res.data);
        setSession(res.data.session_id);
        alert(JSON.stringify(res.data)); // показывает данные в окне WebApp

        // Переход на страницу игры

      } catch (err) {
        console.error("Ошибка при старте игры:", err);

      }
    };

    startGame();
  }, [navigate, sessionId, username, telegramId]);


  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mb-[140px]">
        <p className="bg-amber-50">"sessionId:"{sessionId}</p>
        <img src={logo} alt="logo" />
      </div>
      <img src={loader} alt="loader" />
    </div>
  );
};

export default Home;
