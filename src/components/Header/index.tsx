import styles from './Header.module.scss'
import {Link} from 'react-router-dom'
import { doLogout, isLogged } from '../../helpers/authHandler'

function Header() {

    let logged = isLogged()

    const handleLogOut = () => {
        doLogout()
        window.location.href = '/'               
    }


    return (

        <div className={styles.headerArea}>
            <div className={styles.container}>
                <div className={styles.logo}>
                    <Link to='/'>
                        <span className={styles.logo1}>Sunrise</span>
                        

                    </Link>
                </div>
                <nav>
                    <ul>
                        {logged &&

                            <>
                                <li>
                                    <Link to="">My Account</Link>
                                </li>
                                <li>
                                    <button onClick={handleLogOut}>Logout</button>
                                </li>   
                                <li>
                                    <Link to="/neworder" className={styles.sellButton}>NEW ORDER</Link>
                                </li>
                            </>
                        
                        }

                        {!logged &&

                            <>
                                <li>
                                    <Link to="./signin">Sign In</Link>
                                </li>
                                <li>
                                    <Link to="./signup">Sign Up</Link>
                                </li>
                            </>
                        }
                        
                    </ul>
                </nav>
            </div>

        </div>
    );
}

export default Header;