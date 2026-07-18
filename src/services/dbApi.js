import { collection, doc, getDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';

export const fetchStoreDetails = async (domain) => {
  try {
    const cleanDomain = domain.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
    
    // Fetch the main store document
    const storeRef = doc(db, 'stores', cleanDomain);
    const storeSnap = await getDoc(storeRef);
    
    if (!storeSnap.exists()) {
      return null;
    }
    
    const storeData = storeSnap.data();
    
    // Fetch coupons subcollection
    const couponsRef = collection(storeRef, 'coupons');
    const couponsSnap = await getDocs(couponsRef);
    const coupons = couponsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    
    // Fetch comments subcollection
    const commentsRef = collection(storeRef, 'comments');
    const commentsSnap = await getDocs(commentsRef);
    const comments = commentsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    
    return {
      domain: storeData.domain,
      stats: storeData.stats,
      coupons,
      comments
    };
  } catch (error) {
    console.error("Error fetching store details:", error);
    return null;
  }
};

export const fetchCategories = async (region = 'EN') => {
  try {
    const regionRef = doc(db, 'regions', region);
    const regionSnap = await getDoc(regionRef);
    
    if (regionSnap.exists()) {
      return regionSnap.data().categories;
    }
    return [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};
