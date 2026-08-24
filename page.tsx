"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";

type Clip = { src: string; caption: string; uploaded?: boolean };

const birthdayClips: Clip[] = [
  { src: "/videos/eddie-1.mp4", caption: "Birthday energy only 🎉" },
  { src: "/videos/eddie-2.mp4", caption: "A whole main character 🥳" },
  { src: "/videos/eddie-3.mp4", caption: "More life, more joy, more memories ✨" },
  { src: "/videos/eddie-4.mp4", caption: "Today belongs to Eddie 🎂" },
  { src: "/videos/eddie-5.mp4", caption: "Happy birthday, legend 💛" },
];

export default function Home() {
  const [clips, setClips] = useState(birthdayClips);
  const [liked, setLiked] = useState<Record<number, boolean>>({});
  const [muted, setMuted] = useState(true);
  const [showWish, setShowWish] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const videos = Array.from(document.querySelectorAll<HTMLVideoElement>("video"));
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        const video = entry.target as HTMLVideoElement;
        if (entry.isIntersecting && entry.intersectionRatio > 0.72) video.play().catch(() => undefined);
        else video.pause();
      }),
      { threshold: [0.72] },
    );
    videos.forEach((video) => observer.observe(video));
    return () => observer.disconnect();
  }, [clips]);

  function addVideos(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []).filter((file) => file.type.startsWith("video/"));
    if (!files.length) return;
    setClips((current) => [
      ...files.map((file) => ({ src: URL.createObjectURL(file), caption: "Added for Eddie 💛", uploaded: true })),
      ...current,
    ]);
    event.target.value = "";
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand"><span className="brand-mark">E</span><span>EddieTok</span></div>
        <div className="tabs" aria-label="Feed tabs"><span>Following</span><strong>For Eddie</strong></div>
        <button className="upload-button" onClick={() => fileInput.current?.click()} aria-label="Add videos">
          <span>+</span><span className="upload-label"> Add video</span>
        </button>
        <input ref={fileInput} className="visually-hidden" type="file" accept="video/*" multiple onChange={addVideos} />
      </header>

      <section className="video-feed" aria-label="Eddie's birthday videos">
        {clips.map((clip, index) => (
          <article className="video-card" key={`${clip.src}-${index}`}>
            <video src={clip.src} loop playsInline muted={muted} preload={index < 2 ? "auto" : "metadata"} onClick={(e) => {
              const video = e.currentTarget;
              video.paused ? video.play() : video.pause();
            }} />
            <div className="shade" />
            <div className="sparkles" aria-hidden="true"><i>✦</i><i>✧</i><i>✦</i></div>
            <div className="intro-copy">
              <p className="eyebrow">24 AUGUST · BIRTHDAY EDITION</p>
              <h1>{index === 0 ? "Happy Birthday, Eddie!" : "Eddie's Day"}</h1>
              <p>{clip.caption}</p>
              <span className="sound">♫ Eddie&apos;s birthday mix · original sound</span>
            </div>
            <aside className="actions" aria-label="Video actions">
              <button onClick={() => setLiked((current) => ({ ...current, [index]: !current[index] }))} aria-label="Like video">
                <span className={liked[index] ? "heart liked" : "heart"}>♥</span><small>{liked[index] ? "1.3K" : "1.2K"}</small>
              </button>
              <button onClick={() => setShowWish(true)} aria-label="Leave a birthday wish"><span>💬</span><small>Wish</small></button>
              <button onClick={() => setMuted((value) => !value)} aria-label={muted ? "Turn sound on" : "Mute sound"}><span>{muted ? "🔇" : "🔊"}</span><small>{muted ? "Sound" : "On"}</small></button>
              <div className="disc"><span>E</span></div>
            </aside>
            {clip.uploaded && <span className="new-badge">Just added</span>}
          </article>
        ))}
      </section>

      <nav className="bottom-nav" aria-label="Main navigation">
        <button><span>⌂</span><small>Home</small></button>
        <button onClick={() => fileInput.current?.click()} className="create" aria-label="Add video"><span>+</span></button>
        <button onClick={() => setShowWish(true)}><span>🎁</span><small>Wish</small></button>
      </nav>

      {showWish && (
        <div className="modal-backdrop" onClick={() => setShowWish(false)}>
          <div className="wish-card" role="dialog" aria-modal="true" aria-label="Birthday wish" onClick={(e) => e.stopPropagation()}>
            <button className="close" onClick={() => setShowWish(false)} aria-label="Close">×</button>
            <span className="cake">🎂</span>
            <h2>A wish for Eddie</h2>
            <p>May this new year bring you big laughs, bold adventures, and everything your heart has been hoping for.</p>
            <strong>Happy birthday! 💛</strong>
          </div>
        </div>
      )}
    </main>
  );
}
