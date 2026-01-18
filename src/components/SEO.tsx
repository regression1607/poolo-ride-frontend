import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: string
}

const defaultSEO = {
  title: 'Poolo - Share Rides, Save Money | Carpooling in Delhi NCR',
  description: 'India\'s smart carpooling platform. Find and share rides in Delhi, Noida, Gurgaon, Faridabad. Save up to 70% on daily commute costs.',
  keywords: 'carpooling, ride sharing, Delhi carpool, Noida carpool, Gurgaon carpool',
  image: 'https://poolo.in/og-image.png',
  url: 'https://poolo.in',
  type: 'website'
}

export default function SEO({
  title,
  description = defaultSEO.description,
  keywords = defaultSEO.keywords,
  image = defaultSEO.image,
  url = defaultSEO.url,
  type = defaultSEO.type
}: SEOProps) {
  const fullTitle = title ? `${title} | Poolo` : defaultSEO.title

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      
      {/* Twitter */}
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  )
}
