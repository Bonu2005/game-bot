import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import beginner from "../../assets/imgs/beginner.svg";
import elementary from "../../assets/imgs/elementary.svg";
import pre_inter from "../../assets/imgs/pre-inter.svg";
import inter from "../../assets/imgs/inter.svg";
import upper from "../../assets/imgs/upper.svg";
import advanced from "../../assets/imgs/advenced.svg";

const levels = [
  { icon: beginner, label: "Beginner" },
  { icon: elementary, label: "Elementary" },
  { icon: pre_inter, label: "Pre-intermediate" },
  { icon: inter, label: "Intermediate" },
  { icon: upper, label: "Upper Intermediate" },
  { icon: advanced, label: "Advanced" },
];

const ChooseLevel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { sessionId?: string };
  const sessionId = state?.sessionId;

  const handleChoose = async (level: string) => {
    try {
      if (!sessionId) {
        console.error("Нет session_id — начни игру сначала");
        navigate("/");
        return;
      }

      await axios.post("http://3.76.216.99:3000/game/choose-level", {
        session_id: sessionId,
        level,
      });

      navigate("/game");
    } catch (err) {
      console.error("Ошибка при выборе уровня:", err);
    }
  };

  return (
    <div className="flex flex-col items-center py-10 px-6">
      <h1 className="text-white font-bold text-[24px] mb-8">Choose your level</h1>
      <div className="grid grid-cols-2 gap-x-5 gap-y-6">
        {levels.map((level, index) => (
          <div
            key={index}
            className="relative w-[140px] h-[140px] rounded-2xl overflow-hidden cursor-pointer"
            onClick={() => handleChoose(level.label)}
          >
            <img src={level.icon} alt={level.label} className="w-full h-full object-cover" />
            <div className="absolute bottom-[10px] w-full text-center">
              <p className="text-white text-[14px] font-semibold">{level.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChooseLevel;