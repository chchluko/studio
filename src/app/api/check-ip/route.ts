import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

/**
 * Endpoint para verificar qué IP se está detectando
 * Útil para debugging y pruebas
 */
export async function GET(request: NextRequest) {
  const headersList = await headers();
  
  // Recopilar todos los headers relacionados con IP
  const ipHeaders = {
    'x-forwarded-for': headersList.get('x-forwarded-for'),
    'x-real-ip': headersList.get('x-real-ip'),
    'cf-connecting-ip': headersList.get('cf-connecting-ip'),
    'x-client-ip': headersList.get('x-client-ip'),
    'forwarded': headersList.get('forwarded'),
  };
  
  // Determinar la IP detectada (misma lógica que getClientIp)
  let detectedIp = '127.0.0.1';
  
  if (ipHeaders['cf-connecting-ip'] && ipHeaders['cf-connecting-ip'] !== '127.0.0.1') {
    detectedIp = ipHeaders['cf-connecting-ip'];
  } else if (ipHeaders['x-forwarded-for']) {
    detectedIp = ipHeaders['x-forwarded-for'].split(',')[0].trim();
  } else if (ipHeaders['x-real-ip'] && ipHeaders['x-real-ip'] !== '127.0.0.1') {
    detectedIp = ipHeaders['x-real-ip'];
  } else if (ipHeaders['x-client-ip'] && ipHeaders['x-client-ip'] !== '127.0.0.1') {
    detectedIp = ipHeaders['x-client-ip'];
  }
  
  return NextResponse.json({
    detectedIp,
    allHeaders: ipHeaders,
    info: {
      message: 'En desarrollo local verás 127.0.0.1',
      productionNote: 'En producción (detrás de proxy/load balancer), verás la IP real del cliente',
      testInstructions: [
        '1. En producción con Nginx/Apache: configurar proxy_set_header X-Real-IP o X-Forwarded-For',
        '2. Con Cloudflare: automáticamente envía cf-connecting-ip',
        '3. Con Vercel/Firebase: automáticamente envían x-forwarded-for',
      ]
    }
  }, {
    headers: {
      'Content-Type': 'application/json',
    }
  });
}
