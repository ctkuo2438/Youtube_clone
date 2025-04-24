// uploadVideo
import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";

// 自動去呼叫 Firebase 後端你部署的 Cloud Function，名稱就是 generateUploadUrl
// 這個機制是 Firebase 幫你封裝的 RPC 機制，你只要名稱對、function 有部署，它就能呼叫成功
const generateUploadUrl = httpsCallable(functions, "generateUploadUrl");
const getVideosFunction = httpsCallable(functions, 'getVideos');

export interface Video {
  id?: string,
  uid?: string,
  filename?: string,
  status?: 'processing' | 'processed',
  title?: string,
  description?: string  
}

export async function uploadVideo(file: File) {
  const fileExtension = file.name.split(".").pop();

  const response = await generateUploadUrl({ fileExtension });
  const { url, fileName } = response.data as {
    url: string;
    fileName: string;
  };

  if (!url) {
    throw new Error("Signed URL not received.");
  }

  const uploadRes = await fetch(url, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  });

  if (!uploadRes.ok) {
    throw new Error(`Failed to upload file to GCS: ${uploadRes.statusText}`);
  }

  return {
    status: "uploaded",
    fileName,
    url,
  };
}

export async function getVideos() {
  const response = await getVideosFunction();
  return response.data as Video[];
}