/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
  },
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
  },
  // Ensure proper routing for Vercel
  trailingSlash: false,
  // Enable static exports if needed
  output: 'standalone',
}

module.exports = nextConfig

