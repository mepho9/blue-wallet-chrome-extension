import { ethers } from "../node_modules/ethers/dist/ethers.min.js";

const ETHERSCAN_API_KEY = "BN8F9CN41UBAR4JIM6Q33C2VQNFQQHBVXC";

chrome.storage.local.get("privateKey", async (result) => {
  if (!result.privateKey) return;

  const wallet = new ethers.Wallet(result.privateKey);
  const address = await wallet.getAddress();
  loadTransactions(address);
});

async function loadTransactions(address) {
  const url = `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=${ETHERSCAN_API_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    const txsDiv = document.getElementById("txs");
    txsDiv.innerHTML = "<h3>Recent Transactions</h3>";

    data.result.forEach((tx) => {
      const el = document.createElement("p");
      el.innerHTML = `
        <a href="https://sepolia.etherscan.io/tx/${tx.hash}" target="_blank">
          🔁 ${tx.hash.slice(0, 12)}...
        </a><br>
        ➡ <strong>${tx.to.slice(0, 8)}...</strong> : ${ethers.formatEther(tx.value)} ETH
        <hr/>
      `;
      txsDiv.appendChild(el);
    });
  } catch (e) {
    console.error("Failed to load transactions", e);
  }
}

document.getElementById("back").onclick = () => {
  window.location.href = "popup.html";
};
