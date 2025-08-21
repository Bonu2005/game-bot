import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type Player = {
  place: number;
  username: string;
  score: number;
  level?: string;
};

// SVG монетки
const COIN_SVG = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="12" fill="#FFC107" />
    <circle cx="12" cy="12" r="9" fill="#FFD54F" />
    <circle cx="12" cy="12" r="5" fill="#FFE082" />
  </svg>
);

const placeIcon = (place: number) => {
  if (place === 1) return "🥇";
  if (place === 2) return "🥈";
  if (place === 3) return "🥉";
  return null;
};

const Statistic = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(5);

  const navigate = useNavigate();

  // Получаем telegramId и username из Telegram Web App
  const telegramData = (window as any).Telegram?.WebApp?.initDataUnsafe?.user;
  const telegramId = telegramData?.id?.toString();
  const username = telegramData?.username || telegramData?.first_name;

  // Play Again
  const handlePlayAgain = async () => {
    if (!telegramId || !username) return alert("Не удалось получить Telegram данные");
    try {
      const res = await axios.post("https://твой_бэк/startGame", { telegramId, username });
      const newSessionId = res.data.session_id;
      navigate("/levels", { state: { sessionId: newSessionId } });
    } catch (err) {
      console.error(err);
      alert("Ошибка при создании новой игры");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lbRes = await axios.get("https://telsot.uz/game/leaderboard");
        const raw = lbRes.data;

        const arr: Player[] = Array.isArray(raw)
          ? raw.map((p: any) => ({
              place: p.place,
              username: p.username,
              score: p.score,
              level: p.level || "Unknown",
            }))
          : Array.isArray(raw?.players)
          ? raw.players.map((p: any) => ({
              place: p.place,
              username: p.username,
              score: p.score,
              level: p.level || "Unknown",
            }))
          : [];

        setPlayers(arr);
      } catch (e) {
        console.error(e);
        setError("Не удалось загрузить статистику");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const data = players.slice(0, visible);

  if (loading) return <p className="text-white text-center mt-10">Loading...</p>;
  if (error) return <p className="text-red-400 text-center mt-10">{error}</p>;

  return (
    <div className="text-white pt-8 pb-6 px-4 flex flex-col items-center">
      <h2 className="text-[20px] font-bold text-center mb-3">Leaders Board</h2>

      {/* Player List */}
      <div className="space-y-3 w-[344px]">
        {data.map((p) => {
          const isTop3 = p.place <= 3;
          const medal = placeIcon(p.place);

          return (
            <div
              key={`${p.username}-${p.place}`}
              className={`flex items-center justify-between px-4 py-3 rounded-xl ${
                isTop3 ? "bg-[#2DBE64] text-white" : "bg-white text-black"
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Medal / Place */}
                <div className="w-6 h-6 flex items-center justify-center">
                  {medal ? <span className="text-lg">{medal}</span> : <span className="text-sm font-bold">{p.place}</span>}
                </div>

                {/* Name + Level */}
                <div className="leading-tight">
                  <p className={`text-sm font-semibold ${isTop3 ? "text-white" : "text-black"}`}>
                    {p.username}
                  </p>
                  <p className={`text-xs ${isTop3 ? "text-white/90" : "text-gray-500"}`}>
                    {p.level || "Unknown"}
                  </p>
                </div>
              </div>

              {/* Score + Coin */}
              <div className={`flex items-center gap-1.5 text-sm font-bold ${isTop3 ? "text-white" : "text-black"}`}>
                <span>{p.score}</span>
                {COIN_SVG}
              </div>
            </div>
          );
        })}
      </div>

      {/* Show More */}
      <div
        className="mt-4 text-center text-blue-400 text-sm cursor-pointer select-none"
        onClick={() =>
          setVisible((v) => (v >= players.length ? 5 : Math.min(players.length, v + 5)))
        }
      >
        {visible >= players.length ? "Show less" : "Show more"}
      </div>

      {/* Play Again Button */}
      <div className="mt-8 flex justify-center w-[344px]">
        <button
          onClick={handlePlayAgain}
          className="bg-[#FFA500] text-white font-semibold rounded-full px-6 py-3 w-[344px] text-center"
        >
          Play again
        </button>
      </div>
    </div>
  );
};

export default Statistic;
