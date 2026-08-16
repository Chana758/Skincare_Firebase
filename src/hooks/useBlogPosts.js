import { useEffect, useState } from "react";
import { subscribeBlogPosts } from "../services/blogService";

export function useBlogPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeBlogPosts(
      (data) => {
        setPosts(data);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  return { posts, loading, error };
}