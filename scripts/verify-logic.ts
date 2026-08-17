import { registerSchema, leadSchema, projectSubmissionSchema } from "../lib/validations";
import { verifyRazorpaySignature } from "../lib/razorpay";
import bcrypt from "bcryptjs";
import crypto from "crypto";

async function runTests() {
  console.log("🧪 Running platform logic verification tests...\n");
  let passed = 0;
  let total = 0;

  function assert(condition: boolean, testName: string) {
    total++;
    if (condition) {
      console.log(`  ✓ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
    }
  }

  // 1. Test Registration Validation
  console.log("1. Registration Schema Tests:");
  const validReg = registerSchema.safeParse({
    fullName: "Aarav Patel",
    email: "aarav@gmail.com",
    phone: "9876543210",
    password: "Password123!",
    education: "B.Tech",
    experienceLevel: "Fresher",
    city: "Bengaluru",
    careerGoal: "Become a Data Analyst at a product company",
  });
  assert(validReg.success, "Valid student registration passes schema");

  const invalidReg = registerSchema.safeParse({
    fullName: "A",
    email: "invalid-email",
    phone: "123",
    password: "pass",
    education: "",
    experienceLevel: "",
    city: "",
    careerGoal: "",
  });
  assert(!invalidReg.success, "Invalid registration input is correctly rejected");

  // 2. Test Lead Capture Validation
  console.log("\n2. Lead Capture Schema Tests:");
  const validLead = leadSchema.safeParse({
    name: "Karan S",
    email: "karan@example.com",
    phone: "9876543210",
    education: "B.Com",
    currentStatus: "Student",
    interestedCourse: "Data Analytics Career Program",
    source: "WEBSITE_HERO",
  });
  assert(validLead.success, "Valid lead submission passes schema");

  const invalidLead = leadSchema.safeParse({
    name: "K",
    email: "notanemail",
    phone: "123",
    education: "",
    currentStatus: "",
  });
  assert(!invalidLead.success, "Invalid lead input is correctly rejected");

  // 3. Test Password Hashing & Verification
  console.log("\n3. Password Hashing Security Tests:");
  const plain = "StudentPassword123!";
  const hash = await bcrypt.hash(plain, 10);
  const isMatch = await bcrypt.compare(plain, hash);
  const isMismatch = await bcrypt.compare("WrongPassword!", hash);
  assert(isMatch, "Correct password matches bcrypt hash");
  assert(!isMismatch, "Incorrect password is rejected by bcrypt");

  // 4. Test Razorpay HMAC-SHA256 Signature Verification
  console.log("\n4. Payment Signature Verification Tests:");
  const orderId = "order_12345678";
  const paymentId = "pay_98765432";
  const secret = process.env.RAZORPAY_KEY_SECRET || "rzp_test_placeholder_secret";
  const correctSig = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  const isValidSig = verifyRazorpaySignature({
    orderId,
    paymentId,
    signature: correctSig,
  });
  assert(isValidSig, "Valid HMAC-SHA256 signature is verified");

  const isInvalidSig = verifyRazorpaySignature({
    orderId,
    paymentId,
    signature: "tampered_signature_payload",
  });
  assert(!isInvalidSig, "Tampered signature is strictly rejected");

  // Mock dev mode signature check
  const isMockSig = verifyRazorpaySignature({
    orderId: "order_mock_1234",
    paymentId: "pay_mock_5678",
    signature: "mock_signature_valid",
  });
  assert(isMockSig, "Development mock mode signature evaluates safely in test environment");

  // Summary
  console.log(`\n========================================`);
  console.log(`📊 Test Results: ${passed}/${total} assertions passed`);
  console.log(`========================================\n`);

  if (passed !== total) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test execution error:", err);
  process.exit(1);
});
