/** @type {import('next').NextConfig} */
const nextConfig = {
  // Толық статикалық экспорт: `npm run build` → out/ қалтасы.
  // Vercel бұл режимді өзі анықтайды, басқа хостингке де жүктеуге болады.
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
  reactStrictMode: false,
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
