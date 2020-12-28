import React, { useState } from 'react'
import { Link, withPrefix } from 'gatsby'

export const Navbar = React.memo(() => {
  const [isBurgerActive, setBurgerActive] = useState(false)

  return (
    <nav className='navbar' role='navigation' aria-label='main navigation'>
      <div className='container'>
        <div className='navbar-brand'>
          <a className='navbar-item' href='https://www.chenhuojun.com' title='CHENHUOJUN'>
            <img
              src={withPrefix('/img/favicon/favicon-96x96.png')}
              width='28'
              height='28'
            />
          </a>

          <a
            role='button'
            className={`navbar-burger burger${
              isBurgerActive ? ' is-active' : ''
            }`}
            aria-label='menu'
            aria-expanded='false'
            onClick={() => setBurgerActive(prevIsActive => !prevIsActive)}
          >
            <span aria-hidden='true' />
            <span aria-hidden='true' />
            <span aria-hidden='true' />
          </a>
        </div>

        <div className={`navbar-menu${isBurgerActive ? ' is-active' : ''}`}>
          <div className='navbar-start has-text-centered'>
            <Link className='navbar-item' to='/'>
              Home
            </Link>
            <Link className='navbar-item' to='/archives'>
              Archives
            </Link>
            <Link className='navbar-item' to='/about'>
              About
            </Link>
          </div>
          <div className='navbar-end'>
            <div className='is-flex is-justified-center'>
              <a
                className='navbar-item is-inline-flex-mobile'
                href={withPrefix('/rss.xml')}
                target='_blank'
                title='RSS Feed'
                rel='nofollow noreferrer noopener'
              >
                <svg viewBox='0 0 455.731 455.731' width='28' height='28'>
                  <path
                    fill='#f78422'
                    d='M0 0h455.731v455.731H0z M296.208 159.16C234.445 97.397 152.266 63.382 64.81 63.382v64.348c70.268 0 136.288 27.321 185.898 76.931 49.609 49.61 76.931 115.63 76.931 185.898h64.348c-.001-87.456-34.016-169.636-95.779-231.399z M64.143 172.273v64.348c84.881 0 153.938 69.056 153.938 153.939h64.348c0-120.364-97.922-218.287-218.286-218.287z M63.745,346.26a46.088,46.088 0 1,0 92.176,0a46.088,46.088 0 1,0 -92.176,0'
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
})

export default Navbar
