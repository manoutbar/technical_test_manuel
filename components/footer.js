import Link from 'next/link';
import classNames from 'classnames';
import styles from '../styles/Footer.module.scss';

export default function Footer() {
  return (
    <footer className={ classNames(styles.appFooter, "py-8") }>
      <div className="flex flex-column sm:flex-row justify-around">
        <p className="m-0">World Kart Championship @ 2021</p>
        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/drivers/showcase">Showcase</Link></li>
        </ul>
      </div>
    </footer>
  )
}