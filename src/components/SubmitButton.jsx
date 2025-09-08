export default function SubmitButton({ children, ...props }) {
  return (
    <button
      {...props}
      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
    >
      {children}
    </button>
  );
}
