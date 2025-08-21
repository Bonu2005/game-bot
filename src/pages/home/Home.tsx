import logo from "../../assets/imgs/Logo Example.svg";
import loader from "../../assets/imgs/loader.png";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

const Home = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const telegramId = params.get("telegramId");
  const username = params.get("username");
  const sessionId = params.get("session_id");

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

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mb-[140px]">
        <Link
          to="/start"
          state={{ telegramId, username, sessionId }}
        >
          <img src={logo} alt="logo" />
        </Link>
      </div>
      <img src={loader} alt="loader" />
    </div>
  );
};

export default Home;
