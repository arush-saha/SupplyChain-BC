/**
 * ------------------------------------------------------------------
 * CONTRACT CONFIG — edit this file to point the site at your contract
 * ------------------------------------------------------------------
 *
 * The ABI below was pulled from this repo's dapp.config.json (the file
 * Remix's "Quick Dapp" feature writes when you use its built-in deploy
 * flow). It matches the SupplyChain contract's public functions/events.
 *
 * IMPORTANT — the address in that file is NOT usable here:
 *   "chainId": "vm-osaka", "networkName": "VM"
 * That means the contract was deployed to Remix's in-browser simulated
 * blockchain, which only exists inside that one Remix browser tab.
 * MetaMask has no way to reach it. Before this site can do anything
 * real, you (or your friend) need to redeploy the same contract from
 * Remix using the "Injected Provider - MetaMask" environment, against
 * a real network — e.g. the Sepolia testnet, or a local Hardhat/Ganache
 * node — and paste the NEW address below.
 */

const CONTRACT_ADDRESS = "0xPASTE_YOUR_REAL_DEPLOYED_ADDRESS_HERE";

const CONTRACT_ABI = [
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" },
      { "indexed": false, "internalType": "string", "name": "name", "type": "string" },
      { "indexed": true, "internalType": "address", "name": "manufacturer", "type": "address" }
    ],
    "name": "ProductCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" },
      { "indexed": false, "internalType": "enum SupplyChain.Status", "name": "status", "type": "uint8" },
      { "indexed": false, "internalType": "string", "name": "location", "type": "string" },
      { "indexed": true, "internalType": "address", "name": "updatedBy", "type": "address" }
    ],
    "name": "StatusUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
      { "indexed": false, "internalType": "enum SupplyChain.Role", "name": "role", "type": "uint8" }
    ],
    "name": "UserRegistered",
    "type": "event"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "_name", "type": "string" },
      { "internalType": "string", "name": "_description", "type": "string" },
      { "internalType": "string", "name": "_initialLocation", "type": "string" }
    ],
    "name": "createProduct",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }],
    "name": "getProduct",
    "outputs": [
      { "internalType": "uint256", "name": "id", "type": "uint256" },
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "string", "name": "description", "type": "string" },
      { "internalType": "address", "name": "manufacturer", "type": "address" },
      { "internalType": "address", "name": "supplier", "type": "address" },
      { "internalType": "address", "name": "deliveryPerson", "type": "address" },
      { "internalType": "address", "name": "customer", "type": "address" },
      { "internalType": "address", "name": "currentOwner", "type": "address" },
      { "internalType": "enum SupplyChain.Status", "name": "status", "type": "uint8" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }],
    "name": "getProductHistory",
    "outputs": [
      {
        "components": [
          { "internalType": "string", "name": "location", "type": "string" },
          { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
          { "internalType": "address", "name": "updatedBy", "type": "address" },
          { "internalType": "enum SupplyChain.Status", "name": "status", "type": "uint8" }
        ],
        "internalType": "struct SupplyChain.TrackingStep[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "productCount",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "enum SupplyChain.Role", "name": "_role", "type": "uint8" }],
    "name": "registerUser",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_id", "type": "uint256" },
      { "internalType": "enum SupplyChain.Status", "name": "_newStatus", "type": "uint8" },
      { "internalType": "string", "name": "_location", "type": "string" },
      { "internalType": "address", "name": "_nextOwner", "type": "address" }
    ],
    "name": "updateStatus",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "userRoles",
    "outputs": [{ "internalType": "enum SupplyChain.Role", "name": "", "type": "uint8" }],
    "stateMutability": "view",
    "type": "function"
  }
];

/**
 * ⚠️ CONFIRM THESE AGAINST YOUR ACTUAL contracts/*.sol FILE.
 *
 * The ABI only tells us these are "enum SupplyChain.Role" / "enum
 * SupplyChain.Status" — it does NOT tell us the order the values were
 * declared in. Solidity enums are just integers under the hood, so if
 * this order doesn't match your source file exactly, the site will
 * register the wrong role or set the wrong status on-chain without
 * throwing any error. Open the .sol file, find:
 *
 *   enum Role { ... }
 *   enum Status { ... }
 *
 * and make sure the arrays below are in the exact same order.
 */
const ROLES = {
  NONE: 0,
  MANUFACTURER: 1,
  SUPPLIER: 2,
  DELIVERY: 3,
  CUSTOMER: 4,
};
const ROLE_LABELS = ["None", "Manufacturer", "Supplier", "Delivery Person", "Customer"];

const STATUS = {
  CREATED: 0,
  IN_TRANSIT_TO_SUPPLIER: 1,
  WITH_SUPPLIER: 2,
  IN_TRANSIT_TO_CUSTOMER: 3,
  DELIVERED: 4,
};
const STATUS_LABELS = [
  "Created",
  "In Transit to Supplier",
  "With Supplier",
  "In Transit to Customer",
  "Delivered",
];

// Icons shown on the Amazon-style horizontal tracker, one per STATUS_LABELS entry.
const STATUS_ICONS = ["📦", "🚚", "🏬", "🚛", "✅"];
