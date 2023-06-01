/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    viewAllFiles: "https://file-upload-to-gcs.vercel.app/get-all-files",
    fallBackImageUrl:
      "https://raw.githubusercontent.com/koehlersimon/fallback/master/Resources/Public/Images/placeholder.jpg",
    bucketImageUrl: "https://storage.cloud.google.com/shinonome-retail/"
  },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        port: "",
        pathname: "/**"
      }
    ]
  }
};

module.exports = nextConfig;
