import "./globals.css";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import Footer from "../components/footer";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Your Flow Token",
  description: "Create Your personal Tokens on Flow with Ease",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="content">{children}</div>
          <Footer className="footer" />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
