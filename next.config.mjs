/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      canvas: false,
    }

    config.resolve.alias = {
      ...config.resolve.alias,
      'konva': false,
    }

    if (isServer) {
      config.externals = [
        ...config.externals,
        'konva',
        'canvas',
      ]
    }

    return config
  },
};

export default nextConfig;
