import { prisma } from "../lib/db";
import bcrypt from "bcryptjs";

async function addAdmin() {
  const email = "pawasesahil2004@gmail.com";
  const password = "Sahil@2004";
  const passwordHash = await bcrypt.hash(password, 10);

  const existingUser = await prisma.user.findUnique({
    where: { email },
    include: { profile: true },
  });

  if (existingUser) {
    await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        passwordHash,
        role: "ADMIN",
        status: "ACTIVE",
        profile: {
          upsert: {
            create: {
              fullName: "Sahil Pawase",
              phone: "+91 96999 82137",
              department: "Computer Engineering",
              departmentId: "COMP_ENG",
              education: "B.E. Computer Engineering",
              city: "Pune",
              careerGoal: "Platform Super Admin & Data Analytics Lead",
              bio: "Super Admin & Creator of Career Transformer Platform.",
            },
            update: {
              fullName: "Sahil Pawase",
              department: "Computer Engineering",
              departmentId: "COMP_ENG",
            },
          },
        },
      },
    });
    console.log(`✅ Admin updated successfully: ${email}`);
  } else {
    await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: "ADMIN",
        status: "ACTIVE",
        profile: {
          create: {
            fullName: "Sahil Pawase",
            phone: "+91 96999 82137",
            department: "Computer Engineering",
            departmentId: "COMP_ENG",
            education: "B.E. Computer Engineering",
            city: "Pune",
            careerGoal: "Platform Super Admin & Data Analytics Lead",
            bio: "Super Admin & Creator of Career Transformer Platform.",
          },
        },
      },
    });
    console.log(`✅ Admin created successfully: ${email}`);
  }
}

addAdmin()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
