/** @type {import('next').NextConfig} */
const nextConfig = {
  /* Enable transpilation for the Geist font package to avoid build errors */
  transpilePackages: ["geist"],
};

module.exports = nextConfig; 