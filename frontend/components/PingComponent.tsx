"use client";
import useSocket from "@/hooks/useSocket";
import { BACKEND_URL, fetcher } from "@/lib/utils";
import React, { useEffect } from "react";
import useSWR from "swr";
import UserCard from "./UserCard";
import { Button } from "./ui/button";
import { useUser } from "@/hooks/useUser";
import { PING_ALL, PING_RECIEVED } from "@/lib/messages";
import { toast } from "sonner";

export default function PingComponent() {
  const socket = useSocket();
  const user = useUser();

  const handlePing = (event: MessageEvent<any>) => {
    const message = JSON.parse(event.data);

    if (message.type === PING_RECIEVED) {
      console.log({ message });

      toast.info(`you got pinged`, {
        position: "top-center",
        dismissible: true,
      });
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.addEventListener("message", handlePing);
  }, [socket]);

  const { data, error, isLoading } = useSWR(`${BACKEND_URL}/user/all`, fetcher);

  let users = !isLoading ? data?.users : null;

  users = users?.filter((it: any) => it.id !== user?.id);

  const pingAllUsers = () => {
    if (!user) return;
    if (!socket) return;

    socket.send(
      JSON.stringify({
        type: PING_ALL,
        payload: {
          from: user,
        },
      })
    );
  };

  return (
    <div className="flex flex-col py-10 justify-between min-h-[800px]">
      <div className="p-10 min-h-[300px] grid xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5">
        {users?.map((item: any) => (
          <UserCard item={item} key={item.id} />
        ))}
      </div>
      <Button className="w-[300px] self-center" onClick={pingAllUsers}>
        Ping All Users
      </Button>
    </div>
  );
}
