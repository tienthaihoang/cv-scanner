"use client";

import { useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";

interface DropzoneUploadProps {
  onSubmit: (file: File | null) => void;
  loading?: boolean;
  file?: File | null;
  label?: string;
  removable?: boolean;
}

export default function DropzoneUpload({
  onSubmit,
  loading = false,
  file,
  label = "Upload file",
  removable = false,
}: DropzoneUploadProps) {
  const [preview, setPreview] = useState<string | null>(
    file ? file.name : null
  );
  const [error, setError] = useState<string | null>(null);

  const mimeAccept = {
    "application/pdf": [".pdf"],
    "application/msword": [".doc"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
      ".docx",
    ],
  };

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        const invalidFiles = fileRejections
          .map((fr) => fr.file.name)
          .join(", ");
        setError(
          `Invalid file format for: ${invalidFiles}. Only PDF/DOC/DOCX allowed.`
        );
        return;
      }
      if (acceptedFiles.length > 0) {
        const f = acceptedFiles[0];
        onSubmit(f);
        setPreview(f.name);
        setError(null);
      }
    },
    [onSubmit]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: mimeAccept,
  });

  const handleRemove = () => {
    onSubmit(null);
    setPreview(null);
    setError(null);
  };

  return (
    <div
      {...getRootProps()}
      className={`border-dashed border-2 p-4 rounded cursor-pointer ${
        isDragActive ? "border-blue-500" : "border-gray-300"
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium mb-1">{label}</p>
          {preview ? (
            <p className="text-gray-700">{preview}</p>
          ) : (
            <p className="text-gray-400">
              Drag & drop file here, or click to select
            </p>
          )}
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
        {removable && preview && (
          <button
            type="button"
            onClick={handleRemove}
            className="text-red-500 text-sm font-medium hover:underline"
          >
            Remove
          </button>
        )}
      </div>
      {loading && (
        <p className="text-xs text-gray-500 mt-2">Uploading / Processing...</p>
      )}
    </div>
  );
}
