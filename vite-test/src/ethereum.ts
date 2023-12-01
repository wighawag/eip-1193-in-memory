import { createProvider } from "eip-1193-in-memory";

export function setupEthereum(element: HTMLButtonElement) {
  const provider = createProvider();

  const sendTx = async () => {
    const accounts = await provider.request({ method: "eth_accounts" });
    const account = accounts[0];

    console.log(`from: ${account}`);

    await provider.request({
      method: "eth_sendTransaction",
      params: [
        {
          from: account,
          to: account,
        },
      ],
    });
  };

  element.addEventListener("click", () => sendTx());
  setInterval(async () => {
    try {
      const blockNumber = await provider.request({ method: "eth_blockNumber" });
      element.innerHTML = Number(blockNumber).toString();
    } catch (err) {
      element.innerHTML = `ERROR: ${err || "empty response"}`;
    }
  }, 1000);
}
