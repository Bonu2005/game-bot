import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  const params = new URLSearchParams(window.location.search);
  const telegramId = ip.user?.id || params.get("user_id");
  const username = ip.user?.username || ip.user?.username || params.get("username");
  const chatId = ip.chat?.id || params.get("chat_id");


  useEffect(() => {
    const startGame = async () => {
      if (!telegramId || !username) return;

      try {
        const res = await axios.post(`${API_URL}/start`, {
          telegramId,
          username,
          chatId, // может быть null
        });

        const { session_id } = res.data;

        // редиректим на /start
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
      <p className="bg-amber-50">userId:{telegramId}</p>
      <p className="bg-amber-50">username:{username}</p>
      <p className="bg-amber-50">{chatId}</p>

      <p className="bg-amber-50">{params.toString()}</p>
      <div className="mb-[140px]">
        <img src={logo} alt="logo" />
      </div>
      <img src={loader} alt="loader" />
    </div>
  );
};

export default Home;
