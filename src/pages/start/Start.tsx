import { Link, useLocation } from "react-router-dom";
import image3 from "../../assets/imgs/image 3.svg";
import shareplay from "../../assets/imgs/shareplay.svg";
import play from "../../assets/imgs/play.circle.fill.svg";
import axios from "axios";

const Start = () => {
  const location = useLocation();
  const state = location.state as {
    telegramId?: string;
    username?: string;
    sessionId?: string;
    chatId?: string;
  };
  const { telegramId, username, sessionId, chatId } = state;

  const handleInvite = async () => {
    try {
      // 1. Создаём сессию через наш бэк
      const res = await axios.post("https://telsot.uz/game/start", {
        telegramId,
        username,
        chatId: chatId ?? `game_${telegramId}`, // если нет — фейковый
      });

      const newSessionId = res.data.session_id;

      // 2. Генерим ссылку для друга
      const gameUrl = `https://t.me/WordEngUz_bot?game=english&session_id=${newSessionId}`;
      const text = `Hey! Join me in Word Quiz! 🕹️`;

      const webLink = `https://t.me/share/url?url=${encodeURIComponent(
        gameUrl
      )}&text=${encodeURIComponent(text)}`;

      // 3. Пробуем нативный share
      if (navigator.share) {
        await navigator.share({
          title: "Word Quiz",
          text,
          url: gameUrl,
        });
      } else {
        // fallback — телеграм-шерилка
        window.open(webLink, "_blank");
      }
    } catch (err) {
      console.error("Ошибка при инвайте:", err);
      alert("Не удалось создать приглашение 😔");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-6">
      <h1 className="text-white font-bold text-[24px] mb-6">
        Word Quiz {username}
      </h1>

      <p className="bg-white">{sessionId}</p>
      <p className="bg-white">{telegramId}</p>
      <img src={image3} alt="Quiz" className="w-[220px] h-auto mb-10" />

      {/* Invite button */}
      <div
        className="flex items-center justify-center w-full max-w-[320px] h-[52px] rounded-full bg-white mb-4 shadow-md cursor-pointer"
        onClick={handleInvite}
      >
        <img src={shareplay} alt="Invite" className="w-5 h-5 mr-2" />
        <p className="text-black text-[16px] font-medium">Invite friends</p>
      </div>

      {/* Play button */}
      <Link
        to="/chooseLevel"
        state={{ telegramId, username, sessionId }}
        className="flex items-center justify-center w-full max-w-[320px] h-[52px] rounded-full bg-[#FFA500] shadow-md"
      >
        <img src={play} alt="Play" className="w-6 h-6 mr-2" />
        <p className="text-white text-[16px] font-semibold">Play</p>
      </Link>
    </div>
  );
};

export default Start;
