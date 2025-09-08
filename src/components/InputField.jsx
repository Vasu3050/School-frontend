export default function InputField({ label, type = "text", placeholder, value, onChange, error }) {
  return (
    <div className="flex flex-col">
      {label && <label className="mb-1 text-sm font-medium text-text-primaryLight dark:text-text-primaryDark">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark
          ${error ? "border-danger-light dark:border-danger-dark" : "border-neutral-light dark:border-neutral-dark"}
          bg-surface-light dark:bg-surfaceAlt-dark text-text-primaryLight dark:text-text-primaryDark`}
      />
      {error && <span className="mt-1 text-sm text-danger-light dark:text-danger-dark">{error}</span>}
    </div>
  );
}