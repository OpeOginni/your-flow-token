import "../globals.css";
import { Inter } from "next/font/google";
import Header from "@/components/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Flow Token | NFT",
  description: "Create Your personal NFT on Flow with Ease",
};

export default function NFTPageLayout({ children }) {
  return <section>{children}</section>;
}
