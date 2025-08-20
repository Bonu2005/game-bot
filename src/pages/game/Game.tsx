import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Game = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { sessionId: string; levelId: number };
  const { sessionId } = state || {};

  const [wordId, setWordId] = useState<number | null>(null);
  const [word, setWord] = useState<string | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(50);
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);

  if (!sessionId) {
    navigate("/"); // если sessionId нет, возвращаем на главную
    return null;
  }

  const fetchNextWord = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://telsot.uz/game/next-word", {
        params: { session_id: sessionId },
      });

      if (
        res.data.message === "Game ended by timer" ||
        res.data.message === "No more words available"
      ) {
        navigate("/statistic");
        return;
      }

      setWordId(res.data.word_id);
      setWord(res.data.word_en);
      setOptions(res.data.options);
      setTimeLeft(res.data.time_left || 50);
    } catch (err) {
      console.error("Ошибка при получении слова:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (answer: string) => {
    try {
      setDisabled(true);
      await axios.post("https://telsot.uz/game/submit-answer", {
        session_id: sessionId,
        word_id: wordId,
        answer,
      });
      await fetchNextWord();
    } catch (err) {
      console.error("Ошибка при отправке ответа:", err);
    } finally {
      setDisabled(false);
    }
  };

  useEffect(() => {
    let timer: any;
    if (timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else {
      navigate("/statistic");
    }
    return () => clearInterval(timer);
  }, [timeLeft, navigate]);

  useEffect(() => {
    fetchNextWord();
  }, []);

  if (loading) {
    return <div className="text-white text-center py-20">Loading...</div>;
  }

  return (
    <div className="text-white px-6 py-10 flex flex-col items-center">
      {/* Header */}
      <div className="w-full flex justify-between items-center mb-4">
        <button
          className="text-blue-400 font-semibold"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
        <p className="text-white font-bold">Quiz</p>
        <div className="w-[60px] h-[24px] bg-[#1E2A3A] rounded-full flex items-center justify-center text-[12px]">
          {timeLeft}s
        </div>
      </div>

      {/* Timer bar */}
      <div className="w-full h-[6px] bg-gray-600 rounded-full mb-6">
        <div
          className="h-full bg-orange-400 rounded-full"
          style={{ width: `${(timeLeft / 50) * 100}%` }}
        ></div>
      </div>

      <p className="text-[16px] mb-2 text-center">
        Find the English translation of the given word:
      </p>
      <h2 className="text-[24px] font-bold mb-6 text-center">{word}</h2>

      <div className="w-full space-y-4">
        {options.map((ans, index) => (
          <button
            key={index}
            disabled={disabled}
            onClick={() => handleAnswer(ans)}
            className={`w-full py-4 rounded-xl text-white text-[16px] font-semibold transition ${
              disabled
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-[#2C3A4D] hover:bg-[#36495f]"
            }`}
          >
            {ans}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Game;
