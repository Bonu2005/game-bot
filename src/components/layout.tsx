import bg from "../assets/imgs/background.png"

import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div
          className="w-[375px] h-[667px] rounded-2xl shadow-lg overflow-hidden bg-cover bg-center flex flex-col items-center justify-center"
          style={{ backgroundImage: `url(${bg})` }}
        >
          <Outlet/>
 
        </div>
      </div>
    </>
  );
}
