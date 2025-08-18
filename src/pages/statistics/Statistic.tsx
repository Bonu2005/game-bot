import { useEffect, useState } from "react";
import axios from "axios";

const Statistic = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get("http://localhost:3000/game/leaderboard");
        setPlayers(res.data.players); // backend должен вернуть { players: [...] }
      } catch (err) {
        console.error("Ошибка загрузки статистики:", err);
        setError("Не удалось загрузить статистику");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return <p className="text-white text-center mt-10">Loading...</p>;
  }

  if (error) {
    return <p className="text-red-400 text-center mt-10">{error}</p>;
  }

  return (
    <div className="text-white pt-10 pb-6 px-4">
      {/* Title */}
      <h2 className="text-[20px] font-bold text-center mb-4">Leaders board</h2>

      {/* Tabs */}
      <div className="flex justify-center mb-4 space-x-2">
        <button className="bg-[#1E2A3A] text-white px-4 py-1 rounded-full text-sm">
          All
        </button>
        <button className="bg-[#1E2A3A] text-white px-4 py-1 rounded-full text-sm">
          Level
        </button>
      </div>

      {/* Player list */}
      <div className="space-y-3">
        {players.map((p, i) => (
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
                <p
                  className={`text-sm font-semibold ${
                    i === 0 ? "text-white" : "text-black"
                  }`}
                >
                  {p}
                </p>
                <p
                  className={`text-xs ${
                    i === 0 ? "text-white opacity-80" : "text-green-500"
                  }`}
                >
                  {p}
                </p>
              </div>
            </div>
            <div
              className={`text-sm font-bold ${
                i === 0 ? "text-white" : "text-black"
              }`}
            >
              {p}
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