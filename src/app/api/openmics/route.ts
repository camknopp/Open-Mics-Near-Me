import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/openmics
export async function GET() {
  try {
    const openMics = await prisma.openMic.findMany({
      include: {
        venue: true, // Include the related Venue model
      },
    });
    return NextResponse.json(openMics, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch open mics:", error);
    return NextResponse.json(
      { message: "Failed to fetch open mics." },
      { status: 500 }
    );
  }
}

// POST /api/openmics
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      // Open Mic fields
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
      creatorId,

      // Venue fields
      venueId,
      venueName,
      venueAddress,
      venueWebsite,
      venueFacebook,
      venueInstagram,
      latitude,
      longitude,
    } = body;

    let newVenueId: string;

    if (venueId) {
      // Scenario 1: Link to an existing venue
      newVenueId = venueId;
    } else {
      // Scenario 2: Create a new venue
      if (!venueName || !venueAddress || !latitude || !longitude) {
        return NextResponse.json(
          { message: "Venue details are required to create a new venue." },
          { status: 400 }
        );
      }

      const newVenue = await prisma.venue.create({
        data: {
          name: venueName,
          address: venueAddress,
          latitude,
          longitude,
          website: venueWebsite,
          facebook: venueFacebook,
          instagram: venueInstagram,
        },
      });
      newVenueId = newVenue.id;
    }

    // Create the new OpenMic record with separate start/end times
    const newOpenMic = await prisma.openMic.create({
      data: {
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
        venueId: newVenueId,
        creatorId,
      },
    });

    return NextResponse.json(newOpenMic, { status: 201 });
  } catch (error) {
    console.error("Failed to create new open mic:", error);
    return NextResponse.json(
      { message: "Failed to create new open mic." },
      { status: 500 }
    );
  }
}