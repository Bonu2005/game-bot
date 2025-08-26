import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Game = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as {
    sessionId: string;
    levelId: number;
    telegramId: number;
    username: string;
    chatId:string,
      inline_message_id:string,
    message_id:string
  };
  const { sessionId, telegramId, username ,chatId,inline_message_id,message_id} = state || {};

  const [wordId, setWordId] = useState<string | null>(null);
  const [word, setWord] = useState<string | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [deadline, setDeadline] = useState<number>(0); // локальный дедлайн

  if (!sessionId) {
    navigate("/");
    return null;
  }

  // 📥 получить вопрос
  const fetchNextWord = async () => {
    try {
      setLoading(true);
      setSelectedAnswer(null);
      setIsCorrect(null);

      const res = await axios.get("https://telsot.uz/game/next-word", {
        params: { sessionId },
      });

      if (
        res.data.message === "Time is up. Game ended." ||
        res.data.message === "No more words available. Game ended."
      ) {
        navigate("/statistic", { state: { sessionId, telegramId, username,chatId } });
        return;
      }

      // берём лимит времени с бэка
      const timeLimitMs = res.data.timeLimitMs || 5000;
      const newDeadline = Date.now() + timeLimitMs;

      setWordId(res.data.word_id);
      setWord(res.data.word_en);
      setOptions(res.data.options);

      setDeadline(newDeadline);
      setTimeLeft(timeLimitMs);
    } catch (err) {
      console.error("Ошибка при получении слова:", err);
    } finally {
      setLoading(false);
      setDisabled(false);
    }
  };

  // 📤 отправить ответ
  const handleAnswer = async (answer: string) => {
    if (!wordId) return;
    setDisabled(true);
    setSelectedAnswer(answer);

    const timeTaken = Math.floor((deadline - Date.now()) / 1000);
    try {
      const res = await axios.post("https://telsot.uz/game/submit", {
        session_id: sessionId,
        word_id: wordId,
        selected: answer,
        time_taken: timeTaken,
      });

      if (res.data.message) {
        navigate("/statistic", { state: { sessionId, telegramId, username,inline_message_id,message_id } });
        return;
      }

      setIsCorrect(res.data.isCorrect);

      // Вибрация
      if (res.data.isCorrect) navigator.vibrate?.(150);
      else navigator.vibrate?.([100, 50, 100]);

      setTimeout(fetchNextWord, 800);
    } catch (err) {
      console.error("Ошибка при отправке ответа:", err);
      setDisabled(false);
    }
  };

  // ⏱ локальный таймер
  useEffect(() => {
    if (!deadline) return;

    const tick = () => {
      const left = Math.max(0, deadline - Date.now());
      setTimeLeft(left);
      if (left <= 0) {
        navigate("/statistic", { state: { sessionId, telegramId, username,inline_message_id,message_id } });
      }
    };

    const timer = setInterval(tick, 50);
    return () => clearInterval(timer);
  }, [deadline, navigate, sessionId, telegramId, username]);

  useEffect(() => {
    fetchNextWord();
  }, []);

  if (loading)
    return <div className="text-white text-center py-20">Loading...</div>;

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${seconds}:${milliseconds.toString().padStart(2, "0")}`;
  };

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
        <div className="w-[80px] h-[24px] bg-[#1E2A3A] rounded-full flex items-center justify-center text-[12px]">
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Timer bar */}
      <div className="w-full h-[6px] bg-gray-600 rounded-full mb-6">
        <div
          className="h-full bg-orange-400 rounded-full"
          style={{ width: `${(timeLeft / 5000) * 100}%` }}
        ></div>
      </div>

      <p className="text-[16px] mb-2 text-center">
        Find the English translation of the given word:
      </p>
      <h2 className="text-[24px] font-bold mb-6 text-center">{word}</h2>

      <div className="w-full space-y-4">
        {options.map((ans, index) => {
          // базовый стиль кнопки
          let bgClass = "bg-[#2C3A4D] hover:bg-[#36495f]";

          // если есть выбранный ответ и сервер вернул результат
          if (selectedAnswer && isCorrect !== null) {
            if (ans === selectedAnswer) {
              bgClass = isCorrect ? "bg-green-500" : "bg-red-500";
            }
            // подсветить правильный ответ после выбора (опционально)
            else if (!isCorrect && ans === word) {
              bgClass = "bg-green-500";
            }
          }

          return (
            <button
              key={index}
              disabled={disabled || (selectedAnswer !== null && isCorrect !== null)}
              onClick={() => handleAnswer(ans)}
              className={`w-full py-4 rounded-xl text-white text-[16px] font-semibold transition ${bgClass}`}
            >
              {ans}
            </button>
          );
        })}
      </div>

    </div>
  );
};

export default Game;
