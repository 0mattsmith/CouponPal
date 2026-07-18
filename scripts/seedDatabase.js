import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, addDoc } from 'firebase/firestore';

// Note: We use relative path with extension for Node ESM
import { fetchStoreDetails, mockCategoriesByRegion } from '../src/services/mockApi.js';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedDatabase() {
  console.log("🌱 Starting Database Seed...");

  try {
    // 1. Seed Categories
    console.log("Seeding categories...");
    for (const [region, categories] of Object.entries(mockCategoriesByRegion)) {
      await setDoc(doc(db, 'regions', region), {
        categories: categories.map(c => ({
          name: c.name,
          sites: c.sites
        }))
      });
      console.log(`✅ Saved region: ${region}`);
    }

    // 2. Seed Stores
    console.log("Seeding stores and coupons...");
    
    // We'll collect all unique sites from the categories
    const allSites = new Set();
    Object.values(mockCategoriesByRegion).forEach(categories => {
      categories.forEach(c => {
        c.sites.forEach(site => allSites.add(site));
      });
    });

    for (const rawDomain of allSites) {
      // Use our existing mock function to generate data
      const mockStoreData = await fetchStoreDetails(rawDomain);
      
      // Sanitize the domain to remove slashes for the Firestore document ID
      const cleanDomain = rawDomain.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];

      // Save the store document
      const storeRef = doc(db, 'stores', cleanDomain);
      await setDoc(storeRef, {
        domain: mockStoreData.domain,
        stats: mockStoreData.stats,
        createdAt: new Date().toISOString()
      });
      console.log(`✅ Saved store details for: ${cleanDomain}`);

      // Save coupons as a subcollection
      const couponsRef = collection(storeRef, 'coupons');
      for (const coupon of mockStoreData.coupons) {
        // We omit 'id' because firestore will generate one
        const { id, ...couponData } = coupon;
        await addDoc(couponsRef, couponData);
      }

      // Save comments as a subcollection
      const commentsRef = collection(storeRef, 'comments');
      for (const comment of mockStoreData.comments) {
        const { id, ...commentData } = comment;
        await addDoc(commentsRef, commentData);
      }
    }

    console.log("🎉 Seeding completely finished!");
    process.exit(0);

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
