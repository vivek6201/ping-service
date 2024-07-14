import axios from "axios";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const BACKEND_URL = "https://ping-service-sdcy.onrender.com";

export const fetcher = async (url: string) =>
  axios
    .get(url, {
      withCredentials: true,
    })
    .then((res) => res.data)
    .catch((error) => console.log(error));
