
console.log("Start Minimal");
try {
  await import('./src/logic/poker.js');
  console.log("Imported poker.js successfully");
} catch (e) {
  console.error("Import Failed:", e);
}
console.log("End Minimal");
