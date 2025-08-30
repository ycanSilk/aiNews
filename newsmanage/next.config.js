/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  env: {
    PORT: '8888'
  }
}

module.exports = nextConfig