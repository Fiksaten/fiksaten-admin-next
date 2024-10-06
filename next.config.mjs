/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'dyvdbkrbxyvii.cloudfront.net',
            },
            {
                protocol: 'https',
                hostname: 'picsum.photos',
            },
        ],
    },
    i18n: {
        locales: ['fi', 'en', 'sv'], // Finnish, English, Swedish
        defaultLocale: 'fi', // Default to Finnish
    },
};

export default nextConfig;
