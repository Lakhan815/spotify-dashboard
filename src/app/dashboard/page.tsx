"use client";
import { useEffect, useState } from "react";
import TopTracks from "@/components/TopTracks";
import TopArtists from "@/components/TopArtists";

export default function Dashboard() {
  //makes the array of top tracks
  const [tracks, setTracks] = useState([]);
  const [artists, setArtists] = useState([]);

  //fetches the data from the api, awaits the response and puts it as a json, and then it inputs it into the track array
  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/spotify/top-tracks");
      const result = await response.json();
      setTracks(result.items);
    }
    fetchData();
  }, []);
  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/spotify/top-artists");
      const result = await response.json();
      setArtists(result.items);
    }
    fetchData();
  }, []);
  //returns all of the data from the array
  //this is what sends the track data into TopTracks.tsx
  return (
    <div>
      <TopTracks tracks={tracks} />
      <TopArtists artists={artists} />;
    </div>
  );
}
