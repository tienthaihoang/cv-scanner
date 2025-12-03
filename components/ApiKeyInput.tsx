import { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';

export default function ApiKeyInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [showTip, setShowTip] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowTip(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative mb-3" ref={containerRef}>
      <label className="block text-sm font-medium mb-1 flex items-center gap-1">
        OpenAI API Key
        <Info
          className="w-5 h-5 text-gray-400 cursor-pointer"
          onClick={() => setShowTip(prev => !prev)}
        />
      </label>
      <input
        type="password"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="sk-... (user-provided)"
        className="w-full p-2 border rounded bg-gray-700 text-gray-100 border-gray-600"
      />
      {showTip && (
        <div className="absolute top-5 left-0 mt-1 p-2 text-xs text-gray-200 bg-gray-800 rounded z-10 w-64 border border-gray-600">
          You can get your OpenAI API key from <a href="https://platform.openai.com/account/api-keys" target="_blank" className="underline text-blue-400">OpenAI Account</a>.
        </div>
      )}
    </div>
  );
}
