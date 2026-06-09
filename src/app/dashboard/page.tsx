"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import TopTracks from "@/components/TopTracks";
import TopArtists from "@/components/TopArtists";

export default function Dashboard() {
  //makes the array of top tracks
  const [tracks, setTracks] = useState<any[]>([]);
  const [artists, setArtists] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState("short_term");
  const [selection, setSelection] = useState("tracks");

  //fetches the data from the api, awaits the response and puts it as a json, and then it inputs it into the track array
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

  //returns all of the data from the array
  //this is what sends the track data into TopTracks.tsx
  return (
    <div>
      <div className="flex justify-between items-center px-8 pt-8 relative p-0.5 overflow-hidden text-sm font-medium text-heading rounded-base group bg-gradient-to-br from-teal-300 to-[#363636]-300 group-hover:from-teal-300 group-hover:to-[#363636]-300 dark:text-white dark:hover:text-heading focus:ring-4 focus:outline-none focus:ring-[#363636]-200 dark:focus:ring-lime-800">
        <span className=" relative px-4 py-2.5 transition-all ease-in duration-75 bg-neutral-primary-soft rounded-base group-hover:bg-transparent group-hover:dark:bg-transparent leading-5">
          <div className="flex gap-2">
            <button onClick={() => setTimeRange("short_term")}>
              Last 4 Weeks
            </button>
            <button onClick={() => setTimeRange("medium_term")}>
              Last 6 Months
            </button>
            <button onClick={() => setTimeRange("long_term")}>All Time</button>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setSelection("tracks")}>Top Tracks</button>
            <button onClick={() => setSelection("artists")}>Top Artists</button>
          </div>
        </span>
      </div>
      <hr />
      {selection === "tracks" && <TopTracks tracks={tracks} />}
      {selection === "artists" && <TopArtists artists={artists} />}
    </div>
  );
}
