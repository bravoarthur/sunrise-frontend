import { useState } from 'react'
import { doLogin } from "../../helpers/authHandler";
import { useNavigate } from 'react-router-dom'
import styles from "./SignUp.module.scss"
import useApi from '../../helpers/SunriseAPI'
import { ErrorType } from '../../types/types';


function SignUp() {

    const api = useApi
    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPass, setConfirmPass] = useState('')
    const [disabled, setDisabled] = useState(false)
    const [error, setError] = useState({} as ErrorType)
    const [masterPass, setMasterPass] = useState('')



    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

        event.preventDefault()
        setDisabled(true)
        setError({} as ErrorType)

        if (password !== confirmPass) {
            setError({ param: 'password', msg: 'Password is different of confirmation password' })
            setDisabled(false)
            return
        }

        const json = await api.register(name, email, password, masterPass)

        if (json.error) {
            setError(json.error[0])
            setDisabled(false)
            return
        } else {
            doLogin(json.token!, false, json.user)
            setDisabled(false)
            navigate('/')
            navigate(0)
        }
    }


    return (

        <div className={styles.pageContainer}>
            <h1 className={styles.pageTitle}>Sign Up</h1>


            <div className={styles.pageArea} >
                {error.param &&
                    <div className={styles.errorMessage}>
                        {`${error.param} error - ${error.msg}`}
                    </div>
                }
                <form onSubmit={handleSubmit}>

                    <label className={styles.area}>
                        <div className={styles.areatitle}>Name </div>
                        <div className={styles.areainput}>
                            <input type="text" required disabled={disabled} value={name} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setName(event.target.value)} />
                        </div>
                    </label>


                    <label className={styles.area}>
                        <div className={styles.areatitle}>E-mail</div>
                        <div className={styles.areainput}>
                            <input type="email" required disabled={disabled} value={email} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)} />
                        </div>
                    </label>
                    <label className={styles.area}>
                        <div className={styles.areatitle}>MASTER PASSWORD</div>
                        <div className={styles.areainput}>
                            <input type="password" required disabled={disabled} value={masterPass} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setMasterPass(event.target.value)} />
                        </div>
                    </label>
                    <label className={styles.area}>
                        <div className={styles.areatitle}>Password</div>
                        <div className={styles.areainput}>
                            <input type="password" data-testid='passwordSignup' required disabled={disabled} value={password} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)} />
                        </div>
                    </label>
                    <label className={styles.area}>
                        <div className={styles.areatitle}>Confirm Password</div>
                        <div className={styles.areainput}>
                            <input type="password" data-testid='passwordConfirmSignup' required disabled={disabled} value={confirmPass} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setConfirmPass(event.target.value)} />
                        </div>
                    </label>
                    <div className={styles.areaButton}>

                        <button disabled={disabled} data-testid="buttonRegister">Sign Up</button>

                    </div>
                </form>
            </div >

        </div >
    );
}

export default SignUp;