import { db } from "../firebase/config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

export const BLOG_CATEGORIES = ["All", "Routine", "Ingredients", "Skincare Tips", "Lifestyle"];

const blogsCollectionRef = collection(db, "blogs");

export const subscribeBlogPosts = (callback, onError) => {
  const q = query(blogsCollectionRef, orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snapshot) => {
      const posts = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      callback(posts);
    },
    (error) => {
      console.error("Error subscribing to blog posts:", error);
      if (onError) onError(error);
      callback([]);
    }
  );
};

export const getBlogPosts = async () => {
  const data = await getDocs(blogsCollectionRef);
  return data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
};

export const createBlogPost = async (postData) => {
  return await addDoc(blogsCollectionRef, {
    ...postData,
    createdAt: serverTimestamp(),
  });
};

export const updateBlogPost = async (id, postData) => {
  const postDoc = doc(db, "blogs", id);
  return await updateDoc(postDoc, {
    ...postData,
    updatedAt: serverTimestamp(),
  });
};

export const deleteBlogPost = async (id) => {
  const postDoc = doc(db, "blogs", id);
  return await deleteDoc(postDoc);
};