// server side

import { Suspense } from "react";
import WatchPlayer from "./WatchPlayer";

export default function WatchPage() {
  return (
    <main>
      <h1>Watch Page</h1>
      <Suspense fallback={<p>Loading video...</p>}>
        <WatchPlayer />
      </Suspense>
    </main>
  );
}

