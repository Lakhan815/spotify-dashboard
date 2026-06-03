"use client";
import { useEffect, useState } from "react";
import TopTracks from "@/components/TopTracks";

export default function Dashboard() {
  const [tracks, setTracks] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/spotify/top-tracks");
      const result = await response.json();
      setTracks(result.items);
    }
    fetchData();
  }, []);
  return <TopTracks tracks={tracks} />;
}
