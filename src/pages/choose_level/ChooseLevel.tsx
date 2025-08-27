import { useNavigate } from "react-router-dom";
import axios from "axios";

import beginner from "../../assets/imgs/beginner.svg";
import elementary from "../../assets/imgs/elementary.svg";
import pre_inter from "../../assets/imgs/pre-inter.svg";
import inter from "../../assets/imgs/inter.svg";
import upper from "../../assets/imgs/upper.svg";
import advanced from "../../assets/imgs/advenced.svg";

const levels = [
  { id: 1, icon: beginner, label: "Beginner" },
  { id: 2, icon: elementary, label: "Elementary" },
  { id: 3, icon: pre_inter, label: "Pre-intermediate" },
  { id: 4, icon: inter, label: "Intermediate" },
  { id: 5, icon: upper, label: "Upper Intermediate" },
  { id: 6, icon: advanced, label: "Advanced" },
];

const ChooseLevel = () => {
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  console.log(params);

  const telegramId = params.get("telegramId") || undefined;
  const username = params.get("username") || undefined;
  const sessionIdParam = params.get("sessionId") || undefined;
  const chatId = params.get("chatId") || null;
  const inline_message_id = params.get("inline_message_id") || "";
  const message_id = params.get("message_id") || "";

  const handleChoose = async (levelId: number) => {
    if (!sessionIdParam || !telegramId) {
      alert("⚠️ Ошибка: нет активной игровой сессии");
      navigate("/");
      return;
    }

    try {
      // фиксируем выбор уровня на бэке
      await axios.post(
        `https://telsot.uz/game/choose-level?sessionId=${sessionIdParam}&level=${levelId}`
      );


      // переходим к игре
      navigate("/game", {
        state: {
          sessionId:sessionIdParam, levelId, telegramId, username, chatId, inline_message_id,
          message_id
        },
      });
    } catch (err) {
      console.error("Ошибка при выборе уровня:", err);
      alert("Не удалось выбрать уровень. Попробуй снова!");
    }
  };

  return (
    <div className="flex flex-col items-center py-10 px-6">
      <h1 className="text-white font-bold text-[24px] mb-8">
        Choose your level
      </h1>
      <div className="grid grid-cols-2 gap-x-5 gap-y-6">
        {levels.map((level) => (
          <div
            key={level.id}
            className="relative w-[140px] h-[140px] rounded-2xl overflow-hidden cursor-pointer transition-transform hover:scale-105"
            onClick={() => handleChoose(level.id)}
          >
            <img
              src={level.icon}
              alt={level.label}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-[10px] w-full text-center">
              <p className="text-white text-[14px] font-semibold bg-[#f0f0f0]/70 rounded-md px-2 inline-block">
                {level.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChooseLevel;
