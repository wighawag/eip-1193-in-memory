"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  createProvider: () => createProvider,
  wrapRemixSimulator: () => wrapRemixSimulator
});
module.exports = __toCommonJS(src_exports);
var import_remix_simulator = require("@remix-project/remix-simulator");
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
  const provider = new import_remix_simulator.Provider();
  return wrapRemixSimulator(provider);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createProvider,
  wrapRemixSimulator
});
