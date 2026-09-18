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
 * Renders an Amazon-style horizontal order tracker into `containerEl`.
 * `historySteps` = the array returned by getProductHistory(id).
 * `currentStatusIndex` = the product's current .status (a number).
 */
function renderTimeline(containerEl, historySteps, currentStatusIndex) {
  containerEl.innerHTML = "";

  const historyByStatus = {};
  historySteps.forEach((step) => {
    historyByStatus[Number(step.status)] = step;
  });

  const currentHist = historyByStatus[currentStatusIndex];
  const lastCount = STATUS_LABELS.length - 1;
  const fillPct = lastCount > 0 ? (Math.min(currentStatusIndex, lastCount) / lastCount) * 100 : 0;

  // Big status headline, like Amazon's "Out for delivery" banner.
  const headline = document.createElement("div");
  headline.className = "tracker-headline";
  headline.innerHTML = `
    <div class="tracker-headline-icon">${STATUS_ICONS[currentStatusIndex] || "📦"}</div>
    <div>
      <div class="tracker-headline-title">${STATUS_LABELS[currentStatusIndex] || "Unknown"}</div>
      <div class="tracker-headline-sub">
        ${
          currentHist
            ? escapeHtml(currentHist.location) +
              " · " +
              new Date(Number(currentHist.timestamp) * 1000).toLocaleString()
            : "Awaiting update"
        }
      </div>
    </div>
  `;
  containerEl.appendChild(headline);

  // Progress bar + step icons.
  const wrap = document.createElement("div");
  wrap.className = "tracker-wrap";
  wrap.innerHTML = `
    <div class="tracker-bar-bg"></div>
    <div class="tracker-bar-fill" style="width:${fillPct}%"></div>
  `;

  STATUS_LABELS.forEach((label, idx) => {
    const stepEl = document.createElement("div");
    stepEl.className = "tracker-step";
    if (idx < currentStatusIndex) stepEl.classList.add("completed");
    else if (idx === currentStatusIndex) stepEl.classList.add("active");

    const hist = historyByStatus[idx];
    const iconContent = idx < currentStatusIndex ? "✓" : STATUS_ICONS[idx] || "•";
    const metaHtml = hist
      ? `<div class="tracker-meta">${escapeHtml(hist.location)}<br>${new Date(
          Number(hist.timestamp) * 1000
        ).toLocaleDateString()}</div>`
      : `<div class="tracker-meta">—</div>`;

    stepEl.innerHTML = `
      <div class="tracker-dot">${iconContent}</div>
      <div class="tracker-label">${label}</div>
      ${metaHtml}
    `;
    wrap.appendChild(stepEl);
  });

  containerEl.appendChild(wrap);
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}
