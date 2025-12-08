import { Settings, ChevronUp, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function ApiKeyInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowTip(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section className="mb-8 p-4 rounded-lg shadow-sm bg-gray-800/50 border border-gray-700">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-300">
            API Configuration
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div
          className="mt-3 pt-3 border-t border-gray-700 relative"
          ref={containerRef}
        >
          <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
            OpenAI API Key
            <button
              type="button"
              onClick={() => setShowTip((prev) => !prev)}
              className="focus:outline-none"
            >
              <svg
                className="w-4 h-4 text-gray-400 hover:text-gray-300 cursor-pointer transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 16v-4m0-4h.01"
                />
              </svg>
            </button>
          </label>
          <input
            type="password"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="sk-... (user-provided)"
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {showTip && (
            <div className="absolute top-full left-0 mt-2 p-3 text-xs text-gray-200 bg-gray-900 rounded-lg z-10 w-72 border border-gray-600 shadow-xl">
              You can get your OpenAI API key from{" "}
              <a
                href="https://platform.openai.com/account/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-400 hover:text-blue-300"
              >
                OpenAI Account
              </a>
              .
            </div>
          )}
        </div>
      )}
    </section>
  );
}
