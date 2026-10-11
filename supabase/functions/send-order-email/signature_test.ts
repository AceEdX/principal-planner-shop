import { verifyPaymentSignature } from './signature.ts'

Deno.test('accepts a valid signature and rejects altered payment data', async () => {
  const secret = 'test-only-secret'
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const signed = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode('order_test|pay_test'))
  const signature = Array.from(new Uint8Array(signed)).map((byte) => byte.toString(16).padStart(2, '0')).join('')
  if (!await verifyPaymentSignature(secret, 'order_test', 'pay_test', signature)) throw new Error('Valid signature rejected')
  if (await verifyPaymentSignature(secret, 'order_test', 'pay_other', signature)) throw new Error('Altered payment accepted')
  if (await verifyPaymentSignature('wrong-secret', 'order_test', 'pay_test', signature)) throw new Error('Wrong secret accepted')
  if (await verifyPaymentSignature(secret, 'order_test', 'pay_test', 'invalid')) throw new Error('Malformed signature accepted')
})