// Simple IndexedDB wrapper for Itemizer-Vibe
// Uses idb library for easier API
import { openDB } from 'idb';

const DB_NAME = 'itemizer-vibe';
const DB_VERSION = 2;
const INVENTORY_STORE = 'inventory';
const LOOKUP_STORE = 'productLookup';

export function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(INVENTORY_STORE)) {
        db.createObjectStore(INVENTORY_STORE, { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(LOOKUP_STORE)) {
        db.createObjectStore(LOOKUP_STORE, { keyPath: 'barcode' });
      }
      if (!db.objectStoreNames.contains('theme')) {
        db.createObjectStore('theme', { keyPath: 'key' });
      }
    },
  });
}

// ...existing code...

// Theme CRUD
export async function setThemeDB(theme) {
  const db = await getDB();
  return db.put('theme', { key: 'selected', value: theme });
}

export async function getThemeDB() {
  const db = await getDB();
  const entry = await db.get('theme', 'selected');
  return entry ? entry.value : null;
}
// ...existing code...

// Inventory CRUD
export async function getInventory() {
  const db = await getDB();
  return db.getAll(INVENTORY_STORE);
}

export async function addInventoryItem(item) {
  const db = await getDB();
  return db.add(INVENTORY_STORE, item);
}

export async function removeInventoryItem(id) {
  const db = await getDB();
  return db.delete(INVENTORY_STORE, id);
}

// Product Lookup CRUD
export async function getProductLookup() {
  const db = await getDB();
  return db.getAll(LOOKUP_STORE);
}

export async function setProductLookupItem(item) {
  const db = await getDB();
  return db.put(LOOKUP_STORE, item);
}

export async function removeProductLookupItem(barcode) {
  const db = await getDB();
  return db.delete(LOOKUP_STORE, barcode);
}
