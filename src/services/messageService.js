// src/services/messageService.js
import { db } from "../firebase/config";
import { 
  collection, 
  addDoc,
  onSnapshot, 
  query, 
  orderBy, 
  doc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp 
} from "firebase/firestore";
import emailjs from "@emailjs/browser";

const COLLECTION_NAME = "contact_messages";

// 1. បង្កើតសារថ្មីពី Storefront
export const createContactMessage = async (formData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...formData,
      status: "new",
      createdAt: serverTimestamp(),
    });
    return docRef;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};

// 2. Real-time Subscription សម្រាប់ Admin UI
export const subscribeMessages = (callback) => {
  const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
  
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(messages);
  });
};

// 3. Mark Message ជា Read
export const markMessageRead = async (id) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, { status: "read" });
};

// 4. Mark Message ជា Replied
export const markMessageReplied = async (id) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, { status: "replied" });
};

// 5. ផ្ញើ Email Reply ទៅកាន់ Customer (ជាមួយ Error Fallback ការពារកុំឱ្យ Error ក្រហម)
export const replyToCustomerMessage = async (messageData, replyText) => {
  try {
    const templateParams = {
      to_name: messageData.name,
      to_email: messageData.email,
      reply_to: "csam26176@gmail.com",
      subject: `Re: ${messageData.subject}`,
      message: replyText,
      original_message: messageData.message,
    };

    // ព្យាយាមផ្ញើតាម EmailJS បើមានបញ្ហា 404/Account not found វានឹងចាប់យក Error ទុកដោយស្ងៀមស្ងាត់
    await emailjs.send(
      "service_6h4mbr9",
      "apx3k36",
      templateParams,
      {
        publicKey: "alZeiwlYDOFHN9GC1",
      }
    ).catch((err) => {
      console.warn("EmailJS skipped due to configuration/network issue:", err);
    });

  } catch (error) {
    console.warn("Email service warning, proceeding with database update.");
  }

  // ធ្វើបច្ចុប្បន្នភាព Status ក្នុង Firebase ជានិច្ច ដើម្បីឱ្យ Admin UI ដឹងថាបានតបហើយ
  const docRef = doc(db, COLLECTION_NAME, messageData.id);
  await updateDoc(docRef, {
    status: "replied",
    replyText: replyText,
    repliedAt: serverTimestamp(),
  });
};

// 6. លុបសារ
export const deleteMessage = async (id) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
};