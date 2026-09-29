// IndexedDB Real Local Database Storage Manager for SAHAAY Platform

const DB_NAME = 'SAHAAY_Disaster_DB';
const DB_VERSION = 1;

export interface DBStores {
  emergencyReports: 'id';
  helpRequests: 'id';
  shelters: 'id';
  alerts: 'id';
  pendingSyncQueue: 'id';
  notifications: 'id';
  appState: 'key';
}

class SahaayDatabase {
  private db: IDBDatabase | null = null;
  private isSupported: boolean = typeof window !== 'undefined' && 'indexedDB' in window;

  public async initDB(): Promise<boolean> {
    if (!this.isSupported) {
      console.warn('IndexedDB not supported in this environment, falling back to LocalStorage');
      return false;
    }

    return new Promise((resolve) => {
      try {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = (event) => {
          console.error('IndexedDB open error:', event);
          resolve(false);
        };

        request.onsuccess = (event) => {
          this.db = (event.target as IDBOpenDBRequest).result;
          console.log('IndexedDB Connected Successfully: SAHAAY_Disaster_DB');
          resolve(true);
        };

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;

          if (!db.objectStoreNames.contains('emergencyReports')) {
            db.createObjectStore('emergencyReports', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('helpRequests')) {
            db.createObjectStore('helpRequests', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('shelters')) {
            db.createObjectStore('shelters', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('alerts')) {
            db.createObjectStore('alerts', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('pendingSyncQueue')) {
            db.createObjectStore('pendingSyncQueue', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('notifications')) {
            db.createObjectStore('notifications', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('appState')) {
            db.createObjectStore('appState', { keyPath: 'key' });
          }
        };
      } catch (e) {
        console.error('Failed to initialize IndexedDB:', e);
        resolve(false);
      }
    });
  }

  public async saveItems<T extends { id: string }>(storeName: string, items: T[]): Promise<boolean> {
    if (!this.db) return false;
    return new Promise((resolve) => {
      try {
        const tx = this.db!.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        store.clear();
        items.forEach((item) => store.put(item));
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      } catch (e) {
        console.error(`Error saving to store ${storeName}:`, e);
        resolve(false);
      }
    });
  }

  public async getAllItems<T>(storeName: string): Promise<T[]> {
    if (!this.db) return [];
    return new Promise((resolve) => {
      try {
        const tx = this.db!.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result as T[]);
        req.onerror = () => resolve([]);
      } catch (e) {
        console.error(`Error reading from store ${storeName}:`, e);
        resolve([]);
      }
    });
  }

  public async saveStateKey(key: string, value: any): Promise<boolean> {
    if (!this.db) return false;
    return new Promise((resolve) => {
      try {
        const tx = this.db!.transaction('appState', 'readwrite');
        const store = tx.objectStore('appState');
        store.put({ key, value, updatedAt: new Date().toISOString() });
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      } catch (e) {
        resolve(false);
      }
    });
  }

  public async getStateKey<T>(key: string): Promise<T | null> {
    if (!this.db) return null;
    return new Promise((resolve) => {
      try {
        const tx = this.db!.transaction('appState', 'readonly');
        const store = tx.objectStore('appState');
        const req = store.get(key);
        req.onsuccess = () => resolve(req.result ? (req.result.value as T) : null);
        req.onerror = () => resolve(null);
      } catch (e) {
        resolve(null);
      }
    });
  }
}

export const sahaayDB = new SahaayDatabase();
