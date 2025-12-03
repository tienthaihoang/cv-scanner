/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

export default function ResultsCard({
  result,
  darkMode = false,
}: {
  result: any;
  darkMode?: boolean;
}) {
  if (!result)
    return (
      <div
        className={`p-4 rounded shadow text-sm ${
          darkMode ? "bg-gray-800 text-gray-400" : "bg-white text-gray-500"
        }`}
      >
        No result yet
      </div>
    );

  return (
    <div
      className={`p-4 rounded shadow ${
        darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-700"
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Match: {result.match_score}%</h3>
        <div className="text-sm text-gray-400">Confidence</div>
      </div>
      <p className="mb-3 text-sm">{result.summary}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <h4 className="font-semibold">Strengths</h4>
          <ul className="list-disc ml-5 text-sm">
            {result.strengths?.map((s: string, i: number) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Weak Points</h4>
          <ul className="list-disc ml-5 text-sm">
            {result.weak_points?.map((w: string, i: number) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-4">
        <h4 className="font-semibold">Recommendations</h4>
        <ol className="list-decimal ml-5 text-sm">
          {result.recommendations?.map((r: string, i: number) => (
            <li key={i}>{r}</li>
          ))}
        </ol>
      </div>
      <div className="mt-4 text-xs text-gray-400">
        Raw highlights: {result.highlighted_keywords?.join(", ")}
      </div>
    </div>
  );
}
