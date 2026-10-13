const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_EDGE = 2560;
const MAX_SIZE_MB = 20;

export async function preparePhoto(file: File): Promise<{ blob: Blob; contentType: string }> {
  let blob: Blob = file;
  let contentType = file.type;

  const heic =
    contentType === "image/heic" ||
    contentType === "image/heif" ||
    /\.heic$/i.test(file.name) ||
    /\.heif$/i.test(file.name);

  if (heic) {
    const heic2any = (await import("heic2any")).default;
    const converted = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.9 });
    blob = Array.isArray(converted) ? converted[0] : converted;
    contentType = "image/jpeg";
  }

  if (!ALLOWED.has(contentType)) {
    throw new Error("unsupported_content_type");
  }

  const imageCompression = (await import("browser-image-compression")).default;
  const compressed = await imageCompression(new File([blob], file.name, { type: contentType }), {
    maxSizeMB: MAX_SIZE_MB,
    maxWidthOrHeight: MAX_EDGE,
    useWebWorker: true,
    fileType: contentType as "image/jpeg" | "image/png" | "image/webp",
  });

  return { blob: compressed, contentType: compressed.type || contentType };
}

export function putPhoto(
  url: string,
  headers: Record<string, string>,
  blob: Blob,
  onProgress: (ratio: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    for (const [name, value] of Object.entries(headers)) xhr.setRequestHeader(name, value);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(event.loaded / event.total);
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error("upload"));
    };
    xhr.onerror = () => reject(new Error("upload"));
    xhr.send(blob);
  });
}

export const MAX_PARALLEL_UPLOADS = 3;
