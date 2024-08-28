const Button = ({ value, handleGetValue }) => {
  return <button className="btn" onClick={handleGetValue}>{value}</button>;
};

export default Button;
