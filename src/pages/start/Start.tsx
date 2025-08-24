import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import image3 from "../../assets/imgs/image 3.svg";
import shareplay from "../../assets/imgs/shareplay.svg";
import play from "../../assets/imgs/play.circle.fill.svg";

const Start = () => {
  const location = useLocation();
  const state = location.state as {
    telegramId?: string;
    username?: string;
    sessionId?: string;
    chatId?: string;
  } || {};

  const { telegramId, username, chatId: initialChatId } = state;

  // Используем локальный стейт для актуализации sessionId и chatId
  const [currentSessionId, setCurrentSessionId] = useState<string | undefined>(state.sessionId);
  const [currentChatId, setCurrentChatId] = useState<string | undefined>(initialChatId);

  const handleInvite = async () => {
    if (!telegramId || !username) {
      alert("Недостаточно данных для приглашения.");
      return;
    }

    try {
      const groupChatId = currentChatId ?? `game_${telegramId}`;

      const res = await axios.post("https://telsot.uz/game/start", {
        telegramId,
        username,
        chatId: groupChatId,
      });

      const newSessionId = res.data.session_id;
      setCurrentSessionId(newSessionId);
      setCurrentChatId(groupChatId);

      const gameUrl = `https://t.me/WordEngUz_bot?game=english&chatId=${groupChatId}`;
      const shareText = `Hey! Join me in Word Quiz! 🕹️`;

      const webShareLink = `https://t.me/share/url?url=${encodeURIComponent(
        gameUrl
      )}&text=${encodeURIComponent(shareText)}`;

      if (navigator.share) {
        await navigator.share({
          title: "Word Quiz",
          text: shareText,
          url: gameUrl,
        });
      } else {
        window.open(webShareLink, "_blank");
      }
    } catch (err) {
      console.error("Ошибка при создании приглашения:", err);
      alert("Не удалось создать приглашение. Попробуйте позже.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-6">
      <h1 className="text-white font-bold text-[24px] mb-6">
        Word Quiz
      </h1>

    

      <img src={image3} alt="Quiz" className="w-[220px] h-auto mb-10" />

      {/* Invite Friends */}
      <div
        className="flex items-center justify-center w-full max-w-[320px] h-[52px] rounded-full bg-white mb-4 shadow-md cursor-pointer"
        onClick={handleInvite}
      >
        <img src={shareplay} alt="Invite" className="w-5 h-5 mr-2" />
        <p className="text-black text-[16px] font-medium">Invite friends</p>
      </div>

      {/* Play */}
      <Link
        to="/chooseLevel"
        state={{
          telegramId,
          username,
          sessionId: currentSessionId,
          chatId: currentChatId,
        }}
        className="flex items-center justify-center w-full max-w-[320px] h-[52px] rounded-full bg-[#FFA500] shadow-md"
      >
        <img src={play} alt="Play" className="w-6 h-6 mr-2" />
        <p className="text-white text-[16px] font-semibold">Play</p>
      </Link>
    </div>
  );
};

export default Start;
