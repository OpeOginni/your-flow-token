"use client";

import "../../flow/config.js";
import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";
import { Button, ButtonGroup, Box, Text } from "@chakra-ui/react";

export default function Header() {
  const [user, setUser] = useState({ loggedIn: null });

  useEffect(() => {
    fcl.currentUser.subscribe(setUser);
  }, []);

  const AuthedState = () => {
    return (
      <Box display="flex" alignItems="baseline" p="9" gap="20">
        <Text className="text-gWhite font-bold">Address: {user?.addr}</Text>
        <Button
          height="48px"
          width="150px"
          size="lg"
          className="rounded-lg text-gWhite bg-lightGreen font-bold hover:bg-lightGreen/60"
          onClick={fcl.unauthenticate}
        >
          Log Out
        </Button>
      </Box>
    );
  };

  const UnauthenticatedState = () => {
    return (
      <Box p="9">
        <ButtonGroup gap="4">
          <Button
            height="48px"
            width="150px"
            size="lg"
            className="rounded-lg text-gWhite bg-lightGreen font-bold hover:bg-lightGreen/60"
            onClick={fcl.logIn}
          >
            Log In
          </Button>
          <Button
            height="48px"
            width="150px"
            size="lg"
            className="rounded-lg text-gWhite bg-lightGreen font-bold hover:bg-lightGreen/60"
            onClick={fcl.signUp}
          >
            Sign Up
          </Button>
        </ButtonGroup>
      </Box>
    );
  };

  return (
    <div className="w-screen flex justify-end items-center ">
      {user.loggedIn ? (
        <AuthedState user={user} setUser={setUser} />
      ) : (
        <UnauthenticatedState setUser={setUser} />
      )}
    </div>
  );
}
