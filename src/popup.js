import { ethers } from "../node_modules/ethers/dist/ethers.min.js";

const provider = new ethers.JsonRpcProvider("https://sepolia.infura.io/v3/8eaafd8d73fa4520acef8392c70931fc");

let wallet;

chrome.storage.local.get("privateKey", (result) => {
  if (result.privateKey) {
    wallet = new ethers.Wallet(result.privateKey).connect(provider);
    updateUI();
  }
});

document.getElementById("generate-key").onclick = () => {
  wallet = ethers.Wallet.createRandom().connect(provider);
  chrome.storage.local.set({ privateKey: wallet.privateKey });
  updateUI();
};

document.getElementById("import-btn").onclick = () => {
  try {
    const pk = document.getElementById("import-key").value.trim();
    wallet = new ethers.Wallet(pk).connect(provider);
    chrome.storage.local.set({ privateKey: pk });
    updateUI();
  } catch (e) {
    alert("Invalid private key");
  }
};

document.getElementById("send").onclick = async () => {
  const to = document.getElementById("to").value.trim();
  const amount = document.getElementById("amount").value.trim();
  try {
    const tx = await wallet.sendTransaction({
      to,
      value: ethers.parseEther(amount)
    });
    alert("Sent: " + tx.hash);
  } catch (e) {
    alert("Error: " + e.message);
  }
};

document.getElementById("view-txs").onclick = () => {
  window.location.href = "transactions.html";
};

async function updateUI() {
  const address = await wallet.getAddress();
  document.getElementById("address").textContent = address;
  const balance = await provider.getBalance(address);
  document.getElementById("balance").textContent = ethers.formatEther(balance);
  document.getElementById("wallet-info").style.display = "block";
}
