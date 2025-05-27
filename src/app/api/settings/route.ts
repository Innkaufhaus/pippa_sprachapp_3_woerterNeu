import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/utils/logger'

export async function GET() {
  try {
    logger.info('Fetching settings')
    let settings = await prisma.settings.findFirst()
    
    if (!settings) {
      // Create default settings if none exist
      logger.info('No settings found, creating defaults')
      settings = await prisma.settings.create({
        data: {
          speechRate: 0.5,
          speechPitch: 1.2
        }
      })
    }
    
    logger.info('Settings retrieved successfully:', settings)
    return new NextResponse(JSON.stringify(settings), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    logger.error('Failed to fetch settings:', error)
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
    
    logger.info('Updating settings:', { speechRate, speechPitch })
    let settings = await prisma.settings.findFirst()

    if (settings) {
      settings = await prisma.settings.update({
        where: { id: settings.id },
        data: { 
          speechRate: Number(speechRate), 
          speechPitch: Number(speechPitch) 
        }
      })
      logger.info('Settings updated successfully:', settings)
    } else {
      logger.info('No settings found, creating new settings')
      settings = await prisma.settings.create({
        data: { 
          speechRate: Number(speechRate), 
          speechPitch: Number(speechPitch) 
        }
      })
      logger.info('Settings created successfully:', settings)
    }

    return new NextResponse(JSON.stringify(settings), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    logger.error('Failed to update settings:', error)
    return new NextResponse(JSON.stringify({ error: 'Failed to update settings' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}
