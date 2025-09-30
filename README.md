# Full Stack Video Sharing Platform


## Stack Overview
- **Frontend**: Next.js, Firebase Web SDK
- **Backend**: Firebase Functions, Firestore, Google Cloud Storage, Cloud Run
- **Video Processing**: Node.js + Express.js, deployed to Cloud Run
- **Deployment**: Docker + GCP Artifact Registry + Cloud Run

---

## Project Structure

- `yt-web-client/`: Next.js frontend
- `yt-api-service/`: Firebase Cloud Functions
- `video-processing-service/`: Backend for video processing

---

## Features

- Firebase Auth trigger
- Signed upload URL via Callable Function
- Upload raw video to GCS
- Automatic backend processing
- Store and display processed video
- Watch page with dynamic video player

---

## Deployment

### Frontend

- Docker build & push
- Deploy to Cloud Run (public)

### Backend

- Deploy to Cloud Run (internal)
- Deploy Firebase Functions

---

## Firebase Setup

- Firestore
- Storage buckets (raw & processed)
- Deploy functions

