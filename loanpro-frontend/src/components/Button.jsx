
import './Button.css';

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', // 'primary', 'secondary', or 'outline'
  disabled = false,
  className = ''
}) => {
  return (
    <button 
      type={type} 
      onClick={onClick} 
      disabled={disabled}
      className={`loanpro-btn loanpro-btn-${variant} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;