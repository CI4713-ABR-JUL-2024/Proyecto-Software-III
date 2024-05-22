'use client';
import React from 'react'

interface ButtonProps {
  name: string;
}

const Button: React.FC<ButtonProps> = ({ name }) => {
  return (
    <div>        
        <button onClick={()=> console.log('Logged')}>{name}</button>
    </div>
  )
}

export default Button