/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone", // Necessary for deploying to Netlify
  trailingSlash: true,
};

export default nextConfig;
