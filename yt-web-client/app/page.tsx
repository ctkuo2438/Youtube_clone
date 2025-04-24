// server side component, main page
import styles from "./page.module.css";
import Link from "next/link";
import Image from "next/image";
import { getVideos } from "@/lib/functions";

export default async function Home() {
  const videos = await getVideos(); // finish executing before below render

  return (
    <main>
      {
        videos.map((video) => ( // map is gonna return a array JSX.Element[]
          <Link 
            href={`/watch?v=${video.filename}`} key={video.id}>
            <Image src={'/thumbnail.png'} alt='video' width={120} height={80}
              className={styles.thumbnail}/>
          </Link>
        ))
      }
    </main>
  )
}

export const revalidate = 15; // sec
