import React from "react";
import { Button } from "./ui/button";
import useSocket from "@/hooks/useSocket";
import { PING } from "@/lib/messages";
import { useUser } from "@/hooks/useUser";

export default function UserCard({
  item,
}: {
  item: { name: string; email: string; id: string };
}) {
  const socket = useSocket();
  const user = useUser();

  const pingUser = (reciever: any) => {
    if (!socket) return;
    if (!user) return;

    socket.send(
      JSON.stringify({
        type: PING,
        payload: {
          from: user,
          to: reciever,
        },
      })
    );
  };

  return (
    <div className="p-5 shadow-md rounded-lg border hover:border-slate-600 transition-all duration-200 flex flex-col space-y-5 items-center justify-evenly">
      <div className="flex flex-col items-center">
        <p className="font-bold uppercase">{item.name}</p>
        <p className="mt-2">{item.email}</p>
      </div>
      <Button className="" onClick={() => pingUser(item)}>
        Ping
      </Button>
    </div>
  );
}
