import { credential } from "firebase-admin";
import {initializeApp} from "firebase-admin/app";
import {Firestore} from "firebase-admin/firestore";

// GOOGLE_APPLICATION_CREDENTIALS
initializeApp({credential: credential.applicationDefault()});

const firestore = new Firestore();

// Note: This requires setting an env variable in Cloud Run
/** if (process.env.NODE_ENV !== 'production') {
  firestore.settings({
      host: "localhost:8080", // Default port for Firestore emulator
      ssl: false
  });
} */


const videoCollectionId = 'videos'; // save the informations about the upload video

// informations about the video
export interface Video {
  id?: string,
  uid?: string,
  filename?: string,
  status?: 'processing' | 'processed', // status of the video
  title?: string,
  description?: string
}

// This function is used to retrieve a specific video info based on a videoId
async function getVideo(videoId: string) {
  const snapshot = await firestore.collection(videoCollectionId).doc(videoId).get();
  return (snapshot.data() as Video) ?? {}; // informations about the video, if null return {}
}

// Update or add a new video information
export function setVideo(videoId: string, video: Video) {
  return firestore
    .collection(videoCollectionId)
    .doc(videoId)
    // only update the info that is new
    .set(video, { merge: true }) // won't overwrite the previous informations that we already wrote
}

// check if it's new video
export async function isVideoNew(videoId: string) {
  const video = await getVideo(videoId);
  return video?.status === undefined; // if status is undefined, meaning not been processed yet, new video
}
