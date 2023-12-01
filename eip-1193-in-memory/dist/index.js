// src/index.ts
import { Provider } from "@remix-project/remix-simulator";
function jsonify(v) {
  try {
    return JSON.stringify(v);
  } catch {
    return v;
  }
}
function wrapRemixSimulator(provider) {
  const initialization = provider.init();
  let counter = 1;
  function request(args) {
    return initialization.then(
      () => new Promise((resolve, reject) => {
        let sanetizedParams = [];
        if ("params" in args) {
          sanetizedParams = args.params;
        }
        if (args.method === "eth_sendTransaction") {
          sanetizedParams[0].data = sanetizedParams[0].data || "0x";
        }
        provider.sendAsync(
          {
            method: args.method,
            params: sanetizedParams,
            jsonrpc: "2.0",
            id: ++counter
          },
          (err, response) => {
            if (response) {
              if (response.result !== void 0) {
                resolve(response.result);
              } else {
                reject(`empty result in response: ${jsonify(response)}`);
              }
            } else {
              reject(err || "empty response");
            }
          }
        );
      })
    );
  }
  return {
    request
  };
}
function createProvider() {
  const provider = new Provider();
  return wrapRemixSimulator(provider);
}
export {
  createProvider,
  wrapRemixSimulator
};
