import classNames from 'classnames';
import styles from '../../styles/Card.module.scss';

export default function Card({ maxWidth, maxHeight, minWidth, minHeight, children, className }) {
  return (
    <div
      className={ classNames(styles.card, className) }
      style={{ maxWidth, maxHeight, minWidth, minHeight }}
    >{ children }</div>
  );
}