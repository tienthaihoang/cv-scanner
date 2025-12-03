/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const runtime = "nodejs";

import { buildPrompt } from "@/lib/prompt";
import mammoth from "mammoth";
import { NextResponse } from "next/server";

async function validateKey(userKey: string) {
  try {
    const res = await fetch("https://api.openai.com/v1/models", {
      headers: { Authorization: `Bearer ${userKey}` },
    });
    return res.ok;
  } catch (e) {
    return false;
  }
}

async function parseFile(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  if (file.name.endsWith(".pdf")) {
    const pdfParse = (await import("pdf-parse/lib/pdf-parse.js")).default;
    const data = await pdfParse(buffer);
    return data.text;
  } else if (file.name.endsWith(".docx")) {
    const { value } = await mammoth.extractRawText({ buffer });
    return value;
  } else if (file.name.endsWith(".doc")) {
    return buffer.toString("utf-8");
  }
  throw new Error("Unsupported file type");
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const cv = form.get("cv") as File | null;
    const jd = form.get("jd") as File | null;
    const openai_key = String(form.get("openai_key") || "");

    if (!cv)
      return NextResponse.json({ message: "No CV provided" }, { status: 400 });
    if (!jd)
      return NextResponse.json({ message: "No JD provided" }, { status: 400 });
    if (!openai_key)
      return NextResponse.json(
        { message: "No API key provided" },
        { status: 400 }
      );

    const isValid = await validateKey(openai_key);
    if (!isValid)
      return NextResponse.json({ message: "Invalid API key" }, { status: 401 });

    const cvText = await parseFile(cv);
    const jdText = await parseFile(jd);

    const prompt = buildPrompt(cvText, jdText);

    const resChat = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openai_key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 1200,
        temperature: 0.1,
      }),
    });

    if (!resChat.ok) {
      const errData = await resChat.json().catch(() => null);
      let message = `OpenAI API error (status ${resChat.status})`;
      if (errData?.error?.code === "insufficient_quota") {
        message =
          "You have exceeded your OpenAI quota. Please check your billing or plan.";
      } else if (resChat.status === 429) {
        message = "Rate limit exceeded. Please try again later.";
      } else if (errData?.error?.message) {
        message = errData.error.message;
      }
      return NextResponse.json({ message }, { status: resChat.status });
    }

    const data = await resChat.json();
    const raw = data.choices?.[0]?.message?.content;

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      parsed = { summary: raw, match_score: 0 };
    }

    parsed.match_score = Math.max(
      0,
      Math.min(100, Number(parsed.match_score) || 0)
    );

    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { message: err?.message || "Server error" },
      { status: 500 }
    );
  }
}
