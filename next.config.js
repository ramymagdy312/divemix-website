/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
    unoptimized: true
  },
  trailingSlash: true
}

module.exports = nextConfig