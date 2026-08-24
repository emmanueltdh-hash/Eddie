import { copyFile, mkdir } from "node:fs/promises";

await mkdir("app", { recursive: true });
await mkdir("public/videos", { recursive: true });

for (const file of ["page.tsx", "layout.tsx", "globals.css"]) {
  await copyFile(file, `app/${file}`);
}

for (let index = 1; index <= 5; index += 1) {
  await copyFile(`eddie-${index}.mp4`, `public/videos/eddie-${index}.mp4`);
}

console.log("Prepared Eddie's birthday site for Next.js.");
