import * as functions from "firebase-functions"; // v1 import
import * as admin from "firebase-admin";
import {Storage} from "@google-cloud/storage"; // GCS bucket

admin.initializeApp();
const firestore = admin.firestore();

const storage = new Storage();
// Google Cloud Storage buckets
const rawVideoBucketName = "ctk-yt-raw-videos";

const videoCollectionId = "videos";

export interface Video {
  id?: string, // unique ID
  uid?: string, // user ID
  filename?: string,
  status?: "processing" | "processed",
  title?: string,
  description?: string
}

// 1. Auth trigger (V1) createUser firebase function
export const createUser = functions.auth.user().onCreate(
  (user: admin.auth.UserRecord) => {
    const userInfo = {
      uid: user.uid,
      email: user.email || null,
      photoUrl: user.photoURL || null,
    };

    return firestore.collection("users").doc(user.uid).set(userInfo)
      .then(() => {
        functions.logger.info(`User Created: ${JSON.stringify(userInfo)}`);
      });
  });

// 2. HTTPS Callable Function (V1) generateUploadUrl firebase function
// 部署 Firebase Functions 時，被 Firebase 註冊成一個「Callable Function」
// Firebase 會幫你建好 endpoint（你不用知道 URL 是什麼，因為 SDK 幫你處理好了）
export const generateUploadUrl = functions.https.onCall(
  async (
    data: {fileExtension: string},
    context: functions.https.CallableContext
  ) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "The function must be called while authenticated."
      );
    }

    const fileExtension = data.fileExtension;
    if (!fileExtension || typeof fileExtension !== "string") {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "fileExtension is required and must be a string"
      );
    }

    const fileName = `${context.auth.uid}-${Date.now()}.${fileExtension}`;
    const bucket = storage.bucket(rawVideoBucketName);

    const [url] = await bucket.file(fileName).getSignedUrl({
      version: "v4",
      action: "write",
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    });

    return {url, fileName};
  });

// 3. Create getVideos Callable Function
// FrontEnd: const getVideos = httpsCallable(functions, 'getVideos');
export const getVideos = functions.https.onCall(async () => {
  const querySnapshot =
      await firestore.collection(videoCollectionId).limit(10).get();
  return querySnapshot.docs.map((doc) => doc.data());
});


