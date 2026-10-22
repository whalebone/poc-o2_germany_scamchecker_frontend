// The backend on the page's own origin: /api/v1/* → scam-check, with the token added here, so the
// page never holds one (a token in its JavaScript would be anyone's). The only server-side code in this repo.
// Netlify environment variables: SCAM_CHECK_URL (the front door) and SCAM_CHECK_TOKEN (an integration JWT, secret).

const PATHS = ['/v1/scam-check', '/v1/feedback'] // nothing else: the token must not open the rest of the API

export default async (req, context) => {
  const path = new URL(req.url).pathname.replace(/^\/api/, '')
  if (req.method !== 'POST' || !PATHS.includes(path)) return new Response('Not found', { status: 404 })
  const { SCAM_CHECK_URL, SCAM_CHECK_TOKEN } = process.env
  if (!SCAM_CHECK_URL || !SCAM_CHECK_TOKEN) return new Response('SCAM_CHECK_URL or SCAM_CHECK_TOKEN not set', { status: 503 })

  let res
  try {
    res = await fetch(SCAM_CHECK_URL + path, {
      method: 'POST',
      headers: {
        'Content-Type': req.headers.get('content-type') ?? 'application/json',
        Authorization: SCAM_CHECK_TOKEN, // raw, no "Bearer"
        ...(context.ip && { 'X-Forwarded-For': context.ip }), // the visitor, for the front door's per-IP limit
      },
      body: await req.text(),
      signal: AbortSignal.timeout(9000), // the backend answers within 5 s; Netlify stops a function at 10 s
    })
  } catch (error) {
    return new Response(`scam-check unreachable: ${error.name}`, { status: 502 })
  }
  // The answer only: the rotated token (Wb-Token) stays here.
  return new Response(await res.text(), { status: res.status, headers: { 'Content-Type': res.headers.get('content-type') ?? 'text/plain' } })
}

export const config = { path: '/api/*' }
