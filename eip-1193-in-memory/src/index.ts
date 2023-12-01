import type {
  EIP1193GenericRequest,
  EIP1193ProviderWithoutEvents,
  EIP1193Request,
} from "eip-1193";
import { Provider } from "@remix-project/remix-simulator";

function jsonify(v: any): string {
  try {
    return JSON.stringify(v);
  } catch {
    return v;
  }
}

export function wrapRemixSimulator(
  provider: Provider
): EIP1193ProviderWithoutEvents {
  const initialization = provider.init();
  let counter = 1;
  function request(args: EIP1193Request): Promise<unknown> {
    return initialization.then(
      () =>
        new Promise((resolve, reject) => {
          let sanetizedParams: any[] = [];
          // --------------------------------------------------------------------------------
          // SANETIZING REQUEST FOR REMIX
          // TODO create PR to fix this in remix
          // --------------------------------------------------------------------------------
          if ("params" in args) {
            sanetizedParams = args.params;
          }
          if (args.method === "eth_sendTransaction") {
            // remix need that while EIP-1193 consider data to be optional
            sanetizedParams[0].data = sanetizedParams[0].data || "0x";
          }
          // --------------------------------------------------------------------------------

          provider.sendAsync(
            {
              method: args.method,
              params: sanetizedParams,
              jsonrpc: "2.0",
              id: ++counter,
            },
            (err, response) => {
              if (response) {
                if (response.result !== undefined) {
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
    request,
  } as EIP1193ProviderWithoutEvents;
}

export function createProvider() {
  const provider = new Provider();
  return wrapRemixSimulator(provider);
}
