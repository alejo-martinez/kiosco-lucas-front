const Button = ({ children }) => {
  return (
    <label className="checkbox">
      <input type="checkbox" />
      {children}
    </label>
  );
};

export default Button;
