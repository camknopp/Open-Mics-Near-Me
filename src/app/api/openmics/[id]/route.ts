import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PATCH /api/openmics/[id]
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const body = await req.json();
    const {
      title,
      dayOfWeek,
      startTime,
      endTime,
      hostName,
      hostWebsite,
      description,
      genre,
      equipment,
      signupMethod,
      rules,
    } = body;
    
    const updatedOpenMic = await prisma.openMic.update({
      where: { id },
      data: {
        title,
        dayOfWeek,
        startTime, // Update this field
        endTime,   // Update this field
        hostName,
        hostWebsite,
        description,
        genre,
        equipment,
        signupMethod,
        rules,
      },
    });

    return NextResponse.json(updatedOpenMic, { status: 200 });
  } catch (error) {
    console.error(`Failed to update open mic with ID ${id}:`, error);
    return NextResponse.json(
      { message: `Failed to update open mic with ID ${id}.` },
      { status: 500 }
    );
  }
}