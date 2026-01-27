import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("files") as File;

  if (!file) {
    return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
  }

  // aqui você pode:
  // - mandar pro S3 / Cloudinary
  // - salvar no banco
  // - etc.

  return NextResponse.json({
    fileId: crypto.randomUUID(),
    filename: file.name,
    size: file.size,
    type: file.type,
  });
}
