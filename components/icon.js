import classNames from 'classnames';
import 'material-design-icons/iconfont/material-icons.css';
import styles from '../styles/Icon.module.scss';

export default function Icon(props) {
  const { children, disabled, size = null } = props;
  return (
    <i aria-hidden="true" className={ classNames('material-icons', styles.icon, {
      'md-inactive': disabled == true,
      [`md-${size}`]: typeof size === 'number' && [18, 24, 36, 48].includes(size),
    }) }>
      { children }
    </i>
  );
}