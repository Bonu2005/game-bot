import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  const [filter, setFilter] = useState<"all" | "level">("all");
  const handlePlayAgain = async () => {
    try {
      const { data: newSession } = await axios.post(
        "https://telsot.uz/game/start",
        {
          telegramId: state.telegramId,
          username: state.username,
        }
      );

      // ⏩ редирект в старт
      navigate("/start", {
        state: {
          sessionId: newSession.id,   // новый айди
          telegramId: state.telegramId,
          username: state.username,
          chatId: state.chatId,
        },
      });
    } catch (err) {
      console.error("Ошибка при старте новой игры:", err);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Берём результат игры
        const { data: session } = await axios.get(
          `https://telsot.uz/game/by/${state.sessionId}`
        );
console.log(session);

        // 2. Шлём результат на бек
        await axios.post("https://telsot.uz/game/result", {
          score: session.score,
          chatId: state.chatId,
          userId: state.telegramId,
          messageId: state.message_id,
          inline_messageId: state.inline_message_id,
        });

        // 3. Берём топ игроков
        const { data: top } = await axios.get(
          "https://telsot.uz/game/top"
        );
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

  return (
    <div className="text-white pt-8 pb-6 px-4 flex flex-col items-center">
      <h2 className="text-[20px] font-bold text-center mb-3">
        Leaders board {state.sessionId}
      </h2>

      {/* 🔘 Tabs All / Level */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-1 rounded-full ${filter === "all" ? "bg-green-600" : "bg-gray-700"
            }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("level")}
          className={`px-4 py-1 rounded-full ${filter === "level" ? "bg-green-600" : "bg-gray-700"
            }`}
        >
          Level {state.levelId}
        </button>
      </div>

      {/* 🏆 Players */}
      <div className="w-full max-w-md">
        {players.map((p, i) => (
          <div
            key={i}
            className={`flex justify-between items-center px-4 py-2 rounded-lg mb-2 ${i === 0 ? "bg-green-700" : "bg-gray-800"
              }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">{i + 1}</span>
              <span>{p.username || "Unknown"}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-yellow-400 font-bold">{p.score}</span>
              <span>🟡</span>
            </div>
          </div>
        ))}
      </div>

      {/* Show more */}
      <button className="text-blue-400 mt-2">Show more</button>

      {/* Play again */}
      <button
        onClick={handlePlayAgain}
        className="mt-6 bg-yellow-500 text-black font-bold px-6 py-2 rounded-full"
      >
        Play again
      </button>
    </div>
  );
};

export default Leaderboard;
