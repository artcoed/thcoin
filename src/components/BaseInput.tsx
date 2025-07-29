import React from 'react';
import styles from './BaseInput.module.css';

interface BaseInputProps {
    placeholder: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    readOnly?: boolean;
}

function BaseInput({ placeholder, value, onChange, readOnly }: BaseInputProps) {
  return (
      <>
        <input 
          className={styles.baseInput} 
          placeholder={placeholder} 
          type="text" 
          value={value}
          onChange={onChange}
          readOnly={readOnly}
        />
      </>
  );
}

export default BaseInput;