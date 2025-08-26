
import { Link, useLocation } from "react-router-dom";

import image3 from "../../assets/imgs/image 3.svg";
import shareplay from "../../assets/imgs/shareplay.svg";
import play from "../../assets/imgs/play.circle.fill.svg";

const Start = () => {
  const location = useLocation();

  // 👉 берем параметры из URL
  const params = new URLSearchParams(location.search);
  console.log(params);
  
  const telegramId = params.get("telegramId") || undefined;
  const username = params.get("username") || undefined;
  const sessionIdParam = params.get("sessionId") || undefined;
  const chatId = params.get("chatId") || null;
  const inline_message_id = params.get("inline_message_id") || "";
  const message_id = params.get("message_id") || "";
  

  console.log(sessionIdParam);
  

  console.log(telegramId, username, inline_message_id, message_id);

  const handleInvite = async () => {
    if (!telegramId || !username) return;

    try {
      const gameUrl = `https://t.me/WordEngUz_bot?game=english`;
      const shareText = `Hey! Join me in Word Quiz! 🕹️`;

      const webShareLink = `https://t.me/share/url?url=${encodeURIComponent(
        gameUrl
      )}&text=${encodeURIComponent(shareText)}`;

      if (navigator.share) {
        await navigator.share({ title: "Word Quiz", text: shareText, url: gameUrl });
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
      <h1 className="text-white font-bold text-[24px] mb-6">Word Quiz</h1>

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
        to={`/chooseLevel?telegramId=${telegramId}&username=${username}&sessionId=${sessionIdParam}&chatId=${chatId}&inline_message_id=${inline_message_id}&message_id=${message_id}`}
        className="flex items-center justify-center w-full max-w-[320px] h-[52px] rounded-full bg-[#FFA500] shadow-md"
      >
        <img src={play} alt="Play" className="w-6 h-6 mr-2" />
        <p className="text-white text-[16px] font-semibold">Play</p>
      </Link>
    </div>
  );
};

export default Start;
