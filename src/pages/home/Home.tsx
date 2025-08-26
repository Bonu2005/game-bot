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
  const inline_message_id = ip.inline_message_id|| params.get("inline_message_id");
  const message_id = ip.chat_instance || params.get("message_id");
  const [sessionId,setSessionId] = useState(null)
  console.log(params);
  
  console.log({"telegramId":telegramId,"username":username,"inline_message_id":inline_message_id,"message_id":message_id});
  

  useEffect(() => {
    const startGame = async () => {
      try {

        const res = await axios.post(`${API_URL}/start`, {
          telegramId,
          username,
          chatId,
        });

       
        
       setSessionId(res.data.session_id)
        navigate("/start", {
          state: {
            telegramId,
            username,
            chatId,
            sessionId: res.data.session_id,
            inline_message_id,
            message_id
          },
          replace: true,
        });
       

      } catch (err) {
        console.error("Ошибка при старте игры:", err);

      }
    };

    startGame();
  }, [navigate, sessionId, username, telegramId]);


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
