import Navbar from "@/components/Navbar";
import PingComponent from "@/components/PingComponent";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const jwt = cookies().get("jwt");

  if (!jwt) {
    redirect("/login");
  }

  return (
    <div>
      <Navbar />
      <PingComponent />
    </div>
  );
}
