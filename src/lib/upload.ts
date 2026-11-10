import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

async function saveImage(file: File, subdir: string): Promise<string> {
  if (!ALLOWED[file.type]) {
    throw new Error("Format tidak didukung. Gunakan JPEG, PNG, atau WebP.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Ukuran gambar maksimal 5 MB.");
  }

  const ext = ALLOWED[file.type];
  const fileName = `${randomUUID()}.${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads", subdir);

  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(
    path.join(dir, fileName),
    Buffer.from(await file.arrayBuffer())
  );

  return `/uploads/${subdir}/${fileName}`;
}

/** Simpan foto tim ke public/uploads/team/, return path publik. */
export async function saveTeamPhoto(file: File): Promise<string> {
  return saveImage(file, "team");
}

/** Simpan banner LP ke public/uploads/lp/, return path publik. */
export async function saveLpBanner(file: File): Promise<string> {
  return saveImage(file, "lp");
}

/** Simpan foto hero beranda ke public/uploads/home/, return path publik. */
export async function saveHomePhoto(file: File): Promise<string> {
  return saveImage(file, "home");
}
