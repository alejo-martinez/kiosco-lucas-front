const Input = ({ type, placeholder, icon, onChange, value, onKeyDown, name }) => {
  // console.log(icon);

  return (
    <div className="input">
      {icon && <span>{icon}</span>}
      <input type={type} placeholder={placeholder} onChange={onChange} onKeyDown={onKeyDown} value={value} name={name}/>
    </div>
  );
};

export default Input;
