
import { useState } from 'react';
import styles from '../../styles/TextField.module.scss';
import Input from './input';

export default function TextField(props) {
  const { 
    label, disabled, onChange, onKeyPress, 
    value, className 
  } = props;
  
  const [ focussed, setFocussed ] = useState(false);

  const changeEventHandler = (evt) => {
    if (typeof onChange === 'function') {
      onChange(evt);
    }
  }
  return (
    <Input label={ label } focus={ focussed } className={ className }>
      <input 
        type="text"
        aria-invalid="false"
        disabled= { disabled }
        value={ value }
        className={ styles.textField }
        onChange={ changeEventHandler }
        onFocus={ () => setFocussed(true) }
        onKeyPress={ (evt) => typeof onKeyPress === 'function' && onKeyPress(evt) }
        onBlur={ () => {
          console.log('value', value);
          setFocussed(value !== '')
        } }
      />
    </Input>
  )
}