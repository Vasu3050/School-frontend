// src/pages/Admin/AcademicYear.jsx
import React, { useEffect, useState } from "react";
import {
  getAllAcademicYears,
  createAcademicYear,
  updateAcademicYear,
  deleteAcademicYear,
} from "../../api/academicYearApi.js";
import NotificationModal from "../../components/NotificationModel.jsx";

// Helper: format Date -> DD-MM-YYYY
const formatDate = (d) => {
  if (!d) return "";
  const date = new Date(d);
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};

const emptyForm = {
  name: "",
  startDate: "",
  endDate: "",
  isActive: false,
};

export default function AcademicYear() {
  const [loading, setLoading] = useState(false);
  const [years, setYears] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [topNotification, setTopNotification] = useState({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
    autoClose: true,
  });

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [confirmProps, setConfirmProps] = useState({ isOpen: false });
  const [openRowMenu, setOpenRowMenu] = useState(null);

  // track pending request id for optimistic actions
  const [pendingActionId, setPendingActionId] = useState(null);

  useEffect(() => {
    fetchYears();
  }, []);

  const extractBackendMessage = (err) => {
    // Prefer structured backend message if available
    const resp = err?.response?.data;
    if (resp) {
      // If your ApiResponse uses { status, data, message }
      if (typeof resp.message === "string" && resp.message.trim()) return resp.message;
      // sometimes backend returns error string/object directly
      if (typeof resp === "string" && resp.trim()) return resp;
      if (typeof resp === "object") {
        // try common fields
        if (resp.error) return String(resp.error);
        if (resp.msg) return String(resp.msg);
        if (resp.data && typeof resp.data === "string") return resp.data;
        // fallback to JSON
        try {
          return JSON.stringify(resp);
        } catch {
          // ignore
        }
      }
    }
    // fallback to thrown error message
    if (err?.message) return err.message;
    return "Unknown error from server.";
  };

  const openNotification = (type, title, message, options = {}) => {
    setTopNotification({
      isOpen: true,
      type,
      title,
      message,
      autoClose: options.autoClose ?? true,
    });
  };

  const closeNotification = () => {
    setTopNotification((p) => ({ ...p, isOpen: false }));
  };

  const fetchYears = async () => {
    try {
      setLoading(true);
      const res = await getAllAcademicYears();
      // handle ApiResponse shape: res = { status, data, message }
      const payload = res?.data ?? res?.data ?? res;
      // payload.data might be the array if ApiResponse.data contains object with data/meta
      let rows = [];
      if (Array.isArray(payload)) rows = payload;
      else if (Array.isArray(payload?.data)) rows = payload.data;
      else if (Array.isArray(res?.data?.data)) rows = res.data.data;
      else if (Array.isArray(res?.data)) rows = res.data;
      setYears(Array.isArray(rows) ? rows.sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt)) : []);
    } catch (err) {
      const msg = extractBackendMessage(err);
      openNotification("error", "Fetch failed", msg);
    } finally {
      setLoading(false);
    }
  };

  // Add / Edit handlers
  const openAdd = () => {
    setFormMode("add");
    setFormData(emptyForm);
    setEditingId(null);
    setFormOpen(true);
  };

  const openEdit = (year) => {
    setFormMode("edit");
    setEditingId(year._id);
    setFormData({
      name: year.name,
      startDate: year.startDate ? new Date(year.startDate).toISOString().slice(0, 10) : "",
      endDate: year.endDate ? new Date(year.endDate).toISOString().slice(0, 10) : "",
      isActive: Boolean(year.isActive),
    });
    setFormOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const { name, startDate, endDate, isActive } = formData;
    if (!name || !startDate || !endDate) {
      openNotification("error", "Validation", "Name, start date and end date are required.");
      return;
    }

    // Show processing notification immediately (keeps user informed)
    openNotification("info", formMode === "add" ? "Creating…" : "Updating…", "Please wait — processing request.", { autoClose: false });

    try {
      setLoading(true);
      if (formMode === "add") {
        await createAcademicYear({ name, startDate, endDate, isActive });
        openNotification("success", "Created", "Academic year created successfully.");
      } else {
        await updateAcademicYear({ id: editingId, formData: { name, startDate, endDate, isActive } });
        openNotification("success", "Updated", "Academic year updated successfully.");
      }
      setFormOpen(false);
      await fetchYears();
    } catch (err) {
      const msg = extractBackendMessage(err);
      openNotification("error", "Save failed", msg);
    } finally {
      setLoading(false);
    }
  };

  // Activate: optimistic update for quick UI feedback
  const handleActivate = async (id) => {
    // if already pending, ignore
    if (pendingActionId) return;

    // optimistic local update: mark the chosen year active and others inactive
    const prev = [...years];
    const optimistic = years.map((y) => ({ ...y, isActive: y._id === id }));
    setYears(optimistic);
    setPendingActionId(id);
    // show a small processing notification (non-auto-close)
    openNotification("info", "Activating", "Activating academic year...", { autoClose: false });

    try {
      await updateAcademicYear({ id, formData: { isActive: true } });
      openNotification("success", "Activated", "Academic year activated.");
      await fetchYears(); // ensure canonical state from server
    } catch (err) {
      // revert optimistic
      setYears(prev);
      const msg = extractBackendMessage(err);
      openNotification("error", "Activation failed", msg);
    } finally {
      setPendingActionId(null);
      setLoading(false);
    }
  };

  const confirmDeleteSingle = (id, name) => {
    setConfirmProps({
      isOpen: true,
      type: "confirm",
      title: "Confirm deletion",
      message: `Delete academic year "${name}"? This cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      onClose: () => setConfirmProps((p) => ({ ...p, isOpen: false })),
      onConfirm: async () => {
        openNotification("info", "Deleting", "Deleting... please wait.", { autoClose: false });
        try {
          setLoading(true);
          await deleteAcademicYear(id);
          openNotification("success", "Deleted", "Academic year deleted.");
          await fetchYears();
        } catch (err) {
          const msg = extractBackendMessage(err);
          openNotification("error", "Delete failed", msg);
        } finally {
          setLoading(false);
          setConfirmProps((p) => ({ ...p, isOpen: false }));
        }
      },
    });
  };

  const confirmDeleteSelected = () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) {
      openNotification("warning", "No selection", "Select at least one academic year to delete.");
      return;
    }
    setConfirmProps({
      isOpen: true,
      type: "confirm",
      title: "Delete selected",
      message: `Delete ${ids.length} selected academic year(s)?`,
      confirmText: "Delete all",
      cancelText: "Cancel",
      onClose: () => setConfirmProps((p) => ({ ...p, isOpen: false })),
      onConfirm: async () => {
        openNotification("info", "Deleting", "Deleting selected items...", { autoClose: false });
        try {
          setLoading(true);
          await Promise.all(ids.map((id) => deleteAcademicYear(id)));
          openNotification("success", "Deleted", `${ids.length} academic year(s) deleted.`);
          setSelectedIds(new Set());
          await fetchYears();
        } catch (err) {
          const msg = extractBackendMessage(err);
          openNotification("error", "Delete failed", msg);
        } finally {
          setLoading(false);
          setConfirmProps((p) => ({ ...p, isOpen: false }));
        }
      },
    });
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const clone = new Set(prev);
      if (clone.has(id)) clone.delete(id);
      else clone.add(id);
      return clone;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === years.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(years.map((y) => y._id)));
    }
  };

  const handleRefresh = async () => {
    openNotification("info", "Refreshing", "Refreshing list...", { autoClose: false });
    try {
      await fetchYears();
      openNotification("success", "Refreshed", "List refreshed.");
    } catch (err) {
      const msg = extractBackendMessage(err);
      openNotification("error", "Refresh failed", msg);
    }
  };

  // UI color changes: use semantic surface/text classes to be dark-mode friendly
  return (
    <div className="w-full px-4 py-6 flex flex-col flex-1">
      {/* Header controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={openAdd}
            disabled={loading}
            className="rounded-xl px-4 py-2 bg-primary-light text-white font-medium shadow hover:opacity-95 disabled:opacity-60"
          >
            Add Academic Year
          </button>

          <button
            onClick={handleRefresh}
            disabled={loading}
            className="rounded-xl px-4 py-2 bg-surface-light dark:bg-surface border border-neutral-light text-text-primaryLight dark:text-text.primaryDark font-medium shadow hover:opacity-95 disabled:opacity-60"
          >
            Refresh
          </button>

          <button
            onClick={confirmDeleteSelected}
            disabled={selectedIds.size === 0 || loading}
            className={`rounded-xl px-4 py-2 ml-2 ${selectedIds.size ? "bg-danger-light text-white" : "bg-gray-100 text-gray-700"} font-medium disabled:opacity-60`}
          >
            Delete Selected ({selectedIds.size})
          </button>
        </div>

        <div className="text-sm text-text.secondaryLight dark:text-text.secondaryDark">
          Total: <span className="font-medium text-text.primaryLight dark:text-text.primaryDark">{years.length}</span>
        </div>
      </div>

      {/* Table / List */}
      <div className="bg-surface-light dark:bg-surface p-4 rounded-xl shadow flex-1 overflow-auto">
        {loading ? (
          <div className="py-10 text-center text-text.mutedLight dark:text-text.mutedDark">Loading...</div>
        ) : years.length === 0 ? (
          <div className="py-10 text-center text-text.mutedLight dark:text-text.mutedDark">No academic years found.</div>
        ) : (
          <div className="w-full">
            <div className="hidden md:grid grid-cols-12 gap-4 items-center font-medium text-sm mb-3 px-2">
              <div className="col-span-1">
                <input type="checkbox" checked={selectedIds.size === years.length} onChange={toggleSelectAll} />
              </div>
              <div className="col-span-3 text-text.primaryLight dark:text-text.primaryDark">Name</div>
              <div className="col-span-2 text-text.primaryLight dark:text-text.primaryDark">Start</div>
              <div className="col-span-2 text-text.primaryLight dark:text-text.primaryDark">End</div>
              <div className="col-span-2 text-text.primaryLight dark:text-text.primaryDark">Status</div>
              <div className="col-span-2 text-right text-text.primaryLight dark:text-text.primaryDark">Actions</div>
            </div>

            {years.map((y) => (
              <div
                key={y._id}
                className="flex flex-col md:grid md:grid-cols-12 md:items-center gap-3 py-3 px-2 border-b last:border-b-0"
              >
                <div className="col-span-1 flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(y._id)}
                    onChange={() => toggleSelect(y._id)}
                  />
                </div>

                <div className="col-span-3">
                  <div className="font-medium text-sm text-text.primaryLight dark:text-text.primaryDark">{y.name}</div>
                  <div className="text-xs text-text.secondaryLight dark:text-text.secondaryDark hidden md:block">{/* optional */}</div>
                </div>

                <div className="col-span-2 text-sm text-text.secondaryLight dark:text-text.secondaryDark">{formatDate(y.startDate)}</div>
                <div className="col-span-2 text-sm text-text.secondaryLight dark:text-text.secondaryDark">{formatDate(y.endDate)}</div>

                <div className="col-span-2">
                  {y.isActive ? (
                    <span className="inline-block px-3 py-1 rounded-full text-xs bg-accent-light text-white">Active</span>
                  ) : (
                    <span className="inline-block px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700">Inactive</span>
                  )}
                </div>

                {/* Actions - desktop */}
                <div className="col-span-2 flex items-center justify-end space-x-2">
                  <div className="hidden md:flex items-center gap-2">
                    <button
                      onClick={() => openEdit(y)}
                      className="px-3 py-1 rounded-lg border text-sm bg-surface-light dark:bg-surface text-text.primaryLight dark:text-text.primaryDark"
                      disabled={loading}
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleActivate(y._id)}
                      disabled={Boolean(pendingActionId)}
                      className={`px-3 py-1 rounded-lg text-sm ${y.isActive ? "bg-gray-200 text-text.secondaryLight" : "bg-primary-light text-white"}`}
                    >
                      {y.isActive ? (pendingActionId === y._id ? "Processing..." : "Active") : (pendingActionId === y._id ? "Processing..." : "Activate")}
                    </button>

                    <button
                      onClick={() => confirmDeleteSingle(y._id, y.name)}
                      disabled={loading}
                      className="px-3 py-1 rounded-lg bg-danger-light text-white text-sm"
                    >
                      Delete
                    </button>
                  </div>

                  {/* Mobile 3-dot menu */}
                  <div className="md:hidden relative">
                    <button
                      onClick={() => setOpenRowMenu((prev) => (prev === y._id ? null : y._id))}
                      className="p-2 rounded-full hover:bg-gray-100"
                      aria-label="menu"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </button>

                    {openRowMenu === y._id && (
                      <div className="absolute right-0 mt-2 w-44 bg-surface-light dark:bg-surface rounded-lg shadow-lg z-30">
                        <button
                          onClick={() => {
                            openEdit(y);
                            setOpenRowMenu(null);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            handleActivate(y._id);
                            setOpenRowMenu(null);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                        >
                          {y.isActive ? "Active" : "Activate"}
                        </button>
                        <button
                          onClick={() => {
                            confirmDeleteSingle(y._id, y.name);
                            setOpenRowMenu(null);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm text-danger-light"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Form Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setFormOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-surface-light dark:bg-surface rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-3 text-text.primaryLight dark:text-text.primaryDark">{formMode === "add" ? "Add Academic Year" : "Edit Academic Year"}</h3>

            <form onSubmit={handleFormSubmit} className="space-y-3">
              <div>
                <label className="block text-sm mb-1 text-text.secondaryLight dark:text-text.secondaryDark">Name (e.g. 2025-2026)</label>
                <input
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  className="w-full rounded-lg border px-3 py-2 bg-white dark:bg-surface text-text.primaryLight dark:text-text.primaryDark"
                  placeholder="2025-2026"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm mb-1 text-text.secondaryLight dark:text-text.secondaryDark">Start Date</label>
                  <input
                    value={formData.startDate}
                    onChange={(e) => setFormData((p) => ({ ...p, startDate: e.target.value }))}
                    type="date"
                    className="w-full rounded-lg border px-3 py-2 bg-white dark:bg-surface text-text.primaryLight dark:text-text.primaryDark"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-text.secondaryLight dark:text-text.secondaryDark">End Date</label>
                  <input
                    value={formData.endDate}
                    onChange={(e) => setFormData((p) => ({ ...p, endDate: e.target.value }))}
                    type="date"
                    className="w-full rounded-lg border px-3 py-2 bg-white dark:bg-surface text-text.primaryLight dark:text-text.primaryDark"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  id="isActive"
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData((p) => ({ ...p, isActive: e.target.checked }))}
                />
                <label htmlFor="isActive" className="text-sm text-text.secondaryLight dark:text-text.secondaryDark">Set this year active</label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setFormOpen(false)} className="px-4 py-2 rounded-lg bg-gray-100 text-text.primaryLight dark:text-text.primaryDark">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-primary-light text-white disabled:opacity-60">
                  {formMode === "add" ? (loading ? "Creating..." : "Create") : (loading ? "Saving..." : "Save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notification modal for success / error */}
      <NotificationModal
        isOpen={topNotification.isOpen}
        onClose={closeNotification}
        type={topNotification.type}
        title={topNotification.title}
        message={topNotification.message}
        autoClose={topNotification.autoClose}
      />

      {/* Confirm modal (delete single or multiple) */}
      <NotificationModal {...confirmProps} />
    </div>
  );
}