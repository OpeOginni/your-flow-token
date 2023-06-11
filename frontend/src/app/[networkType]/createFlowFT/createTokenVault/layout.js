import "../../../globals.css";
import { Inter } from "next/font/google";

export const metadata = {
  title: "Create Flow Token Vault | FT",
  description: "Create Your personal FT Vault so you can recieve tokens",
};

export default function FTPageLayout({ children }) {
  return <section>{children}</section>;
}
