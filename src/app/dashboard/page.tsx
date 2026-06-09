"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import TopTracks from "@/components/TopTracks";
import TopArtists from "@/components/TopArtists";
import GenreChart from "@/components/GenreChart";

export default function Dashboard() {
  const [tracks, setTracks] = useState<any[]>([]);
  const [artists, setArtists] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState("short_term");
  const [selection, setSelection] = useState("tracks");
  const [genreData, setGenreData] = useState<{ name: string; count: number }[]>(
    [],
  );
  useEffect(() => {
    if (selection != "tracks") return;
    async function fetchData() {
      const response = await fetch(
        "/api/spotify/top-tracks?range=" + timeRange,
      );
      const result = await response.json();
      setTracks(result.items || []);
    }
    fetchData();
  }, [timeRange, selection]);

  useEffect(() => {
    if (selection != "artists") return;
    async function fetchData() {
      const response = await fetch(
        "/api/spotify/top-artists?range=" + timeRange,
      );
      const result = await response.json();
      setArtists(result.items || []);
    }
    fetchData();
  }, [timeRange, selection]);

  useEffect(() => {
    async function fetchGenres() {
      const response = await fetch(
        "/api/spotify/top-artists?range=" + timeRange,
      );
      const result = await response.json();
      console.log(result);
      const genreMap = new Map();
      const items = result.items || [];
      for (let i = 0; i < items.length; i++) {
        const genres = items[i].genres ?? [];
        for (let j = 0; j < genres.length; j++) {
          if (!genreMap.has(genres[j])) {
            genreMap.set(genres[j], { val: 1 });
          } else {
            genreMap.get(genres[j]).val++;
          }
        }
      }
      const genreArray = Array.from(genreMap, ([name, val]) => ({
        name,
        count: val.val,
      }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
      console.log("genreArray:", genreArray);

      setGenreData(genreArray);
    }
    fetchGenres();
  }, [timeRange]);

  const btnClass =
    "relative inline-flex items-center p-0.5 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-lime-300 to-[#363636] hover:from-lime-400 hover:to-[#444]";
  const spanClass =
    "relative px-4 py-2 bg-black rounded-lg text-white group-hover:bg-transparent transition-all duration-75";

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setTimeRange("short_term")}
            className={btnClass}
          >
            <span className={spanClass}>Last 4 Weeks</span>
          </button>
          <button
            onClick={() => setTimeRange("medium_term")}
            className={btnClass}
          >
            <span className={spanClass}>Last 6 Months</span>
          </button>
          <button
            onClick={() => setTimeRange("long_term")}
            className={btnClass}
          >
            <span className={spanClass}>All Time</span>
          </button>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setSelection("tracks")} className={btnClass}>
            <span className={spanClass}>Top Tracks</span>
          </button>
          <button onClick={() => setSelection("artists")} className={btnClass}>
            <span className={spanClass}>Top Artists</span>
          </button>
        </div>
      </div>
      <hr className="border-white/10 mb-6" />
      {selection === "tracks" && <TopTracks tracks={tracks} />}
      {selection === "artists" && <TopArtists artists={artists} />}
      <div style={{ width: "100%", height: 400 }}>
        console.log("genreData in render:", genreData);
        <GenreChart genreData={genreData} />
      </div>
    </div>
  );
}
