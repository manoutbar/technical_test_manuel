import React from 'react';
import styles from '../styles/List.module.scss';

export default function List({ children }) {

  return (
    <ul className={ styles.list }>
      { React.Children.map(children, child => (<li className="gutters flexbox row">{ child }</li>)) }
    </ul>
  );

}