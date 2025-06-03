const Tooltip = ({ children, component }) => {
  return (
    <div className="tooltip">
      {children}
      <div className="tooltip__component">
        <p>{component}</p>
      </div>
    </div>
  );
};

export default Tooltip;
