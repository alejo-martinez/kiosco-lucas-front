const Card = ({ children, className, keyId }) => {
  return (
    <div className={`card${className ? ` ${className}` : ""}`} key={keyId}>{children}</div>
  );
};

export default Card;
