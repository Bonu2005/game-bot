import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const Statistic = () => {
  const location = useLocation();
  const { sessionId } = (location.state as { sessionId?: string }) || {};
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sessionResult, setSessionResult] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Лидерборд (все игроки по глобальному score)
        const lbRes = await axios.get("https://telsot.uz/game/leaderboard");
        setPlayers(lbRes.data.players);

        // 2. Результат этой сессии (только если передан sessionId)
        if (sessionId) {
          const res = await axios.get(`https://telsot.uz/game/result/${sessionId}`);
          setSessionResult(res.data);
        }
      } catch (err) {
        console.error("Ошибка загрузки:", err);
        setError("Не удалось загрузить статистику");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sessionId]);

  if (loading) {
    return <p className="text-white text-center mt-10">Loading...</p>;
  }

  if (error) {
    return <p className="text-red-400 text-center mt-10">{error}</p>;
  }

  return (
    <div className="text-white pt-10 pb-6 px-4">
      {/* 🔹 если есть результат игры — показываем его сверху */}
      {sessionResult && (
        <div className="mb-6 text-center">
          <div className="bg-[#2DBE64] text-white px-4 py-3 rounded-xl inline-block">
            🎉 {sessionResult.username} набрал{" "}
            <span className="font-bold">{sessionResult.total_score}</span> очков!
          </div>
        </div>
      )}

      {/* Title */}
      <h2 className="text-[20px] font-bold text-center mb-4">Leaderboard</h2>

      {/* Player list */}
      <div className="space-y-3">
        {players?.map((p, i) => (
          <div
            key={i}
            className={`w-[344px] mx-auto flex items-center justify-between px-4 py-3 rounded-xl ${
              i === 0 ? "bg-[#2DBE64] text-white" : "bg-white text-black"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold bg-yellow-400 text-black">
                {i + 1}
              </div>
              <div>
                <p className={`text-sm font-semibold ${i === 0 ? "text-white" : "text-black"}`}>
                  {p.username}
                </p>
                <p className={`text-xs ${i === 0 ? "text-white opacity-80" : "text-green-500"}`}>
                  {p.league || "Bronze"}
                </p>
              </div>
            </div>
            <div className={`text-sm font-bold ${i === 0 ? "text-white" : "text-black"}`}>
              {p.score}
            </div>
          </div>
        ))}
      </div>

      {/* Show more */}
      <div className="mt-4 text-center text-blue-400 text-sm cursor-pointer">
        Show more
      </div>

      {/* Play again */}
      <div className="mt-8 flex justify-center w-[344px]">
        <button className="flex items-center gap-2 bg-[#FFA500] text-white font-semibold rounded-full px-6 py-3 w-[344px] text-center">
          <span>▶️</span> Play again
        </button>
      </div>
    </div>
  );
};

export default Statistic;
