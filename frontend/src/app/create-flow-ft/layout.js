import "../globals.css";
import { Inter } from "next/font/google";
import { Providers } from "../providers";
import Header from "@/components/header";
import Footer from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Flow Token | FT",
  description: "Create Your personal FT on Flow with Ease",
};

export default function FTPageLayout({ children }) {
  return <section>{children}</section>;
}
