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
        const res = await axios.post(`${API_URL}/start`, {
          telegramId,
          username,
          chatId

        });

        const { session_id } = res.data;
        setSession(session_id)

        navigate("/start", {
          state: { telegramId, username, sessionId: session_id, chatId },
        });
      } catch (err) {
        console.error("Ошибка при старте игры:", err);
      }
    };

    startGame();
  }, [telegramId, username, chatId, navigate]);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mb-[140px]">
        <p>{sessionId}</p>
        <img src={logo} alt="logo" />
      </div>
      <img src={loader} alt="loader" />
    </div>
  );
};

export default Home;
