import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import goldMedal from "../../assets/imgs/oltin.svg"
// import secondMedal from "../../assets/imgs/secondmedalSerebro.svg"
// import thirdmedal from "../../assets/imgs/thirdmedal.svg"
import coin from "../../assets/imgs/Gold_Star.svg"
import axios from "axios";

type Player = {
  username: string;
  score: number;
  bestLevel?: number | null;
};

const Leaderboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as {
    sessionId: string;
    levelId: number;
    telegramId: string;
    username: string;
    chatId: string;
    inline_message_id: string;
    message_id: string;
  };

  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  const handlePlayAgain = async () => {
    try {
      const { data: newSession } = await axios.post(
        "https://telsot.uz/game/start",
        {
          telegramId: state.telegramId,
          username: state.username,
        }
      );

      navigate(
        `/start?telegramId=${state.telegramId}&username=${state.username}&sessionId=${newSession.session_id}&chatId=${state.chatId ?? ""}&inline_message_id=${state.inline_message_id}&message_id=${state.message_id}`
      );
    } catch (err) {
      console.error("Ошибка при старте новой игры:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: session } = await axios.get(
          `https://telsot.uz/game/by/${state.sessionId}`
        );

        await axios.post("https://telsot.uz/game/result", {
          score: session.score,
          chatId: state.chatId,
          userId: state.telegramId,
          messageId: state.message_id,
          inline_messageId: state.inline_message_id,
        });

        const { data: top } = await axios.get("https://telsot.uz/game/top");
        setPlayers(top);
      } catch (err) {
        console.error("Ошибка загрузки статистики:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [state]);

  if (loading)
    return <p className="text-white text-center mt-10">Loading...</p>;

  // картинки медалей (ты сама подставишь пути)
  const medalImages: Record<number, string> = {
    1: "../../assets/imgs/oltin.svg",
    2: "../../assets/imgs/secondmedalSerebro.svg",
    3: "../../assets/imgs/thirdmedal.svg",
  };

  const getLevelLabel = (level?: number | null) => {
    switch (level) {
      case 1:
        return "Beginner";
      case 2:
        return "Elementary";
      case 3:
        return "Pre-Intermediate";
      default:
        return "";
    }
  };

  return (
    <div className="text-white pt-8 pb-6 px-4 flex flex-col items-center">
      <h2 className="text-[20px] font-bold text-center mb-4">
        Leaders board
      </h2>

      <div className="w-full max-w-md flex flex-col gap-2">
        {players.map((p, i) => {
          const rank = i + 1;
          const isFirst = rank === 1;
          const level = getLevelLabel(p.bestLevel);

          return (
            <div
              key={i}
              className={`flex justify-between items-center px-4 py-3 rounded-xl shadow
              ${isFirst ? "bg-green-600 text-white" : "bg-white text-black"}`}
            >
              {/* Левая часть: Медаль или номер */}
              <div className="flex items-center gap-3">
                {rank <= 3 ? (
                  <img
                    src={goldMedal}
                    alt={`medal-${rank}`}
                    className="w-8 h-8"
                  />
                ) : (
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 font-bold">
                    {rank}
                  </div>
                )}
                {/* Имя + уровень */}
                <div className="flex flex-col">
                  <span
                    className={`font-semibold ${isFirst ? "text-white" : "text-black"
                      }`}
                  >
                    {p.username || "Unknown"}
                  </span>
                  {level && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full w-fit mt-0.5 ${isFirst
                        ? "bg-white text-green-600"
                        : "bg-green-600 text-white"
                        }`}
                    >
                      {level}
                    </span>
                  )}
                </div>
              </div>

              {/* Правая часть: Score + coin */}
              <div className="flex items-center gap-1">
                <span
                  className={`font-bold ${isFirst ? "text-white" : "text-gray-600"
                    }`}
                >
                  {p.score}
                </span>
                {/* Плейсхолдер под coin */}
                <img
                  src={coin}
                  alt="coin"
                  className="w-5 h-5"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Play again button */}
      <button
        onClick={handlePlayAgain}
        className="mt-8 bg-[#FF9F1C] text-white font-bold px-6 py-3 rounded-full flex items-center gap-2 text-lg"
      >
        <img src="/assets/icons/replay.png" alt="replay" className="w-5 h-5" />
        Play again
      </button>
    </div>
  );
};

export default Leaderboard;
