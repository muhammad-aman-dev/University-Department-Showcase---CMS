"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

export default function ImageUploader({
  value = "",
  onChange,
  folder = "homepage",
  label = "Image",
  description,
  aspect = "aspect-video",
}) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  function handleUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admin/upload", true);

    // Track upload progress
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded * 100) / event.total);
        setProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      setUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }

      try {
        const result = JSON.parse(xhr.responseText);

        if (xhr.status >= 200 && xhr.status < 300 && result.success) {
          onChange(result.data.url);
          toast.success("Image uploaded successfully");
        } else {
          throw new Error(result.message || "Upload failed");
        }
      } catch (error) {
        console.error(error);
        toast.error(error.message || "Failed to upload image");
      }
    };

    xhr.onerror = () => {
      setUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      toast.error("Failed to upload image. Network error.");
    };

    xhr.send(formData);
  }

  function removeImage() {
    onChange("");
  }

  return (
    <div>
      <div className="mb-2">
        <p className="text-sm font-medium text-gray-700">{label}</p>

        {description && (
          <p className="mt-1 text-xs text-gray-500">{description}</p>
        )}
      </div>

      {value ? (
        <div className="overflow-hidden rounded-xl border bg-gray-50">
          <div className={`relative w-full overflow-hidden ${aspect}`}>
            <img
              src={value}
              alt={label}
              className="h-full w-full object-cover"
            />

            {uploading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 p-6 text-white backdrop-blur-2xs">
                <Loader2 size={26} className="animate-spin mb-2" />
                <p className="text-xs font-semibold mb-2">Uploading... {progress}%</p>
                <div className="w-full max-w-45 h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-150 ease-out" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t bg-white p-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition hover:bg-gray-50 disabled:opacity-50"
            >
              <Upload size={16} />
              Replace
            </button>

            <button
              type="button"
              onClick={removeImage}
              disabled={uploading}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
            >
              <Trash2 size={16} />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed bg-gray-50 px-6 py-10 text-center transition hover:border-gray-400 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploading ? (
            <div className="w-full flex flex-col items-center">
              <Loader2 size={28} className="animate-spin text-gray-500 mb-2" />
              <p className="text-sm font-medium text-gray-700 mb-2">
                Uploading image... {progress}%
              </p>
              <div className="w-full max-w-50 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all duration-150 ease-out" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <>
              <ImagePlus size={30} className="text-gray-400" />

              <p className="mt-3 text-sm font-medium text-gray-700">
                Upload {label}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                JPG, PNG, WEBP or GIF · Maximum 5MB
              </p>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleUpload}
        className="hidden"
      />
    </div>
  );
}