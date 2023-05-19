import "./globals.css";
import { Inter } from "next/font/google";
// import { ChakraProvider } from "@chakra-ui/react";
import Header from "@/components/header";
import Footer from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Your Flow Token",
  description: "Create Your personal Tokens on Flow with Ease",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
