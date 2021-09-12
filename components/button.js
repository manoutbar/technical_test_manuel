import classNames from 'classnames';
import styles from '../styles/Button.module.scss';

export default function Button(props) {
  const { childrem, className } = props;

  return (<button className={ classNames(styles.button, className) }>
    { children }
  </button>)

}