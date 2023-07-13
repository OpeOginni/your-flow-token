"use client";

import { Box, Text, Center } from "@chakra-ui/react";

export default function WelcomeHeader() {
  return (
    <div className="w-screen flex justify-center items-center h-[120px]">
      <Box display="flex" alignItems="baseline" p="9" gap="20">
        <Center>
          <Text className="text-gWhite font-bold">
            Built on the Flow Blockchain for the 2023 Chainlink Hackathon
          </Text>
        </Center>
      </Box>
    </div>
  );
}
