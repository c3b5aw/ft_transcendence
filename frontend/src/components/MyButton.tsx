import * as React from 'react'

interface Props {
  border: string;
  borderRadius: number;
  color: string;
  children?: React.ReactNode;
  height: string;
  onClick: () => void;
  width: string;
}

const Button: React.FC<Props> = ({ 
    border,
    borderRadius,
    color,
    children,
    height,
    onClick, 
    width
  }) => { 
  return (
    <button
      onClick={onClick}
      style={{
         backgroundColor: color,
         border,
         borderRadius,
         height,
         width
      }}
    >
    <h1>{children}</h1>
    </button>
  );
}

export default Button;