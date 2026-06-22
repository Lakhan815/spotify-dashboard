"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import TopTracks from "@/components/TopTracks";
import TopArtists from "@/components/TopArtists";
import DurationChart from "@/components/DurationChart";
import RecentlyPlayed from "@/components/RecentlyPlayed";
import MoodChart from "@/components/MoodChart";

export default function Dashboard() {
  const [tracks, setTracks] = useState<any[]>([]);
  const [artists, setArtists] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState("short_term");
  const [selection, setSelection] = useState("tracks");
  const [durationData, setDurationData] = useState<
    { name: string; duration: number }[]
  >([]);
  const [playedData, setPlayedData] = useState<
    { name: string; played_at: string; albumImage: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [tagData, setTagData] = useState<any[]>([]);

  useEffect(() => {
    if (selection != "tracks") return;
    setLoading(true);
    async function fetchData() {
      const response = await fetch(
        "/api/spotify/top-tracks?range=" + timeRange,
      );
      const result = await response.json();
      setTracks(result.items || []);
      const durationData = (result.items || []).map((track: any) => ({
        name: track.name,
        duration: Math.round(track.duration_ms / 1000),
      }));
      setDurationData(durationData);
      const moodResponse = await fetch("/api/spotify/mood");
      const moodResult = await moodResponse.json();
      console.log(moodResult);
      setTagData(moodResult.slice(0, 8));
      console.log(tagData);
      setLoading(false);
    }
    fetchData();
  }, [timeRange, selection]);

  useEffect(() => {
    if (selection != "artists") return;
    async function fetchData() {
      setLoading(true);
      const response = await fetch(
        "/api/spotify/top-artists?range=" + timeRange,
      );
      const result = await response.json();
      setArtists(result.items || []);
      setLoading(false);
    }
    fetchData();
  }, [timeRange, selection]);

  useEffect(() => {
    if (selection != "recent") return;
    async function fetchData() {
      setLoading(true);
      const response = await fetch("/api/spotify/recently-played");
      const result = await response.json();
      const playedData = (result.items || []).map((item: any) => ({
        name: item.track.name,
        played_at: item.played_at,
        albumImage: item.track.album.images[0]?.url,
      }));
      console.log(playedData);
      setPlayedData(playedData);
      setLoading(false);
    }
    fetchData();
  }, [selection]);

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
          <button onClick={() => setSelection("recent")} className={btnClass}>
            <span className={spanClass}>Recent Tracks</span>
          </button>
          <button onClick={() => setSelection("artists")} className={btnClass}>
            <span className={spanClass}>Top Artists</span>
          </button>
        </div>
      </div>
      <hr className="border-white/10 mb-6" />
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="w-full aspect-square bg-white/10 rounded-lg animate-pulse" />
              <div className="h-4 bg-white/10 rounded animate-pulse" />
              <div className="h-3 w-2/3 bg-white/10 rounded animate-pulse" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {selection === "tracks" && <TopTracks tracks={tracks} />}
          {selection === "artists" && <TopArtists artists={artists} />}
          {selection === "tracks" && (
            <DurationChart durationData={durationData} />
          )}
          {selection === "tracks" && <MoodChart tags={tagData} />}
          {selection === "recent" && <RecentlyPlayed tracks={playedData} />}
        </>
      )}
    </div>
  );
}
