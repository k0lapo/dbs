/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // Allows production builds to complete even with type errors
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: false, // let Next optimize images if possible
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_SUPABASE_URL
          ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
          : "your-project-id.supabase.co", // fallback for local dev
        pathname: "/public/**",
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com", // used as fallback for missing images
      },
    ],
  },
}

export default nextConfig
