require("dotenv").config({ path: ".env.local" });
require("dotenv").config();

const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const uri = process.env.MONGODB_URI;
const backupDir = path.resolve(process.env.BACKUP_DIR || "backups");
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const out = path.join(backupDir, stamp);

if (!uri) {
  console.error("MONGODB_URI is required for backups.");
  process.exit(1);
}

fs.mkdirSync(out, { recursive: true });

const child = spawn("mongodump", ["--uri", uri, "--out", out], {
  stdio: "inherit",
  shell: true
});

child.on("exit", (code) => {
  if (code === 0) {
    console.info(`Backup complete: ${out}`);
    return;
  }

  console.error("Backup failed. Ensure MongoDB Database Tools are installed and mongodump is on PATH.");
  process.exit(code || 1);
});
