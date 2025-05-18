/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Ativar o streaming na renderização para melhor experiência no carregamento
    serverActions: true,
  },
  // Configurações para SPA - evitar problemas na navegação do histórico
  reactStrictMode: false, // Desativado para evitar duplo carregamento
  swcMinify: true,
};

module.exports = nextConfig; 