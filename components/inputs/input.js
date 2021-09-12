import classNames from 'classnames';
import styles from '../../styles/Input.module.scss';

export default function Input(props) {
  const { label, focus, children } = props;

  return (
    <div className={ classNames(styles.input, props.className) }>
      { label &&  (
      <label className={ classNames(styles.label, styles.animated, styles.labelFormControl, {
        [styles.shrink] : focus
      }) }>
        { label }
       </label>
      )}
      <div className={ styles.inputBase }>
        { children }
      </div>
    </div>

  )
}