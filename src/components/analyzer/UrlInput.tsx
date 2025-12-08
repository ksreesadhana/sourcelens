interface UrlInputProps {
  value: string;
  onChange: (value: string) => void;
  error: string | null;
}

export default function UrlInput({ value, onChange, error }: UrlInputProps) {
  return (
    <div className="space-y-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste any public URL (https://example.com)"
        className={`w-full px-4 py-3 text-lg border-2 rounded-lg transition-colors ${
          error
            ? 'border-red-600 focus:outline-none focus:border-red-600'
            : 'border-gray-300 focus:outline-none focus:border-blue-600'
        }`}
      />
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
}
