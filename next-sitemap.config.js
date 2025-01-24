/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://integral-surf-site.vercel.app/",
  generateRobotsTxt: true,
  exclude: ["/admin/*", "/_not-found"], // Excluir páginas privadas si es necesario
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      { userAgent: "Googlebot", disallow: "/private/" },
    ],
  },
};
