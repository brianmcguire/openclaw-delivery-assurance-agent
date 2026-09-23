import { readFileSync } from "node:fs";
const [action, path] = process.argv.slice(2);
if (!["PROJECT", "CORRECT", "DECIDE"].includes(action) || !path)
  throw Error(
    "Usage: node scripts/envelope.mjs PROJECT|CORRECT|DECIDE file.json",
  );
console.log(
  `DELIVERY ${action}\n${JSON.stringify(JSON.parse(readFileSync(path, "utf8")), null, 2)}`,
);
