/* Shared across every page. Requires ethers.js (loaded via CDN in each
   HTML file) and contract-config.js to be loaded first. */

let provider = null;
let signer = null;
let contract = null;
let currentAccount = null;

function shortAddr(addr) {
  if (!addr) return "";
  return addr.slice(0, 6) + "…" + addr.slice(-4);
}

function isZeroAddr(addr) {
  return !addr || /^0x0+$/i.test(addr);
}

/** Wires up the "Connect Wallet" button + pill that every page's header has. */
function initWalletUI(onConnected) {
  const btn = document.getElementById("connectBtn");
  const pill = document.getElementById("walletPill");

  async function doConnect() {
    if (typeof window.ethereum === "undefined") {
      alert("MetaMask wasn't found. Install it from metamask.io and reload this page.");
      return;
    }
    try {
      provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      currentAccount = accounts[0];
      signer = await provider.getSigner();
      contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      btn.textContent = "Connected";
      btn.disabled = true;
      pill.style.display = "inline-block";
      pill.textContent = shortAddr(currentAccount);

      const network = await provider.getNetwork();
      const netLine = document.getElementById("networkLine");
      if (netLine) netLine.textContent = `Network: ${network.name} (chainId ${network.chainId})`;

      if (onConnected) await onConnected(currentAccount);
    } catch (err) {
      console.error(err);
      alert("Wallet connection failed: " + (err.message || err));
    }
  }

  btn.addEventListener("click", doConnect);

  if (window.ethereum) {
    window.ethereum.on("accountsChanged", () => window.location.reload());
    window.ethereum.on("chainChanged", () => window.location.reload());
    // Reconnect quietly if this site was already authorized.
    window.ethereum.request({ method: "eth_accounts" }).then((accounts) => {
      if (accounts && accounts.length > 0) doConnect();
    });
  }
}

function requireContract() {
  if (!contract) {
    alert("Connect your wallet first.");
    return false;
  }
  return true;
}

function setStatus(el, message, kind) {
  el.textContent = message;
  el.className = "status-line" + (kind ? " " + kind : "");
}

/**
 * Renders the horizontal order-tracking timeline into `containerEl`.
 * `historySteps` = the array returned by getProductHistory(id).
 * `currentStatusIndex` = the product's current .status (a number).
 */
function renderTimeline(containerEl, historySteps, currentStatusIndex) {
  containerEl.innerHTML = "";
  const track = document.createElement("div");
  track.className = "timeline-track";

  const historyByStatus = {};
  historySteps.forEach((step) => {
    historyByStatus[Number(step.status)] = step;
  });

  STATUS_LABELS.forEach((label, idx) => {
    const stepEl = document.createElement("div");
    stepEl.className = "timeline-step";
    if (idx < currentStatusIndex) stepEl.classList.add("completed");
    else if (idx === currentStatusIndex) stepEl.classList.add("active");

    const hist = historyByStatus[idx];
    const dotContent = idx < currentStatusIndex ? "✓" : String(idx + 1);
    const metaHtml = hist
      ? `<div class="timeline-meta">${escapeHtml(hist.location)}<br>${new Date(
          Number(hist.timestamp) * 1000
        ).toLocaleString()}</div>`
      : `<div class="timeline-meta">—</div>`;

    stepEl.innerHTML = `
      <div class="timeline-dot">${dotContent}</div>
      <div class="timeline-label">${label}</div>
      ${metaHtml}
    `;
    track.appendChild(stepEl);
  });

  containerEl.appendChild(track);
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}
