"use client";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BACKEND_URL, fetcher } from "@/lib/utils";
import { useUser } from "@/hooks/useUser";
import axios from "axios";
import { toast } from "sonner";

export const ActionComponent = () => {
  return (
    <div className="flex justify-center items-center gap-x-5 mt-5">
      <Link href={"/login"}>
        <Button variant={"outline"}>Login</Button>
      </Link>
      <Link href={"/signup"}>
        <Button>Signup</Button>
      </Link>
    </div>
  );
};

export default function Navbar() {
  const user = useUser();

  const handleLogout = async () => {
    const res = await axios.delete(`${BACKEND_URL}/user/logout`);
    const data = res.data;

    if (data.success) {
      toast.success("Logged out Successfully", {
        position: "top-center",
      });
    }
  };

  return (
    <div className="flex py-4 border-b shadow-md justify-between items-center px-10">
      <p className="font-bold text-xl">Ping Pong</p>
      <div className="flex items-center justify-between gap-x-5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} className="capitalize">
              {user?.name}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Button className="w-full" onClick={handleLogout}>
                Logout
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
