const Button = ({ children, color }) => {
  return (
    <button className={`button${color ? ` button--${color}` : ""}`}>
      {children}
    </button>
  );
};

export default Button;
