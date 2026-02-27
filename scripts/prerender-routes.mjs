import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')
const distDir = path.join(projectRoot, 'dist')
const baseHtmlPath = path.join(distDir, 'index.html')

const SITE_URL = 'https://pandaterminal.com'
const OG_IMAGE = `${SITE_URL}/og-share-image.png`

const ROUTES = [
  {
    route: '/announcement',
    title: 'PANDA Terminal 2.0 Announcement | Built for Execution',
    description:
      'Read the official PANDA Terminal 2.0 announcement and roadmap: one wallet, every venue, decentralized-first execution, and early access details.',
    ogType: 'article',
    articleJsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Panda Terminal 2.0 - Built for Execution',
      description:
        'Read the official PANDA Terminal 2.0 announcement and roadmap: one wallet, every venue, decentralized-first execution, and early access details.',
      mainEntityOfPage: `${SITE_URL}/announcement`,
      author: {
        '@type': 'Organization',
        name: 'PANDA Terminal',
      },
      publisher: {
        '@type': 'Organization',
        name: 'PANDA Terminal',
        logo: {
          '@type': 'ImageObject',
          url: OG_IMAGE,
        },
      },
      image: OG_IMAGE,
    },
  },
  {
    route: '/termsofservice',
    title: 'Terms of Service | PANDA Terminal',
    description:
      'Read the PANDA Terminal Terms of Service covering platform usage, accounts, subscriptions, risk disclosures, and legal terms.',
    ogType: 'website',
  },
  {
    route: '/privacy-policy',
    title: 'Privacy Policy | PANDA Terminal',
    description:
      'Read the PANDA Terminal Privacy Policy, including data categories, processing purposes, retention, sharing, and your rights.',
    ogType: 'website',
  },
]

function setTitle(html, title) {
  return html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`)
}

function setMetaByName(html, name, content) {
  const pattern = new RegExp(`<meta\\s+name="${name}"\\s+content="[^"]*"\\s*\\/?>`, 'i')
  return html.replace(pattern, `<meta name="${name}" content="${content}" />`)
}

function setMetaByProperty(html, property, content) {
  const pattern = new RegExp(`<meta\\s+property="${property}"\\s+content="[^"]*"\\s*\\/?>`, 'i')
  return html.replace(pattern, `<meta property="${property}" content="${content}" />`)
}

function setCanonical(html, href) {
  return html.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i, `<link rel="canonical" href="${href}" />`)
}

function setOrInsertPageJsonLd(html, payload) {
  const pageScriptPattern = /<script type="application\/ld\+json" data-prerender-page="true">[\s\S]*?<\/script>/i
  const script = `<script type="application/ld+json" data-prerender-page="true">${JSON.stringify(payload)}</script>`

  if (pageScriptPattern.test(html)) {
    return html.replace(pageScriptPattern, script)
  }
  return html.replace('</head>', `    ${script}\n  </head>`)
}

function transformHtml(baseHtml, routeConfig) {
  const canonicalUrl = `${SITE_URL}${routeConfig.route}`
  let html = baseHtml

  html = setTitle(html, routeConfig.title)
  html = setCanonical(html, canonicalUrl)
  html = setMetaByName(html, 'description', routeConfig.description)
  html = setMetaByName(
    html,
    'twitter:description',
    routeConfig.description.length > 200 ? `${routeConfig.description.slice(0, 197)}...` : routeConfig.description,
  )
  html = setMetaByName(html, 'twitter:title', routeConfig.title)
  html = setMetaByName(html, 'twitter:url', canonicalUrl)

  html = setMetaByProperty(html, 'og:type', routeConfig.ogType)
  html = setMetaByProperty(html, 'og:title', routeConfig.title)
  html = setMetaByProperty(html, 'og:description', routeConfig.description)
  html = setMetaByProperty(html, 'og:url', canonicalUrl)
  html = setMetaByProperty(html, 'og:image', OG_IMAGE)

  if (routeConfig.articleJsonLd) {
    html = setOrInsertPageJsonLd(html, routeConfig.articleJsonLd)
  }

  return html
}

async function main() {
  const baseHtml = await readFile(baseHtmlPath, 'utf8')

  await Promise.all(
    ROUTES.map(async (routeConfig) => {
      const html = transformHtml(baseHtml, routeConfig)
      const outputDir = path.join(distDir, routeConfig.route.slice(1))
      await mkdir(outputDir, { recursive: true })
      await writeFile(path.join(outputDir, 'index.html'), html, 'utf8')
    }),
  )

  process.stdout.write(`Prerendered ${ROUTES.length} route(s)\n`)
}

await main()
