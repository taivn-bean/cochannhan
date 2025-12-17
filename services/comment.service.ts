// import {
//   Timestamp,
//   addDoc,
//   collection,
//   getDocs,
//   limit,
//   orderBy,
//   query,
//   serverTimestamp,
//   startAfter,
//   where,
// } from "firebase/firestore";
// import type { Comment } from "@/types/comment";
// import { db } from "@/lib/firebase";

// class CommentService {
//   private COLLECTION = "comments";

//   async addComment(
//     comment: Omit<Comment, "id" | "createdAt"> & { createdAt?: any },
//   ): Promise<string> {
//     const docRef = await addDoc(collection(db, this.COLLECTION), {
//       ...comment,
//       createdAt: serverTimestamp(),
//     });
//     return docRef.id;
//   }

//   async getComments(
//     bookSlug: string,
//     chapterSlug: string,
//     lastDoc?: any,
//     limitCount: number = 5,
//   ): Promise<{ comments: Array<Comment>; lastDoc: any }> {
//     try {
//       let q = query(
//         collection(db, this.COLLECTION),
//         where("bookSlug", "==", bookSlug),
//         where("chapterSlug", "==", chapterSlug),
//         orderBy("createdAt", "desc"),
//         limit(limitCount),
//       );

//       if (lastDoc) {
//         q = query(q, startAfter(lastDoc));
//       }

//       const snapshot = await getDocs(q);
//       const comments = snapshot.docs.map((doc) => {
//         const data = doc.data();
//         return {
//           id: doc.id,
//           ...data,
//           // Convert Firestore Timestamp to millis for easier frontend handling
//           createdAt:
//             data.createdAt instanceof Timestamp
//               ? data.createdAt.toMillis()
//               : Date.now(),
//         } as Comment;
//       });

//       return {
//         comments,
//         lastDoc:
//           // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
//           snapshot.docs && snapshot.docs.length === limitCount
//             ? snapshot.docs[snapshot.docs.length - 1]
//             : null,
//       };
//     } catch (error) {
//       console.error("Error fetching comments:", error);
//       return { comments: [], lastDoc: null };
//     }
//   }
// }

// export const commentService = new CommentService();
