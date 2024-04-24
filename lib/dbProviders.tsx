import { collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { ExportProvider } from '../types/dbExportProviders';
import { firestore } from '../firebase_setup/firebase';

export const fetchAllProviders = (async (): Promise<any> => {
    const providersCol = collection(firestore, 'providers');
    const providersSnapshot = await getDocs(providersCol);
    const providers = providersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ExportProvider[];
    return providers;
})

export async function fetchProviderById(id: string, fields: string[]): Promise<ExportProvider | null> {
  // Create a reference to the document
  const docRef = doc(firestore, 'providers', id);

  // Fetch the document
  const docSnap = await getDoc(docRef);

  // Check if the document exists
  if (docSnap.exists()) {
    // Document found, return the data with an explicit type assertion
    const data = docSnap.data();
    const result: Partial<ExportProvider> = {};
    fields.forEach((field: string) => {
      result[field as keyof ExportProvider] = data[field];
    });
    return result as ExportProvider; // Assuring TypeScript that data conforms to the Provider type
  } else {
    // No such document
    console.log('No such document!');
    return null;
  }
}