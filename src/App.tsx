 
// import { useEffect } from 'react';
// import MainRouter from './pages'

import { useTelegram } from "./hooks/UseTelegram";

// function App() {
//     useEffect(() => {
//     const audio = new Audio("/sounds/home.mp3"); // файл в public/sounds/home.mp3
//     audio.loop = true;
//     audio.volume = 0.5;

//     // пробуем запустить
//     audio.play().catch(() => {
//       console.log("Автовоспроизведение заблокировано, ждём клика пользователя");
//     });

//     return () => {
//       audio.pause();
//       audio.currentTime = 0;
//     };
//   }, []);
   

//   return (
//     <>
//      <MainRouter/>
//     </>
//   )
// }

// export default App




const App = () => {
  const { userId, firstName, lastName, username } = useTelegram();

  return (
    <div>
      <p>Sizning chat ID: {userId}</p>
      <p>Sizning firstName: {firstName}</p>
      {lastName && <p>Sizning lastName: {lastName}</p>}
      {username && <p>Sizning username: {username}</p>}
    </div>
  );
};

export default App;
