import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'

export async function GET() {
  try {
    const sentences = await prisma.sentence.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return new NextResponse(JSON.stringify(sentences), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
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

    const newSentence = await prisma.sentence.create({
      data: {
        keyword,
        sentence
      }
    })

    return new NextResponse(JSON.stringify(newSentence), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
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

    await prisma.sentence.delete({
      where: {
        id: Number(id)
      }
    })

    return new NextResponse(JSON.stringify({ message: 'Sentence deleted successfully' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: 'Failed to delete sentence' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}
