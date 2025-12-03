/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import ApiKeyInput from "@/components/ApiKeyInput";
import DropzoneUpload from "@/components/DropzoneUpload";
import ResultsCard from "@/components/ResultsCard";
import { useState } from "react";

export default function Page() {
  const [openAiKey, setOpenAiKey] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [jdFile, setJdFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  const onAnalyze = async () => {
    if (!cvFile) return alert("Please attach a CV file.");
    if (!jdFile) return alert("Please attach a JD file.");
    if (!openAiKey) return alert("Please enter your OpenAI API key.");

    setLoading(true);
    const form = new FormData();
    form.append("cv", cvFile);
    form.append("jd", jdFile);
    form.append("openai_key", openAiKey);

    try {
      const res = await fetch("/api/scan", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw data;
      setResult(data);
      setHistory((prev) => [
        {
          id: Date.now(),
          cvName: cvFile.name,
          jdName: jdFile.name,
          score: data.match_score,
        },
        ...prev,
      ]);
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-6 bg-gray-900 text-gray-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">
          CV Scanner — Single Scan
        </h1>

        <ApiKeyInput value={openAiKey} onChange={setOpenAiKey} />

        <section className="mb-4 p-4 rounded shadow grid grid-cols-1 md:grid-cols-2 gap-4">
          <DropzoneUpload
            onSubmit={setCvFile as any}
            loading={loading}
            file={cvFile}
            label="Upload CV"
            removable
          />
          <DropzoneUpload
            onSubmit={setJdFile as any}
            loading={loading}
            file={jdFile}
            label="Upload JD"
            removable
          />
        </section>

        <button
          onClick={onAnalyze}
          disabled={loading}
          className="cursor-pointer px-6 w-full h-12 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {loading ? "Analyzing..." : "Analyze CV & JD"}
        </button>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div>
            <h2 className="font-semibold mb-2">Result</h2>
            <ResultsCard result={result} />
          </div>
          <div>
            <h2 className="font-semibold mb-2">ATS History</h2>
            <ul className="bg-white rounded shadow p-3">
              {history.length === 0 && (
                <li className="text-sm text-gray-500">No scans yet</li>
              )}
              {history.map((item) => (
                <li
                  key={item.id}
                  className="py-2 border-b last:border-b-0 flex justify-between text-gray-500"
                >
                  <div>
                    {item.cvName} / {item.jdName}
                  </div>
                  <div className="font-semibold">{item.score}%</div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
