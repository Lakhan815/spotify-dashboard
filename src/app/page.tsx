"use client";
import Image from "next/image";
import { useSession } from "next-auth/react";
import {
  animate,
  createScope,
  spring,
  createDraggable,
  stagger,
  splitText,
  type Scope,
} from "animejs";
import { useEffect, useRef, useState } from "react";
import DotField from "../components/DotField";
import SplitText from "../components/SplitText";

export default function Home() {
  const [showDemo, setShowDemo] = useState(false);
  const root = useRef(null);
  const scope = useRef<Scope | null>(null);
  const { data: session } = useSession();
  const handleAnimationComplete = () => {
    console.log("All letters have animated!");
  };

  const btnClass =
    "rounded-full relative inline-flex items-center p-0.5 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-lime-300 to-[#363636] hover:from-lime-400 hover:to-[#444]";
  const spanClass =
    "relative px-4 py-2 bg-black rounded-lg text-white group-hover:bg-transparent transition-all duration-75";

  return (
    <div
      ref={root}
      className="relative flex flex-col flex-1 items-center justify-center bg-zinc-950 font-sans dark:bg-black overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <DotField
          dotRadius={1.5}
          dotSpacing={14}
          cursorRadius={500}
          cursorForce={0.1}
          bulgeOnly
          bulgeStrength={67}
          glowRadius={160}
          sparkle={false}
          waveAmplitude={0}
          gradientFrom="#2b3e37"
          gradientTo="#bfff00"
          glowColor="#363636"
        />
      </div>
      <main className="relative z-10 flex flex-2 w-full max-w-9xl flex-col items-center justify-center gap-8 px-26">
        <SplitText
          text="Spotify Dashboard"
          className="text-9xl font-semibold text-center"
          delay={50}
          duration={1.25}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: -10 }}
          threshold={0.1}
          rootMargin="-100px"
          textAlign="center"
          onLetterAnimationComplete={handleAnimationComplete}
        />
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row justify-center align-middle">
          {session ? (
            <p className="flex h-12 items-center px-5 text-white">
              Signed in as {session.user?.name}!
            </p>
          ) : (
            <a
              className={btnClass + " w-full md:w-[158px]"}
              href="../api/auth/signin"
              rel="noopener noreferrer"
            >
              <span
                className={
                  spanClass +
                  " flex items-center justify-center gap-2 w-full h-11 font-(family-name:--font-montserrat) font-bold"
                }
              >
                Sign In
              </span>
            </a>
          )}
          <a
            className={btnClass + " w-full md:w-[158px] "}
            href="../dashboard"
            rel="noopener noreferrer"
          >
            <span
              className={
                spanClass +
                " flex items-center justify-center w-full h-11 font-bold"
              }
            >
              Dashboard
            </span>
          </a>

          <button
            onClick={() => setShowDemo(true)}
            className={btnClass + " w-full md:w-[158px]"}
          >
            <span
              className={
                spanClass +
                " flex items-center justify-center w-full h-11 font-bold"
              }
            >
              Watch Demo
            </span>
          </button>
        </div>
      </main>

      {showDemo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setShowDemo(false)}
        >
          <div
            className="relative w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowDemo(false)}
              className="absolute -top-10 right-0 text-white text-2xl"
            >
              ✕
            </button>
            <video
              src="/demo.mp4"
              controls
              autoPlay
              className="w-full rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
