import classNames from 'classnames';
import styles from '../../styles/Card.module.scss';

export default function CardTitle({ children, className }) {
  return (<h2 className={ classNames(styles.cardTitle, className) }>{ children }</h2>);
}