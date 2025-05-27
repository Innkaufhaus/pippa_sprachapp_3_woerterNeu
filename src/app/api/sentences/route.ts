import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { logger } from '../../../utils/logger'

export async function GET() {
  try {
    const sentences = await prisma.sentence.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    logger.info(`Successfully fetched ${sentences.length} sentences`)
    return new NextResponse(JSON.stringify(sentences), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    logger.error('Failed to fetch sentences:', error)
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch sentences' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { keyword, sentence } = body

    logger.info('Creating new sentence:', { keyword, sentence })
    const newSentence = await prisma.sentence.create({
      data: {
        keyword,
        sentence
      }
    })
    logger.info('Successfully created sentence:', newSentence)

    return new NextResponse(JSON.stringify(newSentence), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    logger.error('Failed to create sentence:', error)
    return new NextResponse(JSON.stringify({ error: 'Failed to create sentence' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const { id } = body

    logger.info('Deleting sentence:', { id })
    await prisma.sentence.delete({
      where: {
        id: Number(id)
      }
    })
    logger.info('Successfully deleted sentence:', { id })

    return new NextResponse(JSON.stringify({ message: 'Sentence deleted successfully' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    logger.error('Failed to delete sentence:', error)
    return new NextResponse(JSON.stringify({ error: 'Failed to delete sentence' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}
