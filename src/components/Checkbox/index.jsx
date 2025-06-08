const Button = ({ children, checked, onChange }) => {
  return (
    <label className="checkbox">
      <input type="checkbox" checked={checked} onChange={onChange}/>
      {children}
    </label>
  );
};

export default Button;
