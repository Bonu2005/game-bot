import { useState, useEffect } from "react";

declare global {
  interface Window {
    Telegram?: {
      WebApp?: any;
    };
  }
}

export function useTelegram() {
  const [user, setUser] = useState<any | null | false>(null);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    tg?.ready();

    if (tg?.initDataUnsafe?.user) {
      setUser(tg.initDataUnsafe.user);
    } else {
      setUser(false); 
    }
  }, []);

  return {
    userId: user?.id || (user === false ? "" : null), 
    firstName: user?.first_name || "",
    lastName: user?.last_name || "",
    username: user?.username || "",
  };
}
