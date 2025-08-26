import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

// type Player = {
//   place: number;
//   username: string;
//   score: number;
//   level?: string;
// };

const Statistic = () => {

  const location = useLocation();
  const state = location.state as {
    sessionId: string;
    levelId: number;
    telegramId: number;
    username: string;
    chatId: string,
    inline_message_id: string,
    message_id: string
  };
  const [loading, setLoading] = useState(true);
  console.log(state.telegramId);

  // 📌 Сразу при заходе в статистику шлём сообщение в чат
  useEffect(() => {
    const sendMessageToChat = async () => {
      try {
        await axios.post("https://telsot.uz/game/result", {
          score: 8,
          chatId: state.chatId,
          userId: state.telegramId,
          messageId: state.message_id,
          inline_messageId: state.inline_message_id,
        });


        console.log(state.chatId, state.inline_message_id);
      } catch (err) {
        console.error("Ошибка при отправке сообщения в чат:", err);
      } finally {
        setLoading(false);
      }
    };
 sendMessageToChat();

  }, [state]);

  if (loading) return <p className="text-white text-center mt-10">Loading...</p>;

  return (
    <div className="text-white pt-8 pb-6 px-4 flex flex-col items-center">
      <h2 className="text-[20px] font-bold text-center mb-3">Statistic</h2>
      <p className="text-gray-400">Сообщение отправлено в чат</p>
    </div>
  );
};

export default Statistic;

