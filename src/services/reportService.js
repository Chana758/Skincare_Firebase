// src/services/reportService.js
import { collection, query, orderBy, limit, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

/** Fetches the last N daily rollup docs written by the dailySalesSummary scheduled function. */
export async function fetchRecentReports(days = 30) {
  const q = query(collection(db, "reports"), orderBy("date", "desc"), limit(days));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function fetchReportForDate(dateKey) {
  const snap = await getDoc(doc(db, "reports", dateKey));
  return snap.exists() ? snap.data() : null;
}