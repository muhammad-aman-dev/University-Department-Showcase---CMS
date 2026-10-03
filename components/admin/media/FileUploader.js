"use client";

import { useRef, useState } from "react";
import {
  FileText,
  Loader2,
  Trash2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

export default function FileUploader({
  value = "",
  fileName = "",
  onChange,
  folder = "documents",
  label = "File",
  description,
}) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [selectedName, setSelectedName] =
    useState(fileName);

  async function handleUpload(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();

      formData.append("file", file);
      formData.append("folder", folder);

      const response = await fetch(
        "/api/admin/upload-file",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Upload failed"
        );
      }

      setSelectedName(result.data.originalName);

      onChange({
        url: result.data.url,
        fileName: result.data.originalName,
      });

      toast.success("File uploaded successfully");
    } catch (error) {
      console.error(error);

      toast.error(
        error.message || "Failed to upload file"
      );
    } finally {
      setUploading(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  function removeFile() {
    setSelectedName("");

    onChange({
      url: "",
      fileName: "",
    });
  }

  return (
    <div>
      <div className="mb-2">
        <p className="text-sm font-medium text-gray-700">
          {label}
        </p>

        {description && (
          <p className="mt-1 text-xs text-gray-500">
            {description}
          </p>
        )}
      </div>

      {value ? (
        <div className="flex items-center justify-between rounded-xl border bg-gray-50 p-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white">
              <FileText
                size={22}
                className="text-gray-500"
              />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-gray-800">
                {selectedName || fileName || "Uploaded file"}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                File uploaded successfully
              </p>
            </div>
          </div>

          <div className="ml-4 flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() =>
                inputRef.current?.click()
              }
              disabled={uploading}
              className="inline-flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm font-medium transition hover:bg-gray-50 disabled:opacity-50"
            >
              <Upload size={16} />
              Replace
            </button>

            <button
              type="button"
              onClick={removeFile}
              disabled={uploading}
              className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 disabled:opacity-50"
              title="Remove file"
            >
              <Trash2 size={17} />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() =>
            inputRef.current?.click()
          }
          disabled={uploading}
          className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed bg-gray-50 px-6 py-8 text-center transition hover:border-gray-400 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploading ? (
            <>
              <Loader2
                size={28}
                className="animate-spin text-gray-500"
              />

              <p className="mt-3 text-sm font-medium">
                Uploading file...
              </p>
            </>
          ) : (
            <>
              <FileText
                size={30}
                className="text-gray-400"
              />

              <p className="mt-3 text-sm font-medium text-gray-700">
                Upload {label}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX or TXT
                · Maximum 20MB
              </p>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
        onChange={handleUpload}
        className="hidden"
      />
    </div>
  );
}