"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Song } from "@/types/song";
import { useMediaPlayer } from "@/components/media-player";
import { SONGS } from "@/data/songs";

export default function PlayerPage() {
  const [current, setCurrent] = useState<Song | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const { play, pause, resume, stop, setYtContainer, isYouTube } =
    useMediaPlayer();

  const handlePlay = (song: Song) => {
    if (current?.id === song.id) {
      if (isPaused) {
        resume();
        setIsPaused(false);
      } else {
        pause();
        setIsPaused(true);
      }
      return;
    }
    setIsPaused(false);
    setCurrent(song);
  };

  useEffect(() => {
    if (!current) return;
    const t = setTimeout(() => play(current), 0);
    return () => clearTimeout(t);
  }, [current, play]);

  const handleStop = () => {
    stop();
    setCurrent(null);
    setIsPaused(false);
  };

  return (
    <div className="min-h-screen bg-amber-50 p-4 pb-32" dir="rtl">
      <Link
        href="/"
        className="mb-6 flex min-h-[72px] min-w-[72px] items-center justify-center self-start rounded-2xl bg-amber-200 text-2xl font-bold text-amber-900 active:bg-amber-300"
      >
        חזרה
      </Link>

      {current && (
        <div className="mb-8 rounded-3xl bg-white p-6">
          <p className="mb-2 text-3xl font-bold text-amber-900">{current.title}</p>
          <p className="mb-4 text-2xl text-amber-800">{current.artist}</p>
          {isYouTube(current.url) && (
            <div
              ref={setYtContainer}
              className="mb-4 h-[120px] w-full overflow-hidden rounded-xl bg-black"
            />
          )}
          <div className="flex gap-4">
            {isPaused ? (
              <button
                type="button"
                onClick={() => {
                  resume();
                  setIsPaused(false);
                }}
                className="min-h-[72px] flex-1 rounded-2xl bg-green-600 text-2xl font-bold text-white active:bg-green-700"
              >
                המשך
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  pause();
                  setIsPaused(true);
                }}
                className="min-h-[72px] flex-1 rounded-2xl bg-amber-500 text-2xl font-bold text-white active:bg-amber-600"
              >
                השהה
              </button>
            )}
            <button
              type="button"
              onClick={handleStop}
              className="min-h-[72px] flex-1 rounded-2xl bg-red-500 text-2xl font-bold text-white active:bg-red-600"
            >
              עצור
            </button>
          </div>
        </div>
      )}

      <ul className="flex flex-col gap-5">
        {SONGS.length === 0 ? (
          <li className="rounded-2xl bg-white p-8 text-center text-2xl text-amber-800">
            אין שירים
          </li>
        ) : (
          SONGS.map((song) => (
            <li key={song.id}>
              <button
                type="button"
                onClick={() => handlePlay(song)}
                className={`flex w-full items-center rounded-2xl p-6 text-right ${
                  current?.id === song.id
                    ? "bg-amber-500 text-white"
                    : "bg-white text-amber-900"
                }`}
              >
                <span className="text-2xl font-bold">{song.title}</span>
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
