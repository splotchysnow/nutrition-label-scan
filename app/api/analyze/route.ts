export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { writeFile, unlink } from 'fs/promises'
import path from 'path'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const image = formData.get('image') as File
  const buffer = Buffer.from(await image.arrayBuffer())
  
  const pythonPath = process.env.PYTHON_PATH || 'python3'
  const scriptPath = path.join(process.cwd(), 'Python/main.py')

  const tmpPath = path.join(process.cwd(), 'tmp_label.jpg')
  await writeFile(tmpPath, buffer)
  
  return new Promise((resolve) => {
    exec(
      `"${pythonPath}" "${scriptPath}" "${tmpPath}"`,
      async (error, stdout, stderr) => {
        try {
          await unlink(tmpPath)
        } catch {}
        
        if (error) {
          resolve(NextResponse.json({ error: stderr || error.message }, { status: 500 }))
          return
        }
        
        try {
          const result = JSON.parse(stdout.trim())
          resolve(NextResponse.json(result))
        } catch {
          resolve(NextResponse.json({ error: 'Parse failed', raw: stdout }))
        }
      }
    )
  })
}