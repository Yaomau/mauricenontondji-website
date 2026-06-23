import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lastName, firstName, message } = body;

    if (!lastName?.trim() || !firstName?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis.' },
        { status: 400 }
      );
    }

    const contactMessage = await db.contactMessage.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        message: message.trim(),
      },
    });

    return NextResponse.json(contactMessage, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to send message';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}