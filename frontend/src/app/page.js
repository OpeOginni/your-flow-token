"use client";

import { SimpleGrid, Button, useToast } from "@chakra-ui/react";
import Link from "next/link.js";
import WelcomeHeader from "@/components/welcomeHeader";

export default function Home() {
  return (
    <div className="content">
      <WelcomeHeader />
      <div className="flex flex-col justify-center items-center text-gWhite">
        <h1 className="text-5xl font-bold pb-4 text-center">
          Your{" "}
          <span className="text-8xl font-bold pb-4 text-center text-lightGreen">
            Flow
          </span>{" "}
          Token
        </h1>
        <SimpleGrid columns={2} spacingX="80px" p="120px">
          <div className=" flex flex-col justify-center items-center text-gWhite">
            <h1 className="text-3xl font-bold pb-4 text-center text-lightGreen">
              Create on Mainnet
            </h1>
            <Link href="/mainnet">
              <Button
                height="48px"
                width="150px"
                size="lg"
                className="rounded-xl text-gWhite bg-lightGreen font-bold hover:bg-lightGreen/60"
              >
                Mainnet
              </Button>
            </Link>
          </div>
          <div className=" flex flex-col justify-center items-center text-gWhite">
            <h1 className="text-3xl font-bold pb-4 text-center text-lightGreen">
              Create on Testnet
            </h1>
            <Link href="/testnet">
              <Button
                height="48px"
                width="150px"
                size="lg"
                className="rounded-xl text-gWhite bg-lightGreen font-bold hover:bg-lightGreen/60"
              >
                Testnet
              </Button>
            </Link>
          </div>
        </SimpleGrid>
      </div>
    </div>
  );
}
