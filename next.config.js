/** @type {import('next').NextConfig} */
const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const remotePatterns = [{ protocol: "https", hostname: "res.cloudinary.com" }];

if (supabaseHostname) {
  remotePatterns.push({ protocol: "https", hostname: supabaseHostname });
}

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns,
  },
};

module.exports = nextConfig;
