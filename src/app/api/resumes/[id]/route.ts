import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getCareerApplications } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!id) {
      return new NextResponse("Missing Record ID", { status: 400 });
    }

    const applications = await getCareerApplications();
    const app = applications.find(a => a.id === id);

    const resumesDir = path.join(process.cwd(), "data", "resumes");
    const tmpResumesDir = path.join("/tmp", "resumes");

    let foundPath: string | null = null;
    const rawFileName = app?.documents?.resumeName || `Resume-${id}.pdf`;
    const cleanFileName = rawFileName.replace(/[^a-zA-Z0-9._-]/g, "_");

    const searchDirs = [resumesDir, tmpResumesDir];
    for (const dir of searchDirs) {
      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        const match = files.find(f => f.startsWith(id));
        if (match) {
          foundPath = path.join(dir, match);
          break;
        }
      }
    }

    // 1. Serve from disk if file exists
    if (foundPath && fs.existsSync(foundPath)) {
      const fileBuffer = fs.readFileSync(foundPath);
      const ext = path.extname(foundPath).toLowerCase();
      let contentType = "application/pdf";
      if (ext === ".doc") contentType = "application/msword";
      if (ext === ".docx") contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Content-Disposition": `attachment; filename="${cleanFileName}"`,
          "Content-Length": fileBuffer.length.toString(),
        },
      });
    }

    // 2. Serve from Base64 Data URL if stored in DB
    if (app?.documents?.resumeDataUrl) {
      const base64Parts = app.documents.resumeDataUrl.split(",");
      if (base64Parts.length === 2) {
        const fileBuffer = Buffer.from(base64Parts[1], "base64");
        return new NextResponse(fileBuffer, {
          status: 200,
          headers: {
            "Content-Type": app.documents.resumeType || "application/pdf",
            "Content-Disposition": `attachment; filename="${cleanFileName}"`,
            "Content-Length": fileBuffer.length.toString(),
          },
        });
      }
    }

    // 3. Fallback for test records created before file storage was initialized
    const fallbackText = `Candidate Application Record: ${id}\nName: ${app?.personalInfo?.fullName || "Candidate"}\nEmail: ${app?.personalInfo?.email || "N/A"}\n\nNotice: This is a test application record submitted prior to file system storage initialization. All new applications save uploaded PDF files directly to disk for 1-click download.`;
    const fallbackBuffer = Buffer.from(fallbackText, "utf-8");

    return new NextResponse(fallbackBuffer, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": `attachment; filename="Candidate-${id}-Summary.txt"`,
      },
    });
  } catch (error) {
    console.error("[API/Resumes] Error serving resume:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
