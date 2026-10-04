/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  images: {
    qualities: [70, 75, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

export default nextConfig;