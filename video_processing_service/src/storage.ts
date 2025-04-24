import {Storage} from  '@google-cloud/storage'
import fs from 'fs'
import ffmpeg from 'fluent-ffmpeg'

// Create a instance of GCS, in order to interact with Google Cloud buckets
const storage = new Storage();

// Google Cloud Storage buckets
const rawVideoBucketName = "ctk-yt-raw-videos";
const processedVideoBucketName = "ctk-yt-processed-videos";

// Local storage folder name
// 1. The local raw video folder path to save the "raw video download from google cloud"
const localRawVideoPath = "./raw_videos";
// 2. The local processed video folder path to save the "processed videos"
const localProcessedVideoPath = "./processed_videos";

/**
 * Creates the local directories to save raw and processed videos.
 */
export function setupDirectories() {
    ensureDirectoryExistence(localRawVideoPath);
    ensureDirectoryExistence(localProcessedVideoPath);
}

/**
 * @param rawVideoName - The name of the file to convert from {@link localRawVideoPath}
 * @param processedVideoName - The name of the file to convert to {@link localProcessedVideoPath}
 * @returns A promise that resolves when the video has been converted.
 */
export function convertVideo(rawVideoName: string, processedVideoName: string) {
    return new Promise<void>((resolve, reject) => {
        const inputPath = `${localRawVideoPath}/${rawVideoName}`;
        const outputPath = `${localProcessedVideoPath}/${processedVideoName}`;

        ffmpeg(inputPath)
        .outputOptions("-vf", "scale=-1:360") // 360p resolution
        .on("end", function () {
            console.log('Video processing successful!');
            resolve();
        })
        .on("error", function (err:any) {
            console.log('An error occurred: ', err.message);
            reject();
        })
        .save(outputPath);
    });
}

/**
 * @param fileName - The name of the file to "download" from the Google Cloud storage
 * {@link rawVideoBucketName} bucket into the {@link localRawVideoPath} folder on Cloud Run container
 * @returns A promise that resolves when the file has been downloaded
 */
export async function downloadRawVideo(fileName: string) {
    await storage.bucket(rawVideoBucketName)
        .file(fileName).download({destination: `${localRawVideoPath}/${fileName}`})

    console.log(`gs://${rawVideoBucketName}/${fileName} downloaded to ${localRawVideoPath}/${fileName}`)
}

/**
 * @param fileName - The name of the file to "upload" from the Google Run container
 * {@link localProcessedVideoPath} folder into the Google Cloud storage {@link processedVideoBucketName} bucket
 * @returns A promise that resolves when the file has been uploaded
 */
export async function uploadProcessedVideo(fileName: string) {
    const bucket = storage.bucket(processedVideoBucketName);

    await bucket.upload(`${localProcessedVideoPath}/${fileName}`, {
        destination: fileName
    });
    console.log(
        `${localProcessedVideoPath}/${fileName} uploaded to gs://$${processedVideoBucketName}/${fileName}`
    );
    await bucket.file(fileName).makePublic();
}

/**
 * @param fileName - The name of the file to delete from the {@link localRawVideoPath} folder
 * @returns A promise that resolves when the file has been deleted
 */
export function deleteRawVideo(fileName: string) {
    return deleteFile(`${localRawVideoPath}/${fileName}`);
}

/**
 * @param fileName - The name of the file to delete from the {@link localProcessedVideoPath} folder
 * @returns A promise that resolves when the file has been deleted
 */
export function deleteProcessedVideo(fileName: string) {
    return deleteFile(`${localProcessedVideoPath}/${fileName}`);
}

/**
 * @param filePath - The path of the file to delete
 * @returns A promise that resolves when the file has been deleted
 */
function deleteFile(filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.log(`Failed to delete file at ${filePath}`, err);
                    reject(err);
                } else {
                    console.log(`File deleted at ${filePath}`);
                    resolve();
                }
            });
        } else {
            console.log(`File not found at ${filePath}, skipping delete.`)
            resolve();
        }
    });
}

/**
 * Ensure a directory exists, creating it if necessary
 * @param {string} dirPath - The directory path to check
 */
function ensureDirectoryExistence(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
        // recursive: true enables creating nested directories
        fs.mkdirSync(dirPath, {recursive: true});
        console.log(`Directory created at ${dirPath}`);
    }
}

