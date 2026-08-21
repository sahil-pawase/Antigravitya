import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { registerSchema } from "@/lib/validations";
import { hashPassword, setAuthCookie } from "@/lib/auth";
import { normalizeDepartment } from "@/lib/departments";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = registerSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validatedData.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const {
      fullName,
      email,
      phone,
      password,
      department,
      education,
      college,
      gradYear,
      experienceLevel,
      city,
      careerGoal,
    } = validatedData.data;

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email address already exists. Please log in." },
        { status: 409 }
      );
    }

    const deptInfo = normalizeDepartment(department);
    const passwordHash = await hashPassword(password);

    // Create user and profile in transaction
    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        role: "STUDENT",
        status: "ACTIVE",
        profile: {
          create: {
            fullName,
            phone,
            department: deptInfo.departmentName,
            departmentId: deptInfo.departmentId,
            education,
            college,
            gradYear,
            experience: experienceLevel,
            city,
            careerGoal,
          },
        },
      },
      include: { profile: true },
    });

    // Auto-enroll student into flagship course in trial/preview mode
    const defaultCourse = await prisma.course.findFirst({
      where: { isPublished: true },
    });

    if (defaultCourse) {
      await prisma.enrollment.create({
        data: {
          userId: newUser.id,
          courseId: defaultCourse.id,
          status: "ACTIVE",
        },
      });
    }

    // Set HTTP-only auth session cookie
    const sessionPayload = {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      fullName: newUser.profile?.fullName || fullName,
      avatarUrl: newUser.profile?.avatarUrl,
      department: newUser.profile?.department,
      departmentId: newUser.profile?.departmentId,
    };

    await setAuthCookie(sessionPayload);

    return NextResponse.json(
      {
        message: "Registration successful",
        user: sessionPayload,
        redirectTo: "/dashboard",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during registration. Please try again." },
      { status: 500 }
    );
  }
}
