const Button = ({ children, color, onClick }) => {
  return (
    <button className={`button${color ? ` button--${color}` : ""}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
