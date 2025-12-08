/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import ApiKeyInput from "@/components/ApiKeyInput";
import DropzoneUpload from "@/components/DropzoneUpload";
import ResultsCard from "@/components/ResultsCard";
import ToastContainer from "@/components/ToastContainer";
import { toast } from "@/lib/useToast";
import { FileText } from "lucide-react";
import { useState } from "react";

export default function Page() {
  const [openAiKey, setOpenAiKey] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [jdFile, setJdFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  const onAnalyze = async () => {
    if (!cvFile) {
      toast.warning("Please attach a CV file.");
      return;
    }
    if (!jdFile) {
      toast.warning("Please attach a JD file.");
      return;
    }
    if (!openAiKey) {
      toast.warning("Please enter your OpenAI API key.");
      return;
    }

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
      toast.success(
        `CV analyzed successfully! Match score: ${data.match_score}%`
      );
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to analyze CV. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-6 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-gray-100">
      <ToastContainer />
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            CV Scanner
          </h1>
          <p className="text-gray-400 text-sm">
            Upload a CV & JD to analyze matching score using AI
          </p>
        </div>

        {/* API Key Section */}
        <ApiKeyInput value={openAiKey} onChange={setOpenAiKey} />

        {/* File Upload Section */}
        <section className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <DropzoneUpload
            onSubmit={setCvFile as any}
            loading={loading}
            file={cvFile}
            label="Upload CV"
            removable
            accentColor="blue"
            onUseSample={() => toast.info("Sample CV feature coming soon!")}
          />
          <DropzoneUpload
            onSubmit={setJdFile as any}
            loading={loading}
            file={jdFile}
            label="Upload JD"
            removable
            accentColor="purple"
            onUseSample={() => toast.info("Sample JD feature coming soon!")}
          />
        </section>

        {/* Analyze Button */}
        <button
          onClick={onAnalyze}
          disabled={loading}
          className="w-full h-14 mb-8 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl text-lg cursor-pointer flex items-center justify-center"
        >
          {loading ? "Analyzing..." : "Analyze CV & JD"}
        </button>

        {/* Results Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h2 className="font-semibold mb-3 text-lg text-gray-200">
              Analysis Result
            </h2>
            <ResultsCard result={result} />
          </div>

          <div>
            <h2 className="font-semibold mb-3 text-lg text-gray-200">
              ATS History
            </h2>
            <div className="bg-gray-800/50 rounded-lg shadow-sm p-4 border border-gray-700">
              {history.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-400">
                    No scans yet. Your past analysis will appear here.
                  </p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {history.map((item) => (
                    <li
                      key={item.id}
                      className="py-3 px-2 border-b border-gray-700 last:border-b-0 hover:bg-gray-700/30 rounded transition-colors"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex-1 text-xs text-gray-400 truncate pr-2">
                          {item.cvName}
                        </div>
                        <div
                          className={`font-bold text-sm ${
                            item.score >= 80
                              ? "text-green-400"
                              : item.score >= 60
                              ? "text-yellow-400"
                              : "text-red-400"
                          }`}
                        >
                          {item.score}%
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {item.jdName}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
