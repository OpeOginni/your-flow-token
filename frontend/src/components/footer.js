"use client";

import { Button, ButtonGroup, Box, Text, Center } from "@chakra-ui/react";

export default function Footer() {
  return (
    <Box
      // as="footer"
      // position="fixed"
      // bottom="0"
      // left="0"
      // right="0"
      color="white"
      p={4}
      background="black"
    >
      <Center>
        <Text fontSize="xs" color="white">
          Proudly made in
          <span>
            <svg
              viewBox="0 0 48 48"
              style={{
                display: "inline-block",
                marginInlineStart: "0.75rem",
                marginInlineEnd: "0.75rem",
                height: "16px",
                width: "auto",
                verticalAlign: "middle",
              }}
            >
              <title>Nigeria</title>
              <g>
                <rect x="16" y="6" fill="#E6E6E6" width="16" height="36"></rect>{" "}
                <path
                  fill="#078754"
                  d="M48,40c0,1.105-0.895,2-2,2H32V6h14c1.105,0,2,0.895,2,2V40z"
                ></path>
                <path
                  fill="#078754"
                  d="M16,42H2c-1.105,0-2-0.895-2-2V8c0-1.105,0.895-2,2-2h14V42z"
                ></path>
              </g>
            </svg>
          </span>
          by Opeyemi Oginni
        </Text>
      </Center>
    </Box>
  );
}
