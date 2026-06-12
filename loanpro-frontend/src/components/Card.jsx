import './Card.css';

/**
 * Reusable Card component for stats, info panels, etc.
 */
function Card({ children, title, subtitle, icon, className = '', onClick }) {
  return (
    <div
      className={`card ${onClick ? 'card--clickable' : ''} ${className}`}
      onClick={onClick}
    >
      {(title || icon) && (
        <div className="card__header">
          {icon && <span className="card__icon">{icon}</span>}
          <div>
            {title && <h3 className="card__title">{title}</h3>}
            {subtitle && <p className="card__subtitle">{subtitle}</p>}
          </div>
        </div>
      )}
      <div className="card__body">{children}</div>
    </div>
  );
}

export default Card;
