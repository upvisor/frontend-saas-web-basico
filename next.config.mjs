/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'iframe.mediadelivery.net',
        port: '',
        pathname: '/embed/**'
      }, {
        protocol: 'https',
        hostname: 'img-web-carmen-orellana.b-cdn.net',
        port: '',
        pathname: '/**'
      }, {
        protocol: 'https',
        hostname: 'img-saas-upvisor.b-cdn.net',
        port: '',
        pathname: '/**'
      }
    ]
  }
};

export default nextConfig;
