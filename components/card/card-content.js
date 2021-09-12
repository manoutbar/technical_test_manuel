import classNames from 'classnames';
import styles from '../../styles/Card.module.scss';

export default function CardContent({ fullWidth, className, children }) {
  return (
    <div className={ classNames(styles.cardContent, className, {
      [styles.fw]: fullWidth === true
    }) }>
      { children }
    </div>
  )
}