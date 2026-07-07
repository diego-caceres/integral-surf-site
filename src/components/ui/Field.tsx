interface FieldProps {
  label: string;
  name?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: "text" | "number";
  textarea?: boolean;
  required?: boolean;
  placeholder?: string;
}

/**
 * Labeled input/textarea used by TripForm — collapses the ~15-line
 * label+input markup that was repeated for every field in the old
 * create/edit trip forms into one call.
 */
export function TextField({
  label,
  name,
  value,
  onChange,
  type = "text",
  textarea = false,
  required = false,
  placeholder,
}: FieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {textarea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full p-2 border rounded h-32"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full p-2 border rounded"
        />
      )}
    </div>
  );
}
