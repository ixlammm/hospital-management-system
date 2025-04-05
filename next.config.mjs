/** @type {import('next').NextConfig} */
export const nextConfig = {
  redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/dashboard/overview',
        permanent: true,
      },
    ]
  },
  eslint: {
    ignoreDuringBuilds: true
  }
}