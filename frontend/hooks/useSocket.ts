"use client";
import { ADD_USER } from "@/lib/messages";
import { BACKEND_URL } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useUser } from "./useUser";

export default function useSocket() {
  const [socket, setSocket] = useState<null | WebSocket>();
  const user = useUser();

  useEffect(() => {
    if (!user) return;

    const wss = new WebSocket(BACKEND_URL!);

    wss.onopen = () => {
      if (socket) return;
      setSocket(wss);
      wss.send(
        JSON.stringify({
          type: ADD_USER,
          payload: {
            id: user.id,
          },
        })
      );
    };

    wss.onclose = () => {
      setSocket(null);
    };

    return () => wss.close();
  }, [user]);

  return socket;
}
