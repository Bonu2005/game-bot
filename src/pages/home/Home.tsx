import logo from "../../assets/imgs/Logo Example.svg";
import loader from "../../assets/imgs/loader.png";
import { Link, useLocation } from "react-router-dom";


const Home = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const telegramId = params.get("telegramId");
  const username = params.get("username");
  const sessionId = params.get("session_id");
  const chatId = params.get("chatId");



  return (
    <div className="flex flex-col items-center justify-center">
      <p className="bg-white">query: {params.toString()}</p>
      <p className="bg-white">sessionId: {sessionId}</p>
      <p className="bg-white">telegramId: {telegramId}</p>
      <p className="bg-white">username: {username}</p>
      <p className="bg-white">username: {username}</p>
      <p className="bg-white">username: {chatId}</p>
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
