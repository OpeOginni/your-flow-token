import { useEffect } from "react";
import { atom, useRecoilState } from "recoil";
import * as fcl from "@onflow/fcl";

export const currentUser = atom({
  key: "CURRENT_USER",
  default: { addr: null, cid: null, loggedIn: false },
});

export async function useCurrentUser() {
  const [$data, setData] = useRecoilState(currentUser);
  useEffect(() => fcl.currentUser().subscribe(setData), [setData]);

  const user = {
    ...$data,
  };

  return user;
}
