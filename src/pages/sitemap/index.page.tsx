import api from '@/services/api'

const EXTERNAL_DATA_URL = 'https://aurosimobiliaria.com.br'

interface Posts {
  id: string
}
function generateSiteMap(posts: Posts[]) {
  const postsString = posts
    .map(
      ({ id }) =>
        `<url> <loc>${`${EXTERNAL_DATA_URL}/${id}`}</loc><lastmod>${new Date().toISOString()}</lastmod> </url>`,
    )
    .join('')
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
        <loc>${EXTERNAL_DATA_URL}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1</priority>
     </url>
     <url>
        <loc>${EXTERNAL_DATA_URL}/imoveis</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1</priority>
     </url>
     ${postsString}
   </urlset>
 `
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getServerSideProps({ res }: any) {
  // We make an API call to gather the URLs for our site
  const response = await api.get('/imovel', { params: { visible: true } })
  const imoveis = response.data.properties
  // We generate the XML sitemap with the posts data
  const sitemap = generateSiteMap(imoveis)

  res.setHeader('Content-Type', 'text/xml')
  // we send the XML to the browser
  res.write(sitemap)
  res.end()

  return {
    props: {},
  }
}

export default SiteMap
