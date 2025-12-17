// import {
//   addDoc,
//   collection,
//   doc,
//   getDocs,
//   orderBy,
//   query,
//   serverTimestamp,
//   updateDoc,
// } from "firebase/firestore";
// import type { ChapterFeedback, GeneralFeedback } from "@/types/feedback";
// import { db } from "@/lib/firebase";

// class FeedbackService {
//   COLLECTION = "feedbacks";

//   // Submit chapter error report
//   reportChapterError = async (
//     data: Omit<ChapterFeedback, "id" | "createdAt">,
//   ) => {
//     const feedbackRef = collection(db, this.COLLECTION);

//     const docRef = await addDoc(feedbackRef, {
//       ...data,
//       type: "chapter_error",
//       createdAt: serverTimestamp(),
//     });

//     return docRef.id;
//   };

//   // Submit general feedback
//   submitGeneralFeedback = async (
//     data: Omit<GeneralFeedback, "id" | "createdAt" | "updatedAt">,
//   ) => {
//     const feedbackRef = collection(db, this.COLLECTION);

//     const docRef = await addDoc(feedbackRef, {
//       ...data,
//       type: "general",
//       createdAt: serverTimestamp(),
//       updatedAt: serverTimestamp(),
//     });

//     return docRef.id;
//   };

//   // Get all feedbacks
//   getFeedbacks = async () => {
//     const feedbackRef = collection(db, this.COLLECTION);
//     const q = query(feedbackRef, orderBy("createdAt", "desc"));
//     const querySnapshot = await getDocs(q);

//     return querySnapshot.docs.map((feedbackDoc) => ({
//       id: feedbackDoc.id,
//       ...feedbackDoc.data(),
//     })) as Array<ChapterFeedback | GeneralFeedback>;
//   };

//   // Update feedback status
//   updateFeedbackStatus = async (
//     id: string,
//     status: ChapterFeedback["status"] | GeneralFeedback["status"],
//   ) => {
//     try {
//       const docRef = doc(db, this.COLLECTION, id);

//       await updateDoc(docRef, {
//         status,
//         updatedAt: serverTimestamp(), // Update timestamp when status changes
//       });
//     } catch (error) {
//       console.error("Error updating feedback status:", error);
//     }
//   };

//   // Get feedback stats
//   getFeedbackStats = async () => {
//     const feedbackRef = collection(db, this.COLLECTION);
//     const querySnapshot = await getDocs(feedbackRef);
//     const feedbacks = querySnapshot.docs.map(
//       (feedbackDoc) => feedbackDoc.data() as ChapterFeedback | GeneralFeedback,
//     );
//     const stats = {
//       total: feedbacks.length,
//       pending: feedbacks.filter((f) => f.status === "pending").length,
//       resolved: feedbacks.filter(
//         (f) => f.status === "resolved" || f.status === "completed",
//       ).length,
//       ignored: feedbacks.filter(
//         (f) => f.status === "ignored" || f.status === "rejected",
//       ).length,
//       inProgress: feedbacks.filter((f) => f.status === "in-progress").length,
//       completed: feedbacks.filter((f) => f.status === "completed").length,
//       rejected: feedbacks.filter((f) => f.status === "rejected").length,
//     };

//     return stats;
//   };
// }

// export const feedbackService = new FeedbackService();
