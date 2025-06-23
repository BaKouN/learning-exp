import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: { NEXT_PUBLIC_WS_URL : process.env.NEXT_PUBLIC_WS_URL || "https://mon-ws-server-b00da40a55c9.herokuapp.com" },   
};

export default nextConfig;
