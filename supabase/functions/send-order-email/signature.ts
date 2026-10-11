export async function verifyPaymentSignature(secret: string, orderId: string, paymentId: string, signature: string) {
  if (!/^[a-f0-9]{64}$/i.test(signature)) return false
  const bytes = new Uint8Array(signature.match(/.{2}/g)?.map((hex) => parseInt(hex, 16)) ?? [])
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']
  )
  return crypto.subtle.verify('HMAC', key, bytes, new TextEncoder().encode(`${orderId}|${paymentId}`))
}