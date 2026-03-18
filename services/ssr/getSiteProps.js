export function getSiteProps(context) {
  const protocol = context.req.headers['x-forwarded-proto'] || 'https'
  const rootHost = context.req.headers.host
  const site = context.req.headers['x-site'] || 'nspdm'
  console.log('protocol', protocol)
  console.log('rootHost', rootHost)
  console.log('site', site)
  const host = rootHost && rootHost.split('.').slice(-2).join('.')
  const url = `${protocol}://${host}${context.req.url}`

  return {
    url,
    host,
    site
  }
}