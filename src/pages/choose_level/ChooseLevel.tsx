import { useLocation, useNavigate } from "react-router-dom";
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
  const location = useLocation();
  const state = location.state as { sessionId?: string };
  const sessionId = state?.sessionId;

  const handleChoose = async (levelId: number) => {
    try {
      if (!sessionId) {
        console.error("Нет session_id — начни игру сначала");
        navigate("/");
        return;
      }
      console.log(levelId);
            navigate("/game", {
        state: { sessionId, levelId },
      });
      await axios.post(
        `https://telsot.uz/game/choose-level?session_id=${sessionId}`,
        { level: levelId }
      );

      // Передаём sessionId и выбранный levelId в Game

    } catch (err) {
      console.error("Ошибка при выборе уровня:", err);
    }
  };

  return (
    <div className="flex flex-col items-center py-10 px-6">
      <h1 className="text-white font-bold text-[24px] mb-8">Choose your level {sessionId}</h1>
      <div className="grid grid-cols-2 gap-x-5 gap-y-6">
        {levels?.map((level) => (
          <div
            key={level.id}
            className="relative w-[140px] h-[140px] rounded-2xl overflow-hidden cursor-pointer"
            onClick={() => handleChoose(level.id)}
          >
            <img
              src={level.icon}
              alt={level.label}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-[10px] w-full text-center">
              <p className="text-white text-[14px] font-semibold">
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
