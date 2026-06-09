"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import TopTracks from "@/components/TopTracks";
import TopArtists from "@/components/TopArtists";

export default function Dashboard() {
  //makes the array of top tracks
  const [tracks, setTracks] = useState([]);
  const [artists, setArtists] = useState([]);
  const [timeRange, setTimeRange] = useState("short_term");

  //fetches the data from the api, awaits the response and puts it as a json, and then it inputs it into the track array
  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        "/api/spotify/top-tracks?range=" + timeRange,
      );
      const result = await response.json();
      setTracks(result.items);
    }
    fetchData();
  }, [timeRange]);
  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        "/api/spotify/top-artists?range=" + timeRange,
      );
      const result = await response.json();
      setArtists(result.items);
    }
    fetchData();
  }, [timeRange]);
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
      <TopTracks tracks={tracks} />
      <hr />
      <TopArtists artists={artists} />;
    </div>
  );
}
