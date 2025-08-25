 
import { useEffect } from 'react';
import MainRouter from './pages'


function App() {
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
    <>
     <MainRouter/>
    </>
  )
}

export default App



