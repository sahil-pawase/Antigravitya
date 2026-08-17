const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const rootDir = path.resolve(__dirname, "..");
const parentDir = path.resolve(rootDir, "..");
const zipPath = path.join(parentDir, "career-transformer.zip");
const tempDir = path.join(parentDir, "career-transformer-pkg");

console.log("📦 Packaging Career Transformer project...");

if (fs.existsSync(tempDir)) {
  fs.rmSync(tempDir, { recursive: true, force: true });
}
if (fs.existsSync(zipPath)) {
  fs.unlinkSync(zipPath);
}

fs.mkdirSync(tempDir, { recursive: true });

// Copy all files excluding node_modules, .next, .git
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    const baseName = path.basename(src);
    if (baseName === "node_modules" || baseName === ".next" || baseName === ".git") {
      return;
    }
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

copyRecursiveSync(rootDir, tempDir);
console.log("✓ Copied clean source files to staging area");

// Zip using PowerShell Compress-Archive
try {
  execSync(`powershell -NoProfile -Command "Compress-Archive -Path '${tempDir}\\*' -DestinationPath '${zipPath}' -Force"`, {
    stdio: "inherit",
  });
  console.log(`✅ Successfully generated ZIP archive at:\n${zipPath}`);
} finally {
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}
