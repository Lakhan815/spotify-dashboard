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
      <div>
        <button onClick={() => setTimeRange("short_term")}>Last 4 Weeks</button>
        <button onClick={() => setTimeRange("medium_term")}>
          Last 6 Months
        </button>
        <button onClick={() => setTimeRange("long_term")}>All Time</button>
      </div>
      <hr />
      <div>
        <button onClick={() => setSelection("tracks")}>Top Tracks</button>
        <button onClick={() => setSelection("artists")}>Top Artists</button>
      </div>
      <hr />
      {selection === "tracks" && <TopTracks tracks={tracks} />}
      {selection === "artists" && <TopArtists artists={artists} />}
    </div>
  );
}
