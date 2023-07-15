import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main>
      <nav>
          <div className="navbar">
            <Link href="/" legacyBehavior>
              <a className="logo" data-legacy-link >TrickTrove</a>
            </Link>
            <div className="nav-links">
              <Link href="/about" legacyBehavior>
                <a  data-legacy-link>About</a>
              </Link>
              <Link href="/tricktree" legacyBehavior>
                <a  data-legacy-link>TrickTree</a>
              </Link>
              <Link href="/spotmap" legacyBehavior>
                <a  data-legacy-link>Spot Map</a>
              </Link>
              <Link href="/explore" legacyBehavior>
                <a  data-legacy-link>Explore</a>
              </Link>
              <Link href="/signin" legacyBehavior>
                <a  data-legacy-link>Sign In</a>
              </Link>
              <Link href="/signup" legacyBehavior>
                <a  data-legacy-link>Sign Up</a>
              </Link>
            </div>
          </div>
        </nav>
    </main>
  )
}
