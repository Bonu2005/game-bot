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

  const state = location.state as { telegramId?: number; username?: string; sessionId?: string };

  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!state?.sessionId) return;
      try {
        const res = await axios.get("https://telsot.uz/game/result", {
          params: { sessionId: state.sessionId },
        });

        const data = res.data;

        // создаем "игрока" с place = 1
        setPlayer({
          place: 1,
          username: data.username,
          score: data.total_score,
          level: data.level || "Unknown",
        });
      } catch (err) {
        console.error(err);
        setError("Не удалось загрузить результат");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [state?.sessionId]);

  const handlePlayAgain = async () => {
    if (!state?.telegramId || !state?.username) return;
    try {
      const res = await axios.post("https://telsot.uz/game/start", {
        telegramId: state.telegramId,
        username: state.username,
        chatId: null,
      });
      const newSessionId = res.data.session_id;
      navigate("/start", { state: { telegramId: state.telegramId, username: state.username, sessionId: newSessionId } });
    } catch (err) {
      console.error("Ошибка при запуске новой игры:", err);
    }
  };

  if (loading) return <p className="text-white text-center mt-10">Loading...</p>;
  if (error) return <p className="text-red-400 text-center mt-10">{error}</p>;

  return (
    <div className="text-white pt-8 pb-6 px-4 flex flex-col items-center">
      <h2 className="text-[20px] font-bold text-center mb-3">Ваш результат</h2>

      {player && (
        <div className={`flex items-center justify-between px-4 py-3 rounded-xl bg-[#2DBE64] text-white w-[344px]`}>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 flex items-center justify-center">
              <span className="text-lg">{placeIcon(player.place)}</span>
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold">{player.username}</p>
              <p className="text-xs text-white/90">{player.level}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-sm font-bold">
            <span>{player.score}</span>
            {COIN_SVG}
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-center w-[344px]">
        <button
          onClick={handlePlayAgain}
          className="bg-[#FFA500] text-white font-semibold rounded-full px-6 py-3 w-[344px] text-center"
        >
          Играть снова
        </button>
      </div>
    </div>
  );
};

export default Statistic;
