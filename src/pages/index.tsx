import { lazy } from "react";
import { useRoutes } from "react-router-dom";
import MainLayout from "../components/layout";

const ChooseLevel = lazy(() => import("./choose_level/ChooseLevel"));
const Game = lazy(() => import("./game/Game"));
const Home = lazy(() => import("./home/Home"));
const Statistic = lazy(() => import("./statistics/Statistic"));
const Start = lazy(() => import("./start/Start"))
const MainRouter = () => {
  return useRoutes([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "start",
          element: <Start />,
        },
        {
          path: "chooseLevel",
          element: <ChooseLevel />,
        },
        {
          path: "game",
          element: <Game />,
        },
        {
          path: "statistic",
          element: <Statistic />,
        },
      ],
    },
  ]);
};

export default MainRouter;
