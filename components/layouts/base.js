import classNames from 'classnames';
import Header from '../header';
import Footer from '../footer';

import styles from '../../styles/BaseLayout.module.scss'

export default function BaseLayout({ title, className, children }) {
  return (
    <>
      <Header title={ title } />
      <div className={ classNames(styles.root, className) }>
        { children }
      </div>
      <Footer />
    </>
  );
}