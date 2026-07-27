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
import { useEffect, useRef } from "react";
import DotField from "../components/DotField";

export default function Home() {
  const root = useRef(null);
  const scope = useRef<Scope | null>(null);
  const { data: session } = useSession();

  const btnClass =
    "rounded-full relative inline-flex items-center p-0.5 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-lime-300 to-[#363636] hover:from-lime-400 hover:to-[#444]";
  const spanClass =
    "relative px-4 py-2 bg-black rounded-lg text-white group-hover:bg-transparent transition-all duration-75";

  useEffect(() => {
    if (!root.current) return;

    scope.current = createScope({ root: root.current }).add((self) => {
      const { chars } = splitText("h2", { words: false, chars: true });

      animate(chars, {
        y: [
          { to: "-2.75rem", ease: "outExpo", duration: 600 },
          { to: 0, ease: "outBounce", duration: 800, delay: 100 },
        ],
        rotate: { from: "-1turn", delay: 0 },
        delay: stagger(50),
        ease: "inOutCirc",
        loopDelay: 1000,
        loop: true,
      });
    });

    return () => scope.current?.revert();
  }, []);
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
      <main className="relative z-10 flex flex-1 w-full max-w-4xl flex-col items-center justify-center gap-8 px-16">
        <div className="large grid centered square-grid text-center align-middle font-(family-name:--font-montserrat) font-medium text-white">
          <h2 className="text-7xl">Spotify Dashboard</h2>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row justify-center align-middle">
          {session ? (
            <p className="flex h-12 items-center px-5 text-[#21000e] drop-shadow-[0_0_15px_#FFC0CB]">
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
                  " flex items-center justify-center gap-2 w-full h-11 font-(family-name:--font-montserrat)"
                }
              >
                Sign In
              </span>
            </a>
          )}
          <a
            className={btnClass + " w-full md:w-[158px]"}
            href="../dashboard"
            rel="noopener noreferrer"
          >
            <span
              className={
                spanClass + " flex items-center justify-center w-full h-11"
              }
            >
              Dashboard
            </span>
          </a>
        </div>
      </main>
    </div>
  );
}
