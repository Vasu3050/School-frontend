// src/components/GalleryComponents.jsx
import React, { useEffect, useState } from "react";
import { X, Download, Share2, MessageSquare, Trash2, Edit3 } from "lucide-react";
import toast from "react-hot-toast";

/**
 * ConfirmModal
 * - type: "confirm" | "success" | "error"
 * - onConfirm: async function (optional)
 */
export function ConfirmModal({
  open,
  type = "confirm",
  title,
  message,
  confirmText = "Yes",
  cancelText = "Cancel",
  onClose,
  onConfirm,
}) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape" && open) onClose?.();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  const success = type === "success";
  const error = type === "error";

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center px-4 py-6">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-lg p-5 bg-white dark:bg-[#0b0b0b] shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className={`text-lg font-semibold ${success ? "text-emerald-600" : error ? "text-red-500" : "text-gray-900 dark:text-white"}`}>
              {title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{message}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-white/5">
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 flex gap-2 justify-end">
          {type === "confirm" && (
            <>
              <button onClick={onClose} className="px-3 py-2 rounded bg-white border border-gray-300 dark:bg-black-light dark:border-neutral-dark">
                {cancelText}
              </button>
              <button
                onClick={async () => {
                  if (!onConfirm) return onClose?.();
                  try {
                    await onConfirm();
                    // close is expected to be handled by caller inside onConfirm (they can also call onClose)
                  } catch (err) {
                    toast.error(err?.message || "Action failed");
                    onClose?.();
                  }
                }}
                className="px-3 py-2 rounded bg-red-600 text-white"
              >
                {confirmText}
              </button>
            </>
          )}

          {(type === "success" || type === "error") && (
            <button onClick={onClose} className="px-3 py-2 rounded bg-white border border-gray-300 dark:bg-black-light">
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * UploadModal
 * - multi-file upload UI with title inputs & deletion hint
 * - props: open, onClose, onUpload(files,titles), existingCounts, maxAllowed
 */
export function UploadModal({ open, onClose, onUpload, existingCount = 0, maxAllowed = 8 }) {
  const [files, setFiles] = useState([]);
  const [titles, setTitles] = useState({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!open) {
      setFiles([]);
      setTitles({});
      setUploading(false);
    }
  }, [open]);

  if (!open) return null;

  const handleChoose = (e) => {
    const chosen = Array.from(e.target.files || []);
    setFiles(chosen);
    const t = {};
    chosen.forEach((f, i) => (t[`title${i + 1}`] = f.name.split(".")[0]));
    setTitles(t);
  };

  const toRemove = Math.max(0, existingCount + files.length - maxAllowed);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <div className="absolute inset-0 bg-black/40" onClick={() => !uploading && onClose?.()} />
      <div className="relative z-10 w-full max-w-2xl rounded-lg p-5 bg-white dark:bg-[#0b0b0b] shadow-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Upload Media</h3>
          <button onClick={() => !uploading && onClose?.()} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-white/5">
            <X size={18} />
          </button>
        </div>

        <div className="mt-3">
          <input type="file" multiple accept="image/*,video/*" onChange={handleChoose} className="w-full" />
        </div>

        {files.length > 0 && (
          <div className="mt-3 max-h-48 overflow-auto space-y-2">
            {files.map((f, idx) => (
              <div key={idx} className="flex gap-3 items-center">
                <input
                  value={titles[`title${idx + 1}`] || ""}
                  onChange={(e) => setTitles((s) => ({ ...s, [`title${idx + 1}`]: e.target.value }))}
                  className="flex-1 p-2 rounded border bg-white dark:bg-black-light border-neutral-light dark:border-neutral-dark"
                />
                <div className="text-xs text-gray-500 dark:text-gray-400">{f.name}</div>
              </div>
            ))}

            <div className="text-xs mt-1">
              {toRemove > 0 ? (
                <div className="text-red-600">Uploading {files.length} will remove the oldest {toRemove} to keep max {maxAllowed}.</div>
              ) : (
                <div className="text-gray-600 dark:text-gray-400">{existingCount} existing. Maximum allowed is {maxAllowed}.</div>
              )}
            </div>
          </div>
        )}

        <div className="mt-4 flex justify-end gap-2">
          <button onClick={() => !uploading && onClose?.()} className="px-3 py-2 rounded border">Cancel</button>
          <button
            onClick={async () => {
              if (files.length === 0) { toast.error("No files selected"); return; }
              setUploading(true);
              try {
                // caller expects FormData; we will build it here and pass
                const fd = new FormData();
                files.forEach((f, i) => {
                  fd.append(`file${i + 1}`, f);
                  fd.append(`title${i + 1}`, titles[`title${i + 1}`] || f.name.split(".")[0]);
                });
                await onUpload(fd);
                setFiles([]);
                setTitles({});
                setUploading(false);
              } catch (err) {
                setUploading(false);
                toast.error(err?.message || "Upload failed");
              }
            }}
            className="px-3 py-2 rounded bg-primary-light text-white"
          >
            {uploading ? "Uploading..." : `Upload (${files.length})`}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * PreviewModal
 * - shows image/video and displays action buttons inside modal (Download, Share, WhatsApp, Delete, Edit)
 * - props: open, onClose, item, onDownload, onShare, onWhatsApp, onDelete, onEdit
 */
export function PreviewModal({ open, onClose, item, onDownload, onShare, onWhatsApp, onDelete, onEdit }) {
  useEffect(() => {
    function esc(e) { if (e.key === "Escape" && open) onClose?.(); }
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open, onClose]);

  if (!open || !item) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" onClick={onClose} />
      <div className="relative z-10 w-full max-w-[95vw] mx-auto mt-12 mb-12">
        <div className="rounded-2xl overflow-hidden bg-white dark:bg-[#0b0b0b] p-4">
          <button onClick={onClose} className="absolute top-3 right-3 z-20 p-2 bg-black/40 rounded-full text-white">
            <X size={18} />
          </button>

          <div className="max-h-[72vh] flex items-center justify-center">
            {item.mediaType === "video" ? (
              <video src={item.Url} controls className="w-full max-h-[72vh] object-contain rounded" />
            ) : (
              <img src={item.Url} alt={item.title} className="w-full max-h-[72vh] object-contain rounded" />
            )}
          </div>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</div>
              <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">{item.postedBy?.name || "Unknown"} • {new Date(item.createdAt).toLocaleDateString()}</div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button onClick={() => onDownload?.(item)} className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2">
                <Download size={16} /> Download
              </button>
              <button onClick={() => onShare?.(item)} className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg flex items-center justify-center gap-2">
                <Share2 size={16} /> Share
              </button>
              <button onClick={() => onWhatsApp?.(item)} className="w-full sm:w-auto px-4 py-2 bg-[#25D366] text-white rounded-lg flex items-center justify-center gap-2">
                <MessageSquare size={16} /> WhatsApp
              </button>

              <button onClick={() => onEdit?.(item)} className="w-full sm:w-auto px-3 py-2 bg-white border rounded-lg text-gray-800 dark:text-gray-200">
                <Edit3 size={16} /> Edit
              </button>

              <button onClick={() => onDelete?.(item)} className="w-full sm:w-auto px-3 py-2 bg-red-600 text-white rounded-lg">
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
