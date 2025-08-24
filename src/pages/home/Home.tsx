import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import logo from "../../assets/imgs/Logo Example.svg";
import loader from "../../assets/imgs/loader.png";

const API_URL = "http://localhost:3000/game"; // 👈 сюда твой бэкенд

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);

  const telegramId = params.get("telegramId");
  const username = params.get("username");
  const chatId = params.get("chatId");

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
      <div className="mb-[140px]">
        <img src={logo} alt="logo" />
      </div>
      <img src={loader} alt="loader" />
    </div>
  );
};

export default Home;
