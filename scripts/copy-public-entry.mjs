import { copyFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const distDir = resolve("dist");
const publicDir = resolve(distDir, "public");

await mkdir(publicDir, { recursive: true });
await copyFile(resolve(distDir, "index.html"), resolve(publicDir, "index.html"));
