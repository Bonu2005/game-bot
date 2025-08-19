import image3 from "../../assets/imgs/image 3.svg";
import shareplay from "../../assets/imgs/shareplay.svg";
import play from "../../assets/imgs/play.circle.fill.svg";
import { Link } from "react-router-dom";

const Start = () => {
  return (
    <div className="flex flex-col items-center justify-center px-6">
      {/* Заголовок */}
      <h1 className="text-white font-bold text-[24px] mb-6">Word Quiz</h1>

      {/* Основное изображение */}
      <img src={image3} alt="Quiz" className="w-[220px] h-auto mb-10" />

      {/* Кнопка Invite Friends */}
      <div
        className="flex items-center justify-center w-full max-w-[320px] h-[52px] rounded-full bg-white mb-4 shadow-md cursor-pointer"
        onClick={() => {
          window.open(
            "https://t.me/WordEngUz_bot?game=english&text=Check out this cool game!",
            "_blank"
          );
        }}
      >
        <img src={shareplay} alt="Invite" className="w-5 h-5 mr-2" />
        <p className="text-black text-[16px] font-medium">Invite friends</p>
      </div>

      {/* Кнопка Play */}
      <Link
        to={"/chooseLevel"}
        className="flex items-center justify-center w-full max-w-[320px] h-[52px] rounded-full bg-[#FFA500] shadow-md"
      >
        <img src={play} alt="Play" className="w-6 h-6 mr-2" />
        <p className="text-white text-[16px] font-semibold">Play</p>
      </Link>
    </div>
  );
};

export default Start;
