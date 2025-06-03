const Input = ({ type, placeholder, icon }) => {
  console.log(icon);

  return (
    <div className="input">
      {icon && <span>{icon}</span>}
      <input type={type} placeholder={placeholder} />
    </div>
  );
};

export default Input;
