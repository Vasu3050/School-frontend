// AdminPhotoGallery.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Upload,
  Trash2,
  Edit3,
  Eye,
  Download,
  Share2,
  X,
  RefreshCw,
  Image as ImageIcon,
  Video,
  Calendar,
  User,
  MessageSquare,
} from "lucide-react";
import {
  getGalleryForManagement,
  uploadToGallery,
  uploadEventMedia,
  deletePhotoById,
  deleteMultiplePhotos,
  editPhotoById,
  getPhotoById,
} from "../../api/photoGallery.js";
import toast from "react-hot-toast";

// Notification modal component (adjust path if your project stores it elsewhere)
import NotificationModel from "../../components/NotificationModel.jsx";

/**
 * AdminPhotoGallery (updated)
 * - Prevents horizontal scroll, search fits viewport
 * - Blurred backdrop preview modal (iPhone-style)
 * - Cards dark-bg on mobile/scrolled area fixed
 * - Responsive Download/Delete/Share buttons
 */
const AdminPhotoGallery = () => {
  // data + pagination
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(12);
  const [totalPages, setTotalPages] = useState(1);

  // filters & search
  const [filter, setFilter] = useState("daily"); // daily | events | all
  const [search, setSearch] = useState("");

  // upload/edit/preview states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [uploadTitles, setUploadTitles] = useState({});
  const [uploadType, setUploadType] = useState("daily");
  const [uploading, setUploading] = useState(false);
  const [existingCounts, setExistingCounts] = useState({ daily: 0, events: 0 });

  const [showEditModal, setShowEditModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editFile, setEditFile] = useState(null);

  const [preview, setPreview] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // selection & bulk
  const [selectedIds, setSelectedIds] = useState([]);

  // stats
  const [stats, setStats] = useState({ total: 0, daily: 0, events: 0 });

  // notification modal state
  const [notif, setNotif] = useState({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
    onConfirm: null,
    confirmText: "Yes",
    cancelText: "Cancel",
  });

  // mapping for backend param
  const mapFilterToType = (f) => {
    if (f === "daily") return "gallery";
    if (f === "events") return "events";
    return "all";
  };

  // fetch gallery & counts
  const fetchGallery = useCallback(
    async (page = 1, f = filter) => {
      try {
        setLoading(true);
        const typeParam = mapFilterToType(f);
        const res = await getGalleryForManagement({
          page,
          limit,
          type: typeParam === "all" ? "all" : typeParam,
        });

        if (!res || !res.success) throw new Error(res?.message || "Failed to fetch gallery.");

        setGallery(res.data.gallery || []);
        setTotalPages(res.data.pagination?.totalPages || 1);
        setCurrentPage(res.data.pagination?.currentPage || page);

        // fetch counts for both categories so we can compute deletion hints
        const [dailyRes, eventsRes] = await Promise.all([
          getGalleryForManagement({ type: "gallery", limit: 10000, page: 1 }),
          getGalleryForManagement({ type: "events", limit: 10000, page: 1 }),
        ]);

        const dailyCount = dailyRes?.data?.pagination?.totalItems ?? (dailyRes?.data?.gallery?.length ?? 0);
        const eventsCount = eventsRes?.data?.pagination?.totalItems ?? (eventsRes?.data?.gallery?.length ?? 0);

        setExistingCounts({ daily: dailyCount, events: eventsCount });
        setStats({
          total: (dailyCount ?? 0) + (eventsCount ?? 0),
          daily: dailyCount ?? 0,
          events: eventsCount ?? 0,
        });
      } catch (err) {
        toast.error(err.message || "Error fetching gallery.");
      } finally {
        setLoading(false);
      }
    },
    [filter, limit]
  );

  useEffect(() => {
    fetchGallery(1, filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  // visible gallery filtered by search
  const visibleGallery = gallery.filter((p) =>
    (p.title || "").toLowerCase().includes((search || "").trim().toLowerCase())
  );

  // --- helpers for uploads & compute removals ---
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    const maxFiles = uploadType === "events" ? 12 : 8;
    if (files.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed for ${uploadType === "events" ? "Events" : "Daily/Gallery"}.`);
      return;
    }
    const titles = {};
    files.forEach((f, idx) => (titles[`title${idx + 1}`] = f.name.split(".")[0]));
    setUploadFiles(files);
    setUploadTitles(titles);
  };

  const computeFilesToRemove = (n, type) => {
    const existing = type === "events" ? existingCounts.events : existingCounts.daily;
    const maxAllowed = type === "events" ? 12 : 8;
    return Math.max(0, existing + n - maxAllowed);
  };

  const handleUpload = async () => {
    if (uploadFiles.length === 0) {
      toast.error("Select files to upload.");
      return;
    }
    const maxAllowed = uploadType === "events" ? 12 : 8;
    if (uploadFiles.length > maxAllowed) {
      toast.error(`Max ${maxAllowed} files allowed.`);
      return;
    }

    try {
      setUploading(true);
      const fd = new FormData();
      uploadFiles.forEach((f, idx) => {
        fd.append(`file${idx + 1}`, f);
        fd.append(`title${idx + 1}`, uploadTitles[`title${idx + 1}`] || f.name.split(".")[0]);
      });
      const res = uploadType === "events" ? await uploadEventMedia(fd) : await uploadToGallery(fd);
      if (!res || !res.success) throw new Error(res?.message || "Upload failed");
      toast.success(`${res.data?.totalFiles ?? uploadFiles.length} file(s) uploaded.`);
      setShowUploadModal(false);
      setUploadFiles([]);
      setUploadTitles({});
      await fetchGallery(1, filter);
    } catch (err) {
      toast.error(err.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  // robust download (fetch blob then fallback)
  const downloadByUrl = async (url, filename = "media") => {
    try {
      const res = await fetch(url, { mode: "cors" });
      if (!res.ok) throw new Error("Fetch failed");
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
      return true;
    } catch {
      try {
        const a = document.createElement("a");
        a.href = url;
        a.target = "_blank";
        a.rel = "noopener";
        document.body.appendChild(a);
        a.click();
        a.remove();
        return true;
      } catch {
        return false;
      }
    }
  };

  // actions
  const openPreview = (photo) => {
    setPreview(photo);
    setShowPreview(true);
  };

  const openEdit = (photo) => {
    setEditing(photo);
    setEditTitle(photo.title || "");
    setEditFile(null);
    setShowEditModal(true);
  };

  const saveEdit = async () => {
    if (!editing) return;
    try {
      const fd = new FormData();
      fd.append("title", editTitle);
      if (editFile) fd.append("file", editFile);
      const res = await editPhotoById({ id: editing._id, formData: fd });
      if (!res?.success) throw new Error(res?.message || "Update failed");
      toast.success("Updated.");
      setShowEditModal(false);
      setEditing(null);
      await fetchGallery(1, filter);
    } catch (err) {
      toast.error(err.message || "Update failed.");
    }
  };

  // confirm delete single using NotificationModel
  const confirmDelete = (id) => {
    setNotif({
      isOpen: true,
      type: "confirm",
      title: "Delete media?",
      message: "This permanently deletes the media. Continue?",
      onConfirm: async () => {
        try {
          const res = await deletePhotoById(id);
          if (!res?.success) throw new Error(res?.message || "Delete failed");
          await fetchGallery(1, filter);
          setNotif({ isOpen: true, type: "success", title: "Deleted", message: "Media deleted successfully.", onConfirm: null });
        } catch (err) {
          setNotif({ isOpen: true, type: "error", title: "Delete failed", message: err.message || "Could not delete.", onConfirm: null });
        }
      },
      confirmText: "Delete",
      cancelText: "Cancel",
    });
  };

  // bulk delete
  const confirmBulkDelete = () => {
    setNotif({
      isOpen: true,
      type: "confirm",
      title: `Delete ${selectedIds.length} items?`,
      message: `This will permanently delete ${selectedIds.length} items.`,
      onConfirm: async () => {
        try {
          const res = await deleteMultiplePhotos(selectedIds);
          if (!res?.success) throw new Error(res?.message || "Bulk delete failed");
          setSelectedIds([]);
          await fetchGallery(1, filter);
          setNotif({ isOpen: true, type: "success", title: "Deleted", message: `${res.data?.deletedCount ?? selectedIds.length} items deleted.`, onConfirm: null });
        } catch (err) {
          setNotif({ isOpen: true, type: "error", title: "Failed", message: err.message || "Bulk delete failed.", onConfirm: null });
        }
      },
      confirmText: "Delete All",
      cancelText: "Cancel",
    });
  };

  // share logic (navigator.share or whatsapp)
  const sharePhoto = async (photo) => {
    try {
      const text = `${photo.title || "Photo"}\n\n${photo.Url}`;
      if (navigator.share) {
        await navigator.share({ title: photo.title, text, url: photo.Url });
        return;
      }
      const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
      window.open(waUrl, "_blank", "noopener,noreferrer");
      try {
        await navigator.clipboard.writeText(text);
        toast.success("WhatsApp opened. Text copied to clipboard.");
      } catch {
        toast.success("WhatsApp opened.");
      }
    } catch {
      toast.error("Share failed");
    }
  };

  const shareOnWhatsApp = (photo) => {
    const text = `${photo.title || "Photo"}\n\n${photo.Url}`;
    const wa = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(wa, "_blank", "noopener,noreferrer");
  };

  const downloadPhoto = async (photo) => {
    const filename = (photo.title || "media").replace(/\s+/g, "_");
    const ok = await downloadByUrl(photo.Url, filename);
    if (ok) toast.success("Download started");
    else toast.error("Download failed");
  };

  const bulkDownloadSelected = async () => {
    if (selectedIds.length === 0) return;
    const selected = gallery.filter((g) => selectedIds.includes(g._id));
    try {
      for (let i = 0; i < selected.length; i++) {
        // eslint-disable-next-line no-await-in-loop
        await new Promise((r) => setTimeout(r, 250));
        // eslint-disable-next-line no-await-in-loop
        await downloadByUrl(selected[i].Url, (selected[i].title || `media_${i + 1}`).replace(/\s+/g, "_"));
      }
      toast.success("Bulk download started");
    } catch {
      toast.error("Bulk download encountered errors");
    }
  };

  // selection helpers
  const toggleSelect = (id) => setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  const selectAllOnPage = () => {
    if (selectedIds.length === visibleGallery.length) setSelectedIds([]);
    else setSelectedIds(visibleGallery.map((p) => p._id));
  };

  // --- UI ---
  return (
    // prevent horizontal scroll at top-level
    <div className="min-h-screen w-full overflow-x-hidden p-4 sm:p-6 bg-background-light dark:bg-background-dark">
      <div className="mx-auto w-full max-w-7xl px-2 sm:px-4">
        {/* header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-text-primaryLight dark:text-text-primaryDark">Photo Gallery - Admin</h1>
            <p className="text-sm text-text-secondaryLight dark:text-text-secondaryDark mt-1">Manage Daily Activities & Events/Fests</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => fetchGallery(1, filter)}
              className="flex items-center gap-2 px-3 py-2 h-10 rounded-lg border border-neutral-light dark:border-neutral-dark bg-white-light dark:bg-black-light text-text-primaryLight dark:text-text-primaryDark"
              title="Refresh"
            >
              <RefreshCw size={16} /> Refresh
            </button>

            <button
              onClick={() => { setUploadType("daily"); setShowUploadModal(true); }}
              className="flex items-center gap-2 px-3 py-2 h-10 rounded-lg bg-primary-light dark:bg-primary-dark text-white"
              title="Upload"
            >
              <Plus size={16} /> Upload
            </button>
          </div>
        </div>

        {/* stats + filters + bulk actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-surface-light dark:bg-surface-dark">
            <div className="text-sm text-text-secondaryLight dark:text-text-secondaryDark">Total</div>
            <div className="text-xl font-semibold text-text-primaryLight dark:text-text-primaryDark">{stats.total}</div>
          </div>

          <div className="p-4 rounded-lg bg-surface-light dark:bg-surface-dark">
            <div className="text-sm text-text-secondaryLight dark:text-text-secondaryDark">Daily Activities</div>
            <div className="text-xl font-semibold text-text-primaryLight dark:text-text-primaryDark">{stats.daily}</div>
          </div>

          <div className="p-4 rounded-lg bg-surface-light dark:bg-surface-dark">
            <div className="text-sm text-text-secondaryLight dark:text-text-secondaryDark">Events / Fests</div>
            <div className="text-xl font-semibold text-text-primaryLight dark:text-text-primaryDark">{stats.events}</div>
          </div>

          {/* filter + search + bulk controls */}
          <div className="p-3 rounded-lg bg-surface-light dark:bg-surface-dark flex flex-col gap-3">
            <div className="flex gap-2 w-full">
              <select
                value={filter}
                onChange={(e) => { setFilter(e.target.value); setCurrentPage(1); }}
                className="p-2 rounded border border-neutral-light dark:border-neutral-dark bg-white-light dark:bg-black-light text-text-primaryLight dark:text-text-primaryDark h-10"
              >
                <option value="daily">Daily Activities</option>
                <option value="events">Events / Fests</option>
                <option value="all">All</option>
              </select>

              <input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 px-4 py-2 rounded border border-neutral-light dark:border-neutral-dark bg-white-light dark:bg-black-light text-text-primaryLight dark:text-text-primaryDark h-10 w-5"
                aria-label="Search photos"
              />
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedIds.length === visibleGallery.length && visibleGallery.length > 0}
                  onChange={selectAllOnPage}
                  className="rounded border-neutral-light dark:border-neutral-dark"
                />
                <span className="text-sm text-text-secondaryLight dark:text-text-secondaryDark">Select all ({visibleGallery.length})</span>
              </div>

              {selectedIds.length > 0 && (
                <>
                  <button onClick={confirmBulkDelete} className="px-3 py-2 h-10 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2">
                    <Trash2 size={16} /> Delete Selected ({selectedIds.length})
                  </button>

                  <button onClick={bulkDownloadSelected} className="px-3 py-2 h-10 bg-accent-light dark:bg-accent-dark text-white rounded-lg flex items-center gap-2">
                    <Download size={16} /> Download Selected
                  </button>

                  <button onClick={() => setSelectedIds([])} className="px-3 py-2 h-10 border border-neutral-light dark:border-neutral-dark rounded-lg bg-white-light dark:bg-black-light">
                    Clear Selection
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* gallery grid */}
        <div>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse bg-surface-light dark:bg-surface-dark p-3 rounded">
                  <div className="h-28 bg-neutral-light dark:bg-neutral-dark rounded mb-2" />
                  <div className="h-3 bg-neutral-light dark:bg-neutral-dark rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : visibleGallery.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon size={48} className="mx-auto text-neutral-light dark:text-neutral-dark mb-3" />
              <div className="text-text-primaryLight dark:text-text-primaryDark">No media found</div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {visibleGallery.map((p) => (
                <div key={p._id} className="rounded overflow-hidden shadow-sm transition hover:shadow-lg bg-white-light dark:bg-[#0b0b0b]">
                  <div className="relative">
                    {/* checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(p._1d)}
                      onChange={() => toggleSelect(p._id)}
                      className="absolute z-20 top-2 left-2 rounded border-neutral-light dark:border-neutral-dark"
                    />

                    {p.mediaType === "video" ? (
                      <video src={p.Url} className="w-full h-28 object-cover" controls onClick={() => openPreview(p)} />
                    ) : (
                      <img src={p.Url} alt={p.title} className="w-full h-28 object-cover cursor-pointer" onClick={() => openPreview(p)} />
                    )}

                    {/* action overlay */}
                    <div className="absolute bottom-2 left-2 right-2 flex flex-wrap justify-between items-center gap-2">
                      <div className="flex gap-2">
                        <button onClick={() => openPreview(p)} className="h-9 px-2 py-1 rounded-lg bg-white-light dark:bg-black-light bg-opacity-90 flex items-center gap-2 text-xs">
                          <Eye size={14} /> Preview
                        </button>

                        <button onClick={() => openEdit(p)} className="h-9 px-2 py-1 rounded-lg bg-white-light dark:bg-black-light bg-opacity-90 flex items-center gap-2 text-xs">
                          <Edit3 size={14} /> Edit
                        </button>
                      </div>

                      <div className="flex gap-2">
                        <button onClick={() => downloadPhoto(p)} className="h-9 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 text-sm">
                          <Download size={14} />
                        </button>

                        <button onClick={() => sharePhoto(p)} className="h-9 px-3 rounded-lg bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 text-sm">
                          <Share2 size={14} />
                        </button>

                        <button onClick={() => confirmDelete(p._id)} className="h-9 px-3 rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 text-sm">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* badges */}
                    <div className="absolute top-2 right-2 flex gap-1">
                      <span className="px-2 py-0.5 rounded bg-white-light dark:bg-black-light text-xs">
                        {p.mediaType === "video" ? <Video size={12} /> : <ImageIcon size={12} />}
                      </span>
                      {p.event && <span className="px-2 py-0.5 rounded bg-secondary-light dark:bg-secondary-dark text-xs">Event</span>}
                    </div>
                  </div>

                  <div className="p-2">
                    <div className="text-sm font-medium text-text-primaryLight dark:text-text-primaryDark truncate">{p.title}</div>
                    <div className="text-xs text-text-secondaryLight dark:text-text-secondaryDark mt-1 flex items-center gap-2">
                      <User size={12} /> <span>{p.postedBy?.name || "Unknown"}</span>
                      <span className="ml-auto flex items-center gap-1"><Calendar size={12} /> {new Date(p.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            <button onClick={() => fetchGallery(Math.max(1, currentPage - 1), filter)} className="px-3 py-1 border rounded" disabled={currentPage === 1}>Prev</button>
            <div className="px-3 py-1 border rounded">{currentPage} / {totalPages}</div>
            <button onClick={() => fetchGallery(Math.min(totalPages, currentPage + 1), filter)} className="px-3 py-1 border rounded" disabled={currentPage === totalPages}>Next</button>
          </div>
        )}

        {/* Upload modal */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={() => setShowUploadModal(false)} />
            <div className="relative z-10 w-full max-w-[95vw] sm:max-w-2xl mx-auto mt-20 mb-20 bg-surface-light dark:bg-surface-dark rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-text-primaryLight dark:text-text-primaryDark">Upload Media</h2>
                <button onClick={() => setShowUploadModal(false)} className="p-1"><X size={18} /></button>
              </div>

              <div className="mb-3">
                <label className="text-sm text-text-secondaryLight dark:text-text-secondaryDark">Type</label>
                <div className="flex gap-3 mt-2">
                  <label className="flex items-center gap-2"><input type="radio" value="daily" checked={uploadType === "daily"} onChange={() => setUploadType("daily")} /> Daily (max 8)</label>
                  <label className="flex items-center gap-2"><input type="radio" value="events" checked={uploadType === "events"} onChange={() => setUploadType("events")} /> Events (max 12)</label>
                </div>
              </div>

              <div className="mb-3">
                <label className="text-sm text-text-secondaryLight dark:text-text-secondaryDark">Select files</label>
                <input type="file" multiple accept="image/*,video/*" onChange={handleFileSelect} className="w-full mt-2 p-2 border border-neutral-light dark:border-neutral-dark rounded bg-white-light dark:bg-black-light" />
              </div>

              {uploadFiles.length > 0 && (
                <div className="mb-3">
                  <div className="max-h-40 overflow-auto space-y-2">
                    {uploadFiles.map((f, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <input value={uploadTitles[`title${idx + 1}`] || ""} onChange={(e) => setUploadTitles((s) => ({ ...s, [`title${idx + 1}`]: e.target.value }))} className="flex-1 p-2 rounded border border-neutral-light dark:border-neutral-dark bg-white-light dark:bg-black-light" />
                        <div className="text-xs text-text-secondaryLight dark:text-text-secondaryDark">{f.name}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-2 text-xs">
                    {(() => {
                      const toRemove = computeFilesToRemove(uploadFiles.length, uploadType);
                      const maxAllowed = uploadType === "events" ? 12 : 8;
                      if (toRemove > 0) return <div className="text-red-600">Note: Uploading {uploadFiles.length} file(s) will remove the oldest {toRemove} file(s) in {uploadType === "events" ? "Events" : "Daily Activities"} to keep the maximum of {maxAllowed}.</div>;
                      const existing = uploadType === "events" ? existingCounts.events : existingCounts.daily;
                      return <div className="text-neutral-dark">{existing} existing. Maximum allowed is {maxAllowed}.</div>;
                    })()}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button onClick={() => setShowUploadModal(false)} className="px-3 py-2 border rounded bg-white-light dark:bg-black-light">Cancel</button>
                <button onClick={handleUpload} disabled={uploading || uploadFiles.length === 0} className="px-3 py-2 rounded bg-primary-light dark:bg-primary-dark text-white flex items-center gap-2">
                  {uploading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Upload size={14} /> Upload ({uploadFiles.length})</>}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit modal */}
        {showEditModal && editing && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-md" onClick={() => setShowEditModal(false)} />
            <div className="relative z-10 w-full max-w-[95vw] sm:max-w-md mx-auto mt-24 mb-24 bg-surface-light dark:bg-surface-dark rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-text-primaryLight dark:text-text-primaryDark">Edit Media</h3>
                <button onClick={() => setShowEditModal(false)}><X size={16} /></button>
              </div>

              <div className="mb-3"><img src={editing.Url} alt={editing.title} className="w-full h-36 object-cover rounded" /></div>

              <div className="mb-3">
                <label className="text-sm text-text-secondaryLight dark:text-text-secondaryDark">Title</label>
                <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full p-2 border border-neutral-light dark:border-neutral-dark rounded bg-white-light dark:bg-black-light" />
              </div>

              <div className="mb-3">
                <label className="text-sm text-text-secondaryLight dark:text-text-secondaryDark">Replace file (optional)</label>
                <input type="file" accept="image/*,video/*" onChange={(e) => setEditFile(e.target.files?.[0])} />
              </div>

              <div className="flex justify-end gap-2">
                <button onClick={() => setShowEditModal(false)} className="px-3 py-2 border rounded">Cancel</button>
                <button onClick={saveEdit} className="px-3 py-2 rounded bg-primary-light dark:bg-primary-dark text-white">Save</button>
              </div>
            </div>
          </div>
        )}

        {/* Preview modal with heavy blur (iPhone-like) */}
        {showPreview && preview && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div
              className="absolute inset-0 bg-black/50"
              style={{ backdropFilter: "blur(18px) saturate(140%)", WebkitBackdropFilter: "blur(18px) saturate(140%)" }}
              onClick={() => setShowPreview(false)}
            />

            <div className="relative z-10 w-full max-w-[95vw] mx-auto mt-16 mb-16">
              <div
                className="rounded-2xl overflow-hidden"
                style={{ background: "rgba(255,255,255,0.03)", boxShadow: "0 20px 50px rgba(0,0,0,0.6)" }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* close */}
                <button onClick={() => setShowPreview(false)} className="absolute top-3 right-3 z-20 p-2 bg-black/40 rounded-full text-white m-3">
                  <X size={20} />
                </button>

                <div className="p-4">
                  {preview.mediaType === "video" ? (
                    <video src={preview.Url} controls className="w-full max-h-[72vh] object-contain rounded" />
                  ) : (
                    <img src={preview.Url} alt={preview.title} className="w-full max-h-[72vh] object-contain rounded" />
                  )}

                  <div className="mt-4 px-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <div className="text-lg font-semibold text-text-primaryLight dark:text-text-primaryDark">{preview.title}</div>
                        <div className="text-xs text-text-secondaryLight dark:text-text-secondaryDark mt-1 flex items-center gap-2">
                          <User size={12} /> {preview.postedBy?.name || "Unknown"} • <Calendar size={12} /> {new Date(preview.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      {/* action buttons: stack vertically on small screens (no horizontal scroll) */}
                      <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center w-full sm:w-auto mt-2 sm:mt-0">
                        <button onClick={() => downloadPhoto(preview)} className="w-full sm:w-auto px-4 py-2 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 justify-center">
                          <Download size={16} /> Download
                        </button>
                        <button onClick={() => sharePhoto(preview)} className="w-full sm:w-auto px-4 py-2 h-10 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 justify-center">
                          <Share2 size={16} /> Share
                        </button>
                        <button onClick={() => shareOnWhatsApp(preview)} className="w-full sm:w-auto px-4 py-2 h-10 bg-[#25D366] hover:opacity-95 text-white rounded-lg flex items-center gap-2 justify-center">
                          <MessageSquare size={16} /> WhatsApp
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notification modal (confirm / success / error) */}
        <NotificationModel
          isOpen={notif.isOpen}
          onClose={() => setNotif((s) => ({ ...s, isOpen: false }))}
          type={notif.type}
          title={notif.title}
          message={notif.message}
          onConfirm={notif.onConfirm}
          confirmText={notif.confirmText}
          cancelText={notif.cancelText}
        />
      </div>
    </div>
  );
};

export default AdminPhotoGallery;
