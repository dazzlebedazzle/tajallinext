'use client';

import "./Loader.css"

const Loader = ()=>
  (
    <div className="loading-container">
    <video
      autoPlay
      loop
      muted
      playsInline
      width={150}
      height={150}
      className="rounded-lg"
    >
      <source src="/loader.webm" type="video/webm" />
      <p>Loading...</p>
    </video>
  </div>
)

export default Loader