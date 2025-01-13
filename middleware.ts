// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// สร้างฟังก์ชันสำหรับตรวจสอบ token
function validateToken(token: string | null): boolean {
  const validToken = process.env.API_SECRET
  return token === validToken
}

// สร้างฟังก์ชันสำหรับตรวจสอบ referer
function validateReferer(referer: string | null): boolean {
  const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://yourwebsite.com' // เปลี่ยนเป็น domain จริงของคุณ
  ]
  
  if (!referer) return false
  return allowedOrigins.some(origin => referer.startsWith(origin))
}

export async function middleware(request: NextRequest) {
  // 1. ตรวจสอบว่าเป็น request ไปที่ /api/compile หรือไม่
  if (request.nextUrl.pathname === '/api/compile') {
    
    // 2. ตรวจสอบ method ว่าเป็น POST เท่านั้น
    if (request.method !== 'POST') {
      return new NextResponse(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // 3. ตรวจสอบ API token
    const token = request.headers.get('x-api-secret')
    if (!validateToken(token)) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid API token' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // 4. ตรวจสอบ referer
    const referer = request.headers.get('referer')
    if (!validateReferer(referer)) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid referer' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      )
    }
  }

  return NextResponse.next()
}

// กำหนด path ที่ต้องการให้ middleware ทำงาน
export const config = {
  matcher: '/api/compile'
}