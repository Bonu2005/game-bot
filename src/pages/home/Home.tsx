import { useEffect } from "react";
import {  useNavigate } from "react-router-dom";
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
  useEffect(() => {
  const checkTelegramInit = () => {
    const ip: InitParams = (window as any).TelegramGameProxy?.initParams || {};
    if (!ip.user?.id) {
      // если Telegram ещё не инициализирован — пробуем снова через 100мс
      setTimeout(checkTelegramInit, 100);
      return;
    }

    startGame(ip);
  };

  const startGame = async (ip: InitParams) => {
    const navigate = useNavigate()
    const telegramId = ip.user?.id;
    const username = ip.user?.username;
    const chatId = ip.chat?.id || null;

    try {
      const res = await axios.post(`${API_URL}/start`, { telegramId, username, chatId });
      const { session_id } = res.data;

      navigate("/start", {
        state: { telegramId, username, sessionId: session_id, chatId },
        replace: true,
      });
    } catch (err) {
      console.error("Ошибка при старте игры:", err);
    }
  };

  checkTelegramInit();
}, []);


  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mb-[140px]">
        <img src={logo} alt="logo" />
      </div>
      <img src={loader} alt="loader" />
    </div>
  );
};

export default Home;
