import { initializeApp, getApps } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDoc,
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp
} from "firebase/firestore";
import { firebaseConfig, isDemoMode } from "./config";

// Initialize Firestore if not in demo mode
let db;
if (!isDemoMode) {
  db = getFirestore();
}

// Reactivity event bus for Demo Mode
const demoSubscriptions = {};

const triggerDemoUpdate = (collectionName) => {
  if (demoSubscriptions[collectionName]) {
    const data = databaseService.getLocalCollection(collectionName);
    demoSubscriptions[collectionName].forEach(cb => cb(data));
  }
};

// Unified Database Service API
export const databaseService = {
  // Demo Mode Local Storage Accessors
  getLocalCollection(name) {
    const item = localStorage.getItem(`ll_${name}`);
    return item ? JSON.parse(item) : [];
  },

  saveLocalCollection(name, data) {
    localStorage.setItem(`ll_${name}`, JSON.stringify(data));
    triggerDemoUpdate(name);
  },

  // GET ALL
  async getDocs(collectionName, filters = [], sortField = "createdAt", sortOrder = "desc") {
    if (isDemoMode) {
      await new Promise(resolve => setTimeout(resolve, 300));
      let data = this.getLocalCollection(collectionName);
      
      // Apply filters manually
      filters.forEach(f => {
        const { field, operator, value } = f;
        if (operator === "==") {
          data = data.filter(item => item[field] === value);
        } else if (operator === "array-contains") {
          data = data.filter(item => Array.isArray(item[field]) && item[field].includes(value));
        } else if (operator === "!=") {
          data = data.filter(item => item[field] !== value);
        }
      });
      
      // Apply sorting
      data.sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        
        if (typeof valA === "string") {
          return sortOrder === "desc" 
            ? valB.localeCompare(valA) 
            : valA.localeCompare(valB);
        }
        
        return sortOrder === "desc" ? valB - valA : valA - valB;
      });
      
      return data;
    } else {
      const colRef = collection(db, collectionName);
      const queryConstraints = [];
      
      filters.forEach(f => {
        queryConstraints.push(where(f.field, f.operator, f.value));
      });
      
      if (sortField) {
        queryConstraints.push(orderBy(sortField, sortOrder));
      }
      
      const q = query(colRef, ...queryConstraints);
      const querySnapshot = await getDocs(q);
      
      const items = [];
      querySnapshot.forEach(doc => {
        items.push({ id: doc.id, ...doc.data() });
      });
      
      return items;
    }
  },

  // GET SINGLE
  async getDoc(collectionName, id) {
    if (isDemoMode) {
      const data = this.getLocalCollection(collectionName);
      const found = data.find(item => item.id === id);
      if (!found) throw new Error("Dokumen tidak ditemukan!");
      return found;
    } else {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        throw new Error("Dokumen tidak ditemukan!");
      }
      return { id: docSnap.id, ...docSnap.data() };
    }
  },

  // ADD
  async addDoc(collectionName, payload) {
    if (isDemoMode) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const data = this.getLocalCollection(collectionName);
      
      const newDoc = {
        id: `demo-${collectionName}-${Math.random().toString(36).substr(2, 9)}`,
        ...payload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      data.push(newDoc);
      this.saveLocalCollection(collectionName, data);
      return newDoc;
    } else {
      const colRef = collection(db, collectionName);
      const dataWithTimestamp = {
        ...payload,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(colRef, dataWithTimestamp);
      return { id: docRef.id, ...payload };
    }
  },

  // UPDATE
  async updateDoc(collectionName, id, payload) {
    if (isDemoMode) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const data = this.getLocalCollection(collectionName);
      const index = data.findIndex(item => item.id === id);
      
      if (index === -1) {
        throw new Error("Dokumen tidak ditemukan untuk diupdate!");
      }
      
      const updatedItem = {
        ...data[index],
        ...payload,
        updatedAt: new Date().toISOString()
      };
      
      data[index] = updatedItem;
      this.saveLocalCollection(collectionName, data);
      return updatedItem;
    } else {
      const docRef = doc(db, collectionName, id);
      const dataWithTimestamp = {
        ...payload,
        updatedAt: serverTimestamp()
      };
      await updateDoc(docRef, dataWithTimestamp);
      return { id, ...payload };
    }
  },

  // DELETE
  async deleteDoc(collectionName, id) {
    if (isDemoMode) {
      await new Promise(resolve => setTimeout(resolve, 300));
      let data = this.getLocalCollection(collectionName);
      const exists = data.some(item => item.id === id);
      
      if (!exists) {
        throw new Error("Dokumen tidak ditemukan untuk dihapus!");
      }
      
      data = data.filter(item => item.id !== id);
      this.saveLocalCollection(collectionName, data);
      return true;
    } else {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      return true;
    }
  },

  // REALTIME SUBSCRIPTION
  onSnapshot(collectionName, filters = [], callback, sortField = "createdAt", sortOrder = "desc") {
    if (isDemoMode) {
      // Register subscription callback
      if (!demoSubscriptions[collectionName]) {
        demoSubscriptions[collectionName] = [];
      }
      
      const subscriberCallback = (allData) => {
        let filtered = [...allData];
        
        // Manual filter
        filters.forEach(f => {
          const { field, operator, value } = f;
          if (operator === "==") {
            filtered = filtered.filter(item => item[field] === value);
          } else if (operator === "array-contains") {
            filtered = filtered.filter(item => Array.isArray(item[field]) && item[field].includes(value));
          } else if (operator === "!=") {
            filtered = filtered.filter(item => item[field] !== value);
          }
        });
        
        // Manual sort
        filtered.sort((a, b) => {
          let valA = a[sortField];
          let valB = b[sortField];
          
          if (typeof valA === "string") {
            return sortOrder === "desc" 
              ? valB.localeCompare(valA) 
              : valA.localeCompare(valB);
          }
          return sortOrder === "desc" ? valB - valA : valA - valB;
        });
        
        callback(filtered);
      };
      
      demoSubscriptions[collectionName].push(subscriberCallback);
      
      // Trigger initial call
      const initialData = this.getLocalCollection(collectionName);
      subscriberCallback(initialData);
      
      // Return unsubscriber
      return () => {
        demoSubscriptions[collectionName] = demoSubscriptions[collectionName].filter(cb => cb !== subscriberCallback);
      };
    } else {
      const colRef = collection(db, collectionName);
      const queryConstraints = [];
      
      filters.forEach(f => {
        queryConstraints.push(where(f.field, f.operator, f.value));
      });
      
      if (sortField) {
        queryConstraints.push(orderBy(sortField, sortOrder));
      }
      
      const q = query(colRef, ...queryConstraints);
      
      return onSnapshot(q, (snapshot) => {
        const items = [];
        snapshot.forEach(doc => {
          items.push({ id: doc.id, ...doc.data() });
        });
        callback(items);
      }, (error) => {
        console.error(`Error subscribing to ${collectionName}:`, error);
      });
    }
  }
};
