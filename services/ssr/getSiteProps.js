export function getSiteProps(context) {
  const protocol = context.req.headers['x-forwarded-proto'] || 'http'
  const rootHost = context.req.headers.host
  const site = context.req.headers['x-site'] || 'nspdm'

  const host = rootHost && rootHost.split('.').slice(-2).join('.')
  const url = `${protocol}://${host}${context.req.url}`

  return {
    url,
    host,
    site
  }
}