import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

type Player = {
  place: number;
  username: string;
  score: number;
  level?: string;
};

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
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  
  // Получаем telegramId и username из URL
  const telegramId = params.get("telegramId");
  const username = params.get("username");

  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(5);

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

  const handlePlayAgain = async () => {
    if (!telegramId || !username) return;

    try {
      const res = await axios.post("https://telsot.uz/game/startGame", { telegramId, username });
      const newSessionId = res.data.session_id;

      // Перенаправляем в Start с новым sessionId
      navigate("/start", { state: { telegramId, username, sessionId: newSessionId } });
    } catch (err) {
      console.error("Ошибка при запуске новой игры:", err);
    }
  };

  const data = players.slice(0, visible);

  if (loading) return <p className="text-white text-center mt-10">Loading...</p>;
  if (error) return <p className="text-red-400 text-center mt-10">{error}</p>;

  return (
    <div className="text-white pt-8 pb-6 px-4 flex flex-col items-center">
      <h2 className="text-[20px] font-bold text-center mb-3">Leaders board</h2>

      <div className="flex items-center justify-center gap-2 mb-4">
        <button className="bg-[#2DBE64] text-white text-sm px-4 py-1 rounded-full">All</button>
        <button className="bg-[#2C2C2C] text-white text-sm px-4 py-1 rounded-full">Level</button>
      </div>

      <div className="space-y-3 w-[344px]">
        {data.map((p) => {
          const isFirst = p.place === 1;
          const medal = placeIcon(p.place);

          return (
            <div
              key={`${p.username}-${p.place}`}
              className={`flex items-center justify-between px-4 py-3 rounded-xl ${
                isFirst ? "bg-[#2DBE64] text-white" : "bg-white text-black"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 flex items-center justify-center">
                  {medal ? <span className="text-lg">{medal}</span> : <span className="text-sm font-bold">{p.place}</span>}
                </div>
                <div className="leading-tight">
                  <p className={`text-sm font-semibold ${isFirst ? "text-white" : "text-black"}`}>{p.username}</p>
                  <p className={`text-xs ${isFirst ? "text-white/90" : "text-gray-500"}`}>{p.level || "Unknown"}</p>
                </div>
              </div>
              <div className={`flex items-center gap-1.5 text-sm font-bold ${isFirst ? "text-white" : "text-black"}`}>
                <span>{p.score}</span>
                {COIN_SVG}
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="mt-4 text-center text-blue-400 text-sm cursor-pointer select-none"
        onClick={() => setVisible((v) => (v >= players.length ? 5 : Math.min(players.length, v + 5)))}
      >
        {visible >= players.length ? "Show less" : "Show more"}
      </div>

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
