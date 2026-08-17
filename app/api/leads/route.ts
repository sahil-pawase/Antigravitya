import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { leadSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = leadSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validatedData.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, phone, education, currentStatus, interestedCourse, message, source } = validatedData.data;

    const lead = await prisma.lead.create({
      data: {
        name,
        email: email.toLowerCase(),
        phone,
        education,
        currentStatus,
        interestedCourse,
        message: message || "",
        source,
        status: "NEW",
      },
    });

    return NextResponse.json(
      {
        message: "Thank you! Your demo request has been received. Our academic advisor will contact you shortly.",
        leadId: lead.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Lead submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit demo request. Please try again or chat via WhatsApp." },
      { status: 500 }
    );
  }
}
