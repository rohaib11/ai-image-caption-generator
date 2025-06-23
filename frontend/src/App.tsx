import { useState, useCallback } from "react";
import { FiUpload, FiImage, FiLoader, FiTrash2, FiCopy } from "react-icons/fi";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }

    setFile(selectedFile);
    setCaption("");
    setError("");
    setCopied(false);

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(selectedFile);
  }, []);

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError("");
    setCaption("");
    setCopied(false);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://127.0.0.1:8000/caption/", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();
      setCaption(data.caption || "No caption generated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate caption.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setPreview(null);
    setCaption("");
    setError("");
    setCopied(false);
  };

  const handleCopy = () => {
    if (caption) {
      navigator.clipboard.writeText(caption);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 sm:p-8">
          <h1 className="text-3xl font-extrabold text-center text-indigo-700 mb-2">
            🖼️ AI Image Caption Generator
          </h1>
          <p className="text-center text-gray-500 mb-6">
            Upload an image and let AI describe it for you.
          </p>

          {/* Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all mb-4
            ${file ? "border-indigo-300 bg-indigo-50" : "border-gray-300 hover:border-indigo-400"}`}
          >
            {preview ? (
              <div className="relative group">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-64 mx-auto rounded-xl object-contain shadow"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded-xl" />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-2 text-gray-500">
                <FiImage className="w-12 h-12 text-indigo-400" />
                <p>Click to upload an image</p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-center items-center gap-4">
            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className={`flex items-center px-5 py-3 rounded-full font-semibold transition-all
                ${!file || loading
                  ? "bg-gray-300 cursor-not-allowed text-gray-600"
                  : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md"}`}
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <FiUpload className="mr-2" />
                  Generate Caption
                </>
              )}
            </button>
            {file && (
              <button
                onClick={handleClear}
                className="text-sm text-gray-500 hover:text-red-600 flex items-center"
              >
                <FiTrash2 className="mr-1" />
                Clear
              </button>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-center text-sm font-medium">
              {error}
            </div>
          )}

          {/* Caption Result */}
          {caption && (
            <div className="mt-6 p-5 bg-indigo-50 rounded-lg">
              <h3 className="text-lg font-bold text-indigo-700 mb-2">Generated Caption:</h3>
              <p className="text-gray-800 italic">"{caption}"</p>
              <button
                onClick={handleCopy}
                className="mt-3 inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800"
              >
                <FiCopy className="mr-1" />
                {copied ? "Copied!" : "Copy to clipboard"}
              </button>
            </div>
          )}
        </div>
        <div className="bg-gray-100 px-6 py-4 text-center text-xs text-gray-500">
          Built with ❤️ using FastAPI, BLIP model, and React
        </div>
      </div>
    </div>
  );
}

export default App;
