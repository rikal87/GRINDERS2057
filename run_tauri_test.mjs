import { execSync } from "child_process";
import fs from "fs";
try {
  console.log("Running tauri info...");
  const out = execSync("npm run tauri info");
  fs.writeFileSync("tauri_info_mjs.txt", out);
  console.log("Success");
} catch (e) {
  fs.writeFileSync("tauri_info_mjs.txt", e.toString() + "\n" + (e.stdout ? e.stdout.toString() : ""));
  console.log("Failed");
}
