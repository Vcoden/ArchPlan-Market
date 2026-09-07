import sharp from "sharp";
import { brand } from "@/lib/brand";

export async function watermarkPreview(buffer: Buffer) {
  const image = sharp(buffer).rotate();
  const metadata = await image.metadata();
  const width = metadata.width ?? 1600;
  const height = metadata.height ?? 900;
  const fontSize = Math.max(22, Math.round(width / 28));

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <style>
        .mark { fill: rgba(255,255,255,0.42); font-family: Georgia, serif; font-size: ${fontSize}px; letter-spacing: 0.18em; }
      </style>
      <text x="50%" y="50%" text-anchor="middle" class="mark">${brand.name.toUpperCase()}  ·  PREVIEW</text>
    </svg>
  `;

  return image
    .composite([{ input: Buffer.from(svg), gravity: "center" }])
    .webp({ quality: 78 })
    .toBuffer();
}
