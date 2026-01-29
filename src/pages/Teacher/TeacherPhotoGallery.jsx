// TeacherPhotoGallery.jsx
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Trash2,
  Edit3,
  Eye,
  Filter,
  Search,
  Plus,
  X,
  Check,
  Image as ImageIcon,
  Video,
  Calendar,
  User,
  Download,
  Share2,
  RefreshCw,
  BookOpen,
  GraduationCap,
  FileImage,
  FileVideo,
} from "lucide-react";
import {
  getGalleryForManagement,
  uploadToGallery,
  uploadEventMedia,
  deletePhotoById,
  deleteMultiplePhotos,
  editPhotoById,
} from "../../api/photoGallery.js";
import toast from "react-hot-toast";

// Notification modal you uploaded earlier. Update path if needed.
import NotificationModel from "../../components/NotificationModel.jsx";

/**
 * TeacherPhotoGallery - upgraded:
 * - Prevents horizontal scroll (overflow-x-hidden)
 * - Blurred preview modal (iPhone-like)
 * - Responsive action buttons (stack on mobile)
 * - Robust download (fetch -> blob fallback)
 * - WhatsApp share fallback
 * - NotificationModel used for confirmations & success/error messages
 * - Search icon kept at w-5 h-5 per backend requirement
 */
const TeacherPhotoGallery = () => {
  // data + pagination
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // modals & upload
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [uploadType, setUploadType] = useState("gallery");
  const [uploadFiles, setUploadFiles] = useState([]);
  const [uploadTitles, setUploadTitles] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editFile, setEditFile] = useState(null);
  const [stats, setStats] = useState({ total: 0, gallery: 0, events: 0 });
  const limit = 12;

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

  // fetch gallery + stats
  const fetchGallery = useCallback(
    async (page = currentPage, type = filterType) => {
      try {
        setLoading(true);
        const response = await getGalleryForManagement({
          page,
          limit,
          type,
        });

        if (response?.success) {
          setGallery(response.data.gallery || []);
          setTotalPages(response.data.pagination?.totalPages || 1);
          setCurrentPage(response.data.pagination?.currentPage || page);
        } else {
          throw new Error(response?.message || "Failed to fetch gallery");
        }

        // stats: fetch all to compute counts
        const allRes = await getGalleryForManagement({ type: "all", limit: 10000, page: 1 });
        if (allRes?.success) {
          const allGallery = allRes.data.gallery || [];
          setStats({
            total: allGallery.length,
            gallery: allGallery.filter((p) => !p.event).length,
            events: allGallery.filter((p) => p.event).length,
          });
        }
      } catch (err) {
        toast.error(err.message || "Failed to fetch gallery");
      } finally {
        setLoading(false);
      }
    },
    [currentPage, filterType]
  );

  useEffect(() => {
    fetchGallery(1, filterType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType]);

  // visible list filtered by search
  const filteredGallery = gallery.filter((p) =>
    (p.title || "").toLowerCase().includes((searchTerm || "").toLowerCase())
  );

  // upload helpers
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    const maxFiles = uploadType === "event" ? 12 : 8;
    if (files.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }
    setUploadFiles(files);
    const titles = {};
    files.forEach((f, idx) => (titles[`title${idx + 1}`] = f.name.split(".")[0]));
    setUploadTitles(titles);
  };

  const handleTitleChange = (index, value) => {
    setUploadTitles((prev) => ({ ...prev, [`title${index + 1}`]: value }));
  };

  const handleUpload = async () => {
    if (uploadFiles.length === 0) {
      toast.error("Please select files to upload");
      return;
    }
    try {
      setUploading(true);
      const fd = new FormData();
      uploadFiles.forEach((file, i) => {
        fd.append(`file${i + 1}`, file);
        fd.append(`title${i + 1}`, uploadTitles[`title${i + 1}`] || file.name.split(".")[0]);
      });
      const res = uploadType === "event" ? await uploadEventMedia(fd) : await uploadToGallery(fd);
      if (!res?.success) throw new Error(res?.message || "Upload failed");
      toast.success(`${res.data?.totalFiles ?? uploadFiles.length} uploaded`);
      setShowUploadModal(false);
      setUploadFiles([]);
      setUploadTitles({});
      await fetchGallery(1, filterType);
    } catch (err) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // robust download helper
  const downloadByUrl = async (url, filename = "media") => {
    try {
      const res = await fetch(url, { mode: "cors" });
      if (!res.ok) throw new Error("Network error");
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

  // actions: preview / edit
  const openPreview = (photo) => {
    setPreviewPhoto(photo);
    setShowPreviewModal(true);
  };

  const openEdit = (photo) => {
    setEditingPhoto(photo);
    setEditTitle(photo.title || "");
    setEditFile(null);
    setShowEditModal(true);
  };

  const saveEdit = async () => {
    if (!editingPhoto) return;
    try {
      const fd = new FormData();
      fd.append("title", editTitle);
      if (editFile) fd.append("file", editFile);
      const res = await editPhotoById({ id: editingPhoto._id, formData: fd });
      if (!res?.success) throw new Error(res?.message || "Update failed");
      toast.success("Updated");
      setShowEditModal(false);
      setEditingPhoto(null);
      await fetchGallery(1, filterType);
    } catch (err) {
      toast.error(err.message || "Update failed");
    }
  };

  // notification-based confirmation for delete
  const confirmDelete = (id) => {
    setNotif({
      isOpen: true,
      type: "confirm",
      title: "Delete photo?",
      message: "This will permanently delete the photo. Continue?",
      onConfirm: async () => {
        try {
          const res = await deletePhotoById(id);
          if (!res?.success) throw new Error(res?.message || "Delete failed");
          await fetchGallery(1, filterType);
          setNotif({ isOpen: true, type: "success", title: "Deleted", message: "Photo deleted successfully", onConfirm: null });
        } catch (err) {
          setNotif({ isOpen: true, type: "error", title: "Failed", message: err.message || "Delete failed", onConfirm: null });
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
      title: `Delete ${selectedPhotos.length} photos?`,
      message: "This will permanently delete selected photos.",
      onConfirm: async () => {
        try {
          const res = await deleteMultiplePhotos(selectedPhotos);
          if (!res?.success) throw new Error(res?.message || "Bulk delete failed");
          setSelectedPhotos([]);
          await fetchGallery(1, filterType);
          setNotif({ isOpen: true, type: "success", title: "Deleted", message: `${res.data?.deletedCount ?? selectedPhotos.length} photos deleted`, onConfirm: null });
        } catch (err) {
          setNotif({ isOpen: true, type: "error", title: "Failed", message: err.message || "Bulk delete failed", onConfirm: null });
        }
      },
      confirmText: "Delete All",
      cancelText: "Cancel",
    });
  };

  // bulk download (sequential with delay)
  const handleBulkDownload = async () => {
    if (selectedPhotos.length === 0) return;
    const selected = gallery.filter((g) => selectedPhotos.includes(g._id));
    try {
      for (let i = 0; i < selected.length; i++) {
        // eslint-disable-next-line no-await-in-loop
        await new Promise((r) => setTimeout(r, 300));
        // eslint-disable-next-line no-await-in-loop
        await downloadByUrl(selected[i].Url, (selected[i].title || `media_${i + 1}`).replace(/\s+/g, "_"));
      }
      toast.success("Downloading selected photos");
    } catch {
      toast.error("Bulk download error");
    }
  };

  // share / whatsapp
  const sharePhoto = async (photo) => {
    try {
      const text = `${photo.title || "Photo"}\n\n${photo.Url}`;
      if (navigator.share) {
        await navigator.share({ title: photo.title, text, url: photo.Url });
        return;
      }
      await navigator.clipboard.writeText(photo.Url);
      const wa = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
      window.open(wa, "_blank", "noopener,noreferrer");
      toast.success("WhatsApp opened and URL copied");
    } catch {
      toast.error("Share failed");
    }
  };

  const handleDownloadPhoto = async (photo) => {
    const ok = await downloadByUrl(photo.Url, (photo.title || "media").replace(/\s+/g, "_"));
    if (ok) toast.success("Download started");
    else toast.error("Download failed");
  };

  // toggle selection
  const handlePhotoSelect = (id) => {
    setSelectedPhotos((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };
  const handleSelectAll = () => {
    if (selectedPhotos.length === gallery.length) setSelectedPhotos([]);
    else setSelectedPhotos(gallery.map((p) => p._id));
  };

  // framer variants
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };
  const itemVariants = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } };

  return (
    // prevent horizontal scroll X & ensure background covers full scroll
    <div className="min-h-screen w-full overflow-x-hidden bg-background-light dark:bg-background-dark p-6">
      <div className="max-w-7xl mx-auto w-full px-2 sm:px-4">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-text-primaryLight dark:text-text-primaryDark">Photo Gallery Management</h1>
              <p className="text-sm text-text-secondaryLight dark:text-text-secondaryDark mt-1">Share classroom moments and special events with parents</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => fetchGallery(1, filterType)}
                className="flex items-center gap-2 px-3 py-2 h-10 rounded-lg border border-neutral-light dark:border-neutral-dark bg-white-light dark:bg-black-light text-text-primaryLight dark:text-text-primaryDark"
              >
                <RefreshCw size={18} /> Refresh
              </button>

              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-2 px-3 py-2 h-10 rounded-lg bg-primary-light dark:bg-primary-dark text-white"
              >
                <Plus size={18} /> Upload Media
              </button>
            </div>
          </div>
        </motion.div>

        {/* Teacher info card */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-info-light  bg-opacity-10 border border-info-light dark:border-info-dark border-opacity-20 rounded-lg p-4 mb-6">
          <div className="flex gap-4 items-start">
            <div className="p-3 rounded-lg bg-info-light bg-opacity-20">
              <BookOpen size={20} className="text-info-light " />
            </div>
            <div>
              <h3 className="font-semibold text-info-light  mb-2">Teacher Guidelines</h3>
              <p className="text-sm text-text-secondaryLight dark:text-text-secondaryDark">Upload photos of classroom activities and events. Classroom photos: max 8, Events: max 12.</p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-surface-light dark:bg-surface-dark rounded-lg p-4">
            <div className="text-sm text-text-secondaryLight dark:text-text-secondaryDark">Total Media</div>
            <div className="text-2xl font-semibold text-text-primaryLight dark:text-text-primaryDark">{stats.total}</div>
          </div>
          <div className="bg-surface-light dark:bg-surface-dark rounded-lg p-4">
            <div className="text-sm text-text-secondaryLight dark:text-text-secondaryDark">Classroom Photos</div>
            <div className="text-2xl font-semibold text-text-primaryLight dark:text-text-primaryDark">{stats.gallery}</div>
          </div>
          <div className="bg-surface-light dark:bg-surface-dark rounded-lg p-4">
            <div className="text-sm text-text-secondaryLight dark:text-text-secondaryDark">Special Events</div>
            <div className="text-2xl font-semibold text-text-primaryLight dark:text-text-primaryDark">{stats.events}</div>
          </div>
        </motion.div>

        {/* Filters + Search + Bulk actions area */}
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="bg-surface-light dark:bg-surface-dark rounded-lg p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-1 gap-3 items-center w-full">
              {/* Search: icon kept w-5 h-5 per backend instruction */}
              <div className="relative flex-1 max-w-md w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-light dark:text-neutral-dark w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search photos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 h-10 border border-neutral-light dark:border-neutral-dark rounded-lg bg-white-light dark:bg-black-light text-text-primaryLight dark:text-text-primaryDark focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
                />
              </div>

              {/* Filter select */}
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-neutral-light dark:text-neutral-dark" />
                <select
                  value={filterType}
                  onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
                  className="px-3 py-2 h-10 border border-neutral-light dark:border-neutral-dark rounded-lg bg-white-light dark:bg-black-light text-text-primaryLight dark:text-text-primaryDark"
                >
                  <option value="all">All Media</option>
                  <option value="gallery">Classroom</option>
                  <option value="events">Events</option>
                </select>
              </div>
            </div>

            {/* Bulk actions */}
            {selectedPhotos.length > 0 && (
              <div className="flex gap-2 items-center mt-3 lg:mt-0">
                <span className="text-sm text-text-secondaryLight dark:text-secondaryDark">{selectedPhotos.length} selected</span>
                <button onClick={handleBulkDownload} className="flex items-center gap-2 px-3 py-2 h-10 bg-accent-light dark:bg-accent-dark text-white rounded-lg">
                  <Download size={16} /> Download
                </button>
                <button onClick={confirmBulkDelete} className="flex items-center gap-2 px-3 py-2 h-10 bg-danger-light dark:bg-danger-dark text-white rounded-lg">
                  <Trash2 size={16} /> Delete
                </button>
                <button onClick={() => setSelectedPhotos([])} className="px-3 py-2 h-10 border border-neutral-light dark:border-neutral-dark rounded-lg bg-white-light dark:bg-black-light">
                  Clear
                </button>
              </div>
            )}
          </div>

          {/* select all */}
          <div className="mt-4 flex items-center gap-2">
            <input type="checkbox" checked={selectedPhotos.length === gallery.length && gallery.length > 0} onChange={handleSelectAll} className="rounded border-neutral-light dark:border-neutral-dark" />
            <span className="text-sm text-text-secondaryLight dark:text-secondaryDark">Select All ({gallery.length} items)</span>
          </div>
        </motion.div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-surface-light dark:bg-surface-dark rounded-lg p-4 animate-pulse">
                <div className="aspect-square bg-neutral-light dark:bg-neutral-dark rounded mb-3" />
                <div className="h-4 bg-neutral-light dark:bg-neutral-dark rounded mb-2" />
                <div className="h-3 bg-neutral-light dark:bg-neutral-dark rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : filteredGallery.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <BookOpen size={48} className="mx-auto text-neutral-light dark:text-neutral-dark mb-4" />
            <h3 className="text-xl font-semibold text-text-primaryLight dark:text-text-primaryDark mb-2">No photos found</h3>
            <p className="text-text-secondaryLight dark:text-secondaryDark mb-4">{searchTerm ? "Try different keywords" : "Start sharing classroom moments with parents"}</p>
            {!searchTerm && <button onClick={() => setShowUploadModal(true)} className="px-6 py-3 bg-primary-light dark:bg-primary-dark text-white rounded-lg">Upload Photo</button>}
          </motion.div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGallery.map((photo) => (
              <AnimatePresence key={photo._id}>
                <motion.div variants={itemVariants} layout className="group bg-surface-light dark:bg-surface-dark rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all">
                  <div className="relative aspect-square overflow-hidden">
                    <input type="checkbox" checked={selectedPhotos.includes(photo._id)} onChange={() => handlePhotoSelect(photo._id)} className="absolute top-3 left-3 z-10 rounded border-neutral-light dark:border-neutral-dark" />

                    {photo.mediaType === "video" ? (
                      <video src={photo.Url} className="w-full h-full object-cover" controls />
                    ) : (
                      <img src={photo.Url} alt={photo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer" onClick={() => openPreview(photo)} />
                    )}

                    {/* Overlay with actions (icons on hover) */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                        <button onClick={() => openPreview(photo)} className="p-2 bg-white bg-opacity-90 rounded-full"><Eye size={16} /></button>
                        <button onClick={() => openEdit(photo)} className="p-2 bg-white bg-opacity-90 rounded-full"><Edit3 size={16} /></button>
                        <button onClick={() => handleDownloadPhoto(photo)} className="p-2 bg-white bg-opacity-90 rounded-full"><Download size={16} /></button>
                        <button onClick={() => sharePhoto(photo)} className="p-2 bg-white bg-opacity-90 rounded-full"><Share2 size={16} /></button>
                        <button onClick={() => confirmDelete(photo._id)} className="p-2 bg-white bg-opacity-90 rounded-full"><Trash2 size={16} /></button>
                      </div>
                    </div>

                    {/* top-right badges */}
                    <div className="absolute top-3 right-3 flex gap-2">
                      <span className="px-2 py-0.5 rounded bg-white-light dark:bg-black-light text-xs">{photo.mediaType === "video" ? <Video size={12} /> : <ImageIcon size={12} />}</span>
                      {photo.event && <span className="px-2 py-0.5 rounded bg-secondary-light dark:bg-secondary-dark text-xs">Event</span>}
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-text-primaryLight dark:text-text-primaryDark truncate">{photo.title}</h3>
                    <div className="flex items-center gap-2 mt-2 text-sm text-text-secondaryLight dark:text-secondaryDark">
                      <User size={14} />
                      <span>{photo.postedBy?.name || "Unknown"}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-sm text-text-secondaryLight dark:text-secondaryDark">
                      <Calendar size={14} />
                      <span>{new Date(photo.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            ))}
          </motion.div>
        )}

        {/* pagination */}
        {totalPages > 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center mt-8">
            <div className="flex gap-2">
              <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-2 rounded border border-neutral-light dark:border-neutral-dark disabled:opacity-50">Prev</button>
              {[...Array(totalPages)].map((_, i) => (
                <button key={i} onClick={() => setCurrentPage(i + 1)} className={`px-3 py-2 rounded ${currentPage === i + 1 ? "bg-primary-light dark:bg-primary-dark text-white" : "border border-neutral-light dark:border-neutral-dark"}`}>{i + 1}</button>
              ))}
              <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-2 rounded border border-neutral-light dark:border-neutral-dark disabled:opacity-50">Next</button>
            </div>
          </motion.div>
        )}

        {/* Upload Modal */}
        <AnimatePresence>
          {showUploadModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 overflow-y-auto">
              <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={() => setShowUploadModal(false)} />
              <div className="relative z-10 w-full max-w-[95vw] sm:max-w-2xl mx-auto mt-20 mb-20 bg-surface-light dark:bg-surface-dark rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-text-primaryLight dark:text-text-primaryDark">Upload Media</h2>
                  <button onClick={() => setShowUploadModal(false)} className="p-2"><X size={18} /></button>
                </div>

                {/* type */}
                <div className="mb-4">
                  <label className="text-sm text-text-secondaryLight dark:text-text-secondaryDark">Upload Type</label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center gap-2"><input type="radio" value="gallery" checked={uploadType === "gallery"} onChange={(e) => setUploadType(e.target.value)} /> Classroom (max 8)</label>
                    <label className="flex items-center gap-2"><input type="radio" value="event" checked={uploadType === "event"} onChange={(e) => setUploadType(e.target.value)} /> Events (max 12)</label>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="text-sm text-text-secondaryLight dark:text-text-secondaryDark">Select Files</label>
                  <input type="file" multiple accept="image/*,video/*" onChange={handleFileSelect} className="w-full mt-2 p-2 border border-neutral-light dark:border-neutral-dark rounded bg-white-light dark:bg-black-light" />
                </div>

                {uploadFiles.length > 0 && (
                  <div className="mb-4 max-h-40 overflow-y-auto space-y-2">
                    {uploadFiles.map((f, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <input type="text" value={uploadTitles[`title${idx + 1}`] || ""} onChange={(e) => handleTitleChange(idx, e.target.value)} className="flex-1 p-2 rounded border border-neutral-light dark:border-neutral-dark bg-white-light dark:bg-black-light" />
                        <div className="text-xs text-text-secondaryLight dark:text-secondaryDark">{f.name}</div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <button onClick={() => setShowUploadModal(false)} className="px-3 py-2 border rounded bg-white-light dark:bg-black-light">Cancel</button>
                  <button onClick={handleUpload} disabled={uploading || uploadFiles.length === 0} className="px-4 py-2 bg-primary-light dark:bg-primary-dark text-white rounded">
                    {uploading ? "Uploading..." : <><Upload size={14} /> Upload</>}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Modal */}
        <AnimatePresence>
          {showEditModal && editingPhoto && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 overflow-y-auto">
              <div className="absolute inset-0 bg-black/30 backdrop-blur-md" onClick={() => setShowEditModal(false)} />
              <div className="relative z-10 w-full max-w-[95vw] sm:max-w-md mx-auto mt-24 mb-24 bg-surface-light dark:bg-surface-dark rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-text-primaryLight dark:text-text-primaryDark">Edit Photo</h2>
                  <button onClick={() => setShowEditModal(false)} className="p-2"><X size={18} /></button>
                </div>

                <img src={editingPhoto.Url} alt={editingPhoto.title} className="w-full h-48 object-cover rounded mb-4" />
                <div className="mb-3">
                  <label className="text-sm text-text-secondaryLight dark:text-text-secondaryDark">Title</label>
                  <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full p-2 border border-neutral-light dark:border-neutral-dark rounded bg-white-light dark:bg-black-light" />
                </div>
                <div className="mb-4">
                  <label className="text-sm text-text-secondaryLight dark:text-text-secondaryDark">Replace File (optional)</label>
                  <input type="file" accept="image/*,video/*" onChange={(e) => setEditFile(e.target.files?.[0])} />
                </div>

                <div className="flex justify-end gap-2">
                  <button onClick={() => setShowEditModal(false)} className="px-3 py-2 border rounded">Cancel</button>
                  <button onClick={saveEdit} className="px-4 py-2 bg-primary-light dark:bg-primary-dark text-white rounded">Save</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Preview Modal (blurred backdrop, mobile-friendly stacked buttons) */}
        <AnimatePresence>
          {showPreviewModal && previewPhoto && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 overflow-y-auto">
              {/* heavy blur backdrop */}
              <div className="absolute inset-0 bg-black/50" style={{ backdropFilter: "blur(18px) saturate(140%)", WebkitBackdropFilter: "blur(18px) saturate(140%)" }} onClick={() => setShowPreviewModal(false)} />

              <div className="relative z-10 w-full max-w-[95vw] mx-auto mt-16 mb-16">
                <div className="rounded-2xl overflow-hidden bg-surface-light dark:bg-surface-dark p-3" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => setShowPreviewModal(false)} className="absolute top-3 right-3 z-20 p-2 bg-black/40 rounded-full text-white m-3"><X size={20} /></button>

                  {previewPhoto.mediaType === "video" ? (
                    <video src={previewPhoto.Url} controls className="w-full max-h-[72vh] object-contain rounded" />
                  ) : (
                    <img src={previewPhoto.Url} alt={previewPhoto.title} className="w-full max-h-[72vh] object-contain rounded" />
                  )}

                  <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <div className="text-lg font-semibold text-text-primaryLight dark:text-text-primaryDark">{previewPhoto.title}</div>
                      <div className="text-xs text-text-secondaryLight dark:text-secondaryDark mt-1 flex items-center gap-2">
                        <User size={12} /> {previewPhoto.postedBy?.name || "Unknown"} • <Calendar size={12} /> {new Date(previewPhoto.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                      <button onClick={() => handleDownloadPhoto(previewPhoto)} className="w-full sm:w-auto px-4 py-2 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2">
                        <Download size={16} /> Download
                      </button>
                      <button onClick={() => sharePhoto(previewPhoto)} className="w-full sm:w-auto px-4 py-2 h-10 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center gap-2">
                        <Share2 size={16} /> Share
                      </button>
                      <button onClick={() => { const wa = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${previewPhoto.title}\n\n${previewPhoto.Url}`)}`; window.open(wa, "_blank"); }} className="w-full sm:w-auto px-4 py-2 h-10 bg-[#25D366] hover:opacity-95 text-white rounded-lg flex items-center justify-center gap-2">
                        <Share2 size={16} /> WhatsApp
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* NotificationModel for confirms and toasts */}
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

export default TeacherPhotoGallery;
