import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const sentences = await prisma.sentence.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(sentences)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch sentences' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { keyword, sentence } = await request.json()
    const newSentence = await prisma.sentence.create({
      data: {
        keyword,
        sentence
      }
    })
    return NextResponse.json(newSentence)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create sentence' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    await prisma.sentence.delete({
      where: {
        id: Number(id)
      }
    })
    return NextResponse.json({ message: 'Sentence deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete sentence' }, { status: 500 })
  }
}
