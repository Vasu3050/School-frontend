
export default function InputField({ label, type="text", value, onChange, name, ...props }) {
    return (
      <div className="mb-4">
        <label className="block text-gray-700 mb-1">{label}</label>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
          {...props}
        />
      </div>
    );
  }
  