import logo from "../../assets/imgs/Logo Example.svg";
import loader from "../../assets/imgs/loader.png";
import { Link } from "react-router-dom";

const Home = () => {
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
