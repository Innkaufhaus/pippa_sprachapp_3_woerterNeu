import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'

export async function GET() {
  try {
    let settings = await prisma.settings.findFirst()
    
    if (!settings) {
      // Create default settings if none exist
      settings = await prisma.settings.create({
        data: {
          speechRate: 0.5,
          speechPitch: 1.2
        }
      })
    }
    
    return new NextResponse(JSON.stringify(settings), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch settings' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { speechRate, speechPitch } = body
    
    let settings = await prisma.settings.findFirst()

    if (settings) {
      settings = await prisma.settings.update({
        where: { id: settings.id },
        data: { 
          speechRate: Number(speechRate), 
          speechPitch: Number(speechPitch) 
        }
      })
    } else {
      settings = await prisma.settings.create({
        data: { 
          speechRate: Number(speechRate), 
          speechPitch: Number(speechPitch) 
        }
      })
    }

    return new NextResponse(JSON.stringify(settings), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: 'Failed to update settings' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}
