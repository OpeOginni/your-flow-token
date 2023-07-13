"use client";

// Got this use-ts.hook implementation from orodio
// https://github.com/orodio/flow-view-source/blob/2d3bb87186d654faba733859a1e39e15c44887da/src/hooks/use-tx.hook.js#L47

// Check out his github project https://github.com/orodio/flow-view-source
import { useState } from "react";
import * as fcl from "@onflow/fcl";

const noop = () => {};

export function useTx(fns = [], opts = {}) {
  const onError = opts.onError || noop;

  async function trigger(args = []) {
    // onStart();
    // setStatus(PROCESSING);
    // setTxStatus(PROCESSING);
    // setDetails(() => EMPTY_DETAILS);

    if (args.length) {
      fns.push((ix) => {
        ix.message.arguments = [];
        ix.arguments = {};
        return ix;
      });
      fns.push(fcl.args(args));
    }
    try {
      // setTxStatus(PENDING_AUTH);
      var txId = await fcl.send(fns).then(fcl.decode);
      return txId;
      // onSent(txId);

      // setTxStatus(SUBMITTING_TO_CHAIN);
      // // eslint-disable-next-line
      // setDetails((details) => ({ ...details, txId }));

      // var unsub = fcl.tx(txId).subscribe((txStatus) => {
      //   txStatus.label = statusKeys(txStatus);
      //   setTxStatus(statusKeys(txStatus));
      //   // eslint-disable-next-line
      //   setDetails((details) => ({ ...details, txStatus }));
      //   onUpdate(txStatus);
      // });

      // await fcl
      //   .tx(txId)
      //   .onceSealed()
      //   .then(async (txStatus) => {
      //     setStatus(SUCCESS);
      //     onSuccess(txStatus);
      //     unsub();
      //   })
      //   .catch((error) => {
      //     unsub();
      //     throw error;
      //   });
    } catch (error) {
      onError(error);
      console.error("useTx", error, { fns });
      // setStatus(ERROR);
      // // eslint-disable-next-line
      // setDetails((details) => ({ ...details, error }));
    }
    // finally {
    //   await sleep();
    //   setStatus(IDLE);
    //   setTxStatus(IDLE);
    //   onComplete();
    // }
  }

  return [trigger];
}
