import './Input.css';

// We pass in props so we can reuse this component anywhere
const Input = ({ 
  label, 
  type = 'text', // Defaults to text if not specified
  placeholder, 
  value, 
  onChange, 
  name,
  required = false
}) => {
  return (
    <div className="input-group">
      {/* Only render the label if one is provided */}
      {label && (
        <label className="input-label" htmlFor={name}>
          {label} {required && <span className="required-star">*</span>}
        </label>
      )}
      
      <input
        className="loanpro-input"
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
};

export default Input;