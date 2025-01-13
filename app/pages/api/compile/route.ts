import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { writeFile } from 'fs/promises';
import path from 'path';
import { promisify } from 'util';
import fs from 'fs-extra';
import { headers } from 'next/headers';

const execAsync = promisify(exec);

// ฟังก์ชันตรวจสอบ API token
function validateApiToken(request: Request): boolean {
  const headersList = headers();
  const apiToken = headersList.get('x-api-secret');
  return apiToken === process.env.API_SECRET;
}

// ฟังก์ชันจำกัดขนาดโค้ด
function validateCodeSize(code: string): boolean {
  const MAX_CODE_SIZE = 10000; // จำกัดที่ 10KB
  return code.length <= MAX_CODE_SIZE;
}

// ฟังก์ชันตรวจสอบความปลอดภัยของโค้ด
function validateCode(code: string): boolean {
  const forbiddenPatterns = [
    'system(',
    'popen(',
    '<windows.h>',
    'remove(',
    'unlink(',
    'fork(',
    'exec',
    '__asm',
    'CreateProcess'
  ];
  
  return !forbiddenPatterns.some(pattern => code.includes(pattern));
}

export async function POST(request: Request) {
  try {
    // 1. ตรวจสอบ API token
    if (!validateApiToken(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. ตรวจสอบ Content-Type
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
    }

    // 3. รับและตรวจสอบโค้ด
    const { code } = await request.json();
    if (!code) {
      return NextResponse.json({ error: 'No code provided' }, { status: 400 });
    }

    // 4. ตรวจสอบขนาดโค้ด
    if (!validateCodeSize(code)) {
      return NextResponse.json({ error: 'Code size exceeds limit' }, { status: 400 });
    }

    // 5. ตรวจสอบความปลอดภัยของโค้ด
    if (!validateCode(code)) {
      return NextResponse.json({ error: 'Code contains forbidden patterns' }, { status: 400 });
    }

    // 6. สร้างและตรวจสอบ temporary directory
    const tempDir = path.join(process.cwd(), 'temp');
    await fs.ensureDir(tempDir);

    // 7. สร้างชื่อไฟล์ที่ unique
    const filename = `temp_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const filepath = path.join(tempDir, `${filename}.cpp`);
    const exePath = path.join(tempDir, `${filename}.exe`);

    try {
      // 8. เขียนโค้ดลงไฟล์
      await writeFile(filepath, code);

      // 9. กำหนด timeout สำหรับการ compile และ run
      const TIMEOUT = 10000; // 10 วินาที
      const { stdout, stderr } = await execAsync(
        `g++ "${filepath}" -o "${exePath}" && "${exePath}"`,
        { timeout: TIMEOUT }
      );

      // 10. ลบไฟล์ทันทีที่ใช้เสร็จ
      await Promise.all([
        fs.remove(filepath),
        fs.remove(exePath)
      ]);

      if (stderr) {
        return NextResponse.json({ output: stderr }, { status: 400 });
      }

      return NextResponse.json({ output: stdout });

    } catch (execError: any) {
      // 11. ลบไฟล์ในกรณีที่เกิด error
      await Promise.all([
        fs.remove(filepath).catch(() => {}),
        fs.remove(exePath).catch(() => {})
      ]);

      // 12. จัดการ error message ให้เหมาะสม
      let errorMessage = execError.message;
      if (execError.killed) {
        errorMessage = 'Execution timed out';
      }

      return NextResponse.json({
        output: errorMessage,
        stderr: execError.stderr,
        stdout: execError.stdout,
      }, { status: 400 });
    }

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({
      error: 'Failed to compile or execute code',
      details: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}