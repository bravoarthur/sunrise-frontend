import {useState, useEffect} from 'react'
import { doLogin } from "../../helpers/authHandler";
import {useNavigate} from 'react-router-dom'
import styles from "./SignIn.module.scss"
import useApi from '../../helpers/SunriseAPI'

type JsonType = {
    error?: any
    email?: string,
    token?: string,
}

type ErrorType = {
    param: string,
    msg: string
}


function SignIn() {

    const api = useApi()
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rememberPass, setRememberPass] = useState(false)

    const [disabled, setDisabled] = useState(false)
    const [error, setError] = useState({} as ErrorType)


    
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

        event.preventDefault()
        setDisabled(true)
        setError({} as ErrorType)

        const json = await api.login(email, password)   as JsonType 
        
        if(json.error) {
            setError(json.error[0])            
            setDisabled(false)
            return
        } else {
            doLogin(json.token!, rememberPass)
            setDisabled(false)
            navigate('/')   
            navigate(0)        
        }
    }


    return (  

        <div className={styles.pageContainer}>

            <h1 className={styles.pageTitle}>Login</h1>
            <div className={styles.signArea}>
                {error.param && 
                <div className={styles.errorArea}>
                    {`Error - ${error.msg}`}
                </div>
                }
                <form onSubmit={handleSubmit}>                
                    <label className={styles.area}>
                        <div className={styles.areatitle}>E-mail</div>
                        <div className={styles.areainput}>
                            <input type="email" required disabled={disabled} value={email} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}/>
                        </div>
                    </label>
                    <label className={styles.area}>
                        <div className={styles.areatitle}>Password</div>
                        <div className={styles.areainput}>
                            <input type="password" required disabled={disabled} value={password} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}/>
                        </div>
                    </label>
                    <label className={styles.area}>
                        <div className={styles.areatitle}>Remember Password</div>
                        <div className={styles.areainput}>
                            <input className='chkbox'type="checkbox" disabled={disabled} checked={rememberPass} onChange={() => setRememberPass(!rememberPass)}/>
                        </div>
                    </label>
                    <div className={styles.area}>
                        <div className={styles.areatitle}></div>
                        <div className={styles.areainput}>
                            <button disabled={disabled}>Log In</button>
                        </div>
                    </div>
                </form>
            </div>
            
        </div>
    );
}

export default SignIn;