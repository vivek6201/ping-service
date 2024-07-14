"use client";
import { BACKEND_URL, fetcher } from "@/lib/utils";
import { useEffect, useState } from "react";
import useSWR from "swr";

export const useUser = () => {
  const { data, error, isLoading } = useSWR(`${BACKEND_URL}/user`, fetcher);

  //any should be fixed after developement
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(data?.user);
  }, [data]);

  return user;
};
