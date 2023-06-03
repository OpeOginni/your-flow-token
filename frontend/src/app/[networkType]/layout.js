import "../globals.css";
import { Inter } from "next/font/google";
import Header from "../../components/header";

export const metadata = {
  title: "Your Flow Token",
  description: "Create Your personal Tokens on Flow with Ease",
};

export default function FTPageLayout({ children }) {
  return (
    <>
      <Header />
      <section>{children}</section>
    </>
  );
}
