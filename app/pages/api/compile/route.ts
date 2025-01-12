import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { writeFile } from 'fs/promises';
import path from 'path';
import { promisify } from 'util';
import fs from 'fs-extra';

const execAsync = promisify(exec);

export async function POST(request: Request) {
  try {
    const { code } = await request.json();
    if (!code) {
      throw new Error('No code provided.');
    }

    // Directory and file setup
    const tempDir = path.join(process.cwd(), 'temp');
    await fs.ensureDir(tempDir);

    const filename = `temp_${Date.now()}`;
    const filepath = path.join(tempDir, `${filename}.cpp`);
    const exePath = path.join(tempDir, `${filename}.exe`);

    // Write code to a file
    await writeFile(filepath, code);

    try {
      // Compile and execute
      const { stdout, stderr } = await execAsync(`g++ "${filepath}" -o "${exePath}" && "${exePath}"`);

      // Clean up files
      await fs.remove(filepath);
      await fs.remove(exePath);

      if (stderr) {
        return NextResponse.json({ output: stderr }, { status: 400 });
      }

      return NextResponse.json({ output: stdout });
    } catch (execError: any) {
      // Handle compilation or execution errors
      await fs.remove(filepath);
      await fs.remove(exePath);

      return NextResponse.json({
        output: execError.message,
        stderr: execError.stderr,
        stdout: execError.stdout,
      }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to compile or execute code',
      details: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}
