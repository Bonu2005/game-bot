import logo from "../../assets/imgs/Logo Example.svg";
import loader from "../../assets/imgs/loader.png";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const Home = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("user_id");
    const name = params.get("username");

    console.log("👉 Параметры из URL (Home):", { id, name });

    if (id) localStorage.setItem("telegramId", id);
    if (name) localStorage.setItem("username", name);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mb-[140px]">
        <Link to={"/start"}>
          <img src={logo} alt="logo" />
        </Link>
      </div>
      <img src={loader} alt="loader" />
    </div>
  );
};

export default Home;
