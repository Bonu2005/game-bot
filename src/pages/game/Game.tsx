import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Game = () => {
  useEffect(() => {
    const audio = new Audio("/sounds/home.mp3"); // файл в public/sounds/home.mp3
    audio.loop = true;
    audio.volume = 0.5;

    // пробуем запустить
    audio.play().catch(() => {
      console.log("Автовоспроизведение заблокировано, ждём клика пользователя");
    });

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { sessionId: string; levelId: number, telegramId: number, username: string };
  const { sessionId, telegramId, username } = state || {};

  const [wordId, setWordId] = useState<string | null>(null);
  const [word, setWord] = useState<string | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [_, setIsCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(50);
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [startTime, setStartTime] = useState<number>(0); // для time_taken

  if (!sessionId) {
    navigate("/"); // если sessionId нет, возвращаем на главную
    return null;
  }

  const fetchNextWord = async () => {
    try {
      setLoading(true);
      setSelectedAnswer(null);
      setIsCorrect(null);

      const res = await axios.get("https://telsot.uz/game/next-word", {
        params: { session_id: sessionId },
      });

      if (
        res.data.message === "Game ended by timer" ||
        res.data.message === "No more words available"
      ) {
        navigate("/statistic", { state: { sessionId, telegramId, username } });
        return;
      }

      setWordId(res.data.word_id);
      setWord(res.data.word_en);
      setOptions(res.data.options);
      setCorrectAnswer(res.data.correct_uz); // бэк отдаёт правильный ответ
      setTimeLeft(res.data.time_left || 50);

      setStartTime(Date.now()); // фиксируем момент появления вопроса
    } catch (err) {
      console.error("Ошибка при получении слова:", err);
    } finally {
      setLoading(false);
      setDisabled(false);
    }
  };

  const handleAnswer = async (answer: string) => {
    if (!wordId) return;
    setDisabled(true);
    setSelectedAnswer(answer);

    const timeTaken = Math.floor((Date.now() - startTime) / 1000); // считаем в секундах

    try {
      const res = await axios.post("https://telsot.uz/game/submit-answer", {
        session_id: sessionId,
        word_id: wordId,
        selected: answer,
        time_taken: timeTaken, // добавили
      });

      setIsCorrect(res.data.isCorrect);

      // через короткую паузу идёт следующий вопрос
      setTimeout(() => {
        fetchNextWord();
      }, 800); // 0.8 секунды чтобы пользователь увидел цвет
    } catch (err) {
      console.error("Ошибка при отправке ответа:", err);
      setDisabled(false);
    }
  };

  useEffect(() => {
    let timer: any;
    if (timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else {
      navigate("/statistic", { state: { sessionId, telegramId, username } });
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
        {options.map((ans, index) => {
          let bgClass = "bg-[#2C3A4D] hover:bg-[#36495f]";
          if (selectedAnswer) {
            if (ans === correctAnswer) bgClass = "bg-green-500";
            else if (ans === selectedAnswer) bgClass = "bg-red-500";
          }

          return (
            <button
              key={index}
              disabled={disabled}
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
