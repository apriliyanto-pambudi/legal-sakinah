import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

type UploadTarget = {
  buffer: Buffer;
  contentType: string;
  key: string; // relative path home/uuid.jpg
};

function r2Configured(): boolean {
  return Boolean(
    process.env.R2_ACCOUNT_ID?.trim() &&
      process.env.R2_ACCESS_KEY_ID?.trim() &&
      process.env.R2_SECRET_ACCESS_KEY?.trim() &&
      process.env.R2_BUCKET?.trim() &&
      process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.trim()
  );
}

/** Prefix object di bucket — isolasi domain Legal Sakinah. */
function keyPrefix(): string {
  const raw = process.env.R2_KEY_PREFIX?.trim() || "legalsakinah";
  return raw.replace(/^\/+|\/+$/g, "");
}

function uploadsRoot(): string {
  const configured = process.env.UPLOADS_DIR?.trim();
  if (configured) return configured;
  return path.join(process.cwd(), "public", "uploads");
}

function r2Client(): S3Client {
  const accountId = process.env.R2_ACCOUNT_ID!.trim();
  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!.trim(),
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!.trim(),
    },
  });
}

async function saveToR2(target: UploadTarget): Promise<string> {
  const objectKey = `${keyPrefix()}/${target.key}`;
  await r2Client().send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET!.trim(),
      Key: objectKey,
      Body: target.buffer,
      ContentType: target.contentType,
      CacheControl: "public, max-age=31536000, immutable",
    })
  );

  const base = process.env.NEXT_PUBLIC_R2_PUBLIC_URL!.trim().replace(/\/+$/, "");
  return `${base}/${objectKey}`;
}

async function saveToDisk(target: UploadTarget): Promise<string> {
  const filePath = path.join(uploadsRoot(), target.key);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, target.buffer);
  return `/uploads/${target.key.replace(/\\/g, "/")}`;
}

async function saveImage(file: File, subdir: string): Promise<string> {
  if (!ALLOWED[file.type]) {
    throw new Error("Format tidak didukung. Gunakan JPEG, PNG, atau WebP.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Ukuran gambar maksimal 5 MB.");
  }

  const ext = ALLOWED[file.type];
  const key = `${subdir}/${randomUUID()}.${ext}`;
  const target: UploadTarget = {
    buffer: Buffer.from(await file.arrayBuffer()),
    contentType: file.type,
    key,
  };

  if (r2Configured()) {
    return saveToR2(target);
  }
  return saveToDisk(target);
}

/** Simpan foto tim, return URL publik (R2 atau /uploads/...). */
export async function saveTeamPhoto(file: File): Promise<string> {
  return saveImage(file, "team");
}

/** Simpan banner LP, return URL publik. */
export async function saveLpBanner(file: File): Promise<string> {
  return saveImage(file, "lp");
}

/** Simpan foto hero beranda, return URL publik. */
export async function saveHomePhoto(file: File): Promise<string> {
  return saveImage(file, "home");
}
