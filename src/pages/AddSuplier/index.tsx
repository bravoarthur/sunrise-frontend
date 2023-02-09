import {useState} from 'react'
import styles from "./AddSuplier.module.scss"
import useApi from '../../helpers/SunriseAPI'



type ErrorType = {
    param: string,
    msg: string
}


function AddSuplier() {

    const api = useApi    

    const [name, setName] = useState('')    
    const [disabled, setDisabled] = useState(false)
    const [error, setError] = useState({} as ErrorType)
    const [success, setSuccess] = useState('')
        

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

        event.preventDefault()
        setDisabled(true) 
        setError({} as ErrorType)       

        const json = await api.addSuplier(name)

        if(json.error) {
            setError(json.error[0])            
            setDisabled(false)
            return
        } else {            
            setDisabled(false)
            setName('')            
            setSuccess('Product Added Successfully')  
            setTimeout(() => {
                setSuccess('')
            },5000)             
        }
    }




    return (  

        <div className={styles.pageContainer}>

            <div className={styles.pageTitle}> <h1>Add New Suplier</h1></div>

            <div className={styles.pageArea} >
                {error.param && 
                <div className={styles.errorMessage}>
                    {`${error.param} error - ${error.msg}`}
                </div>
                }

                {success && 
                <div className={styles.successMessage}>
                    {`${success}`}
                </div>
                }
                <form onSubmit={handleSubmit}>   

                    <label className={styles.area}>
                        <div className={styles.areatitle}>Name </div>
                        <div className={styles.areainput}>
                            <input type="text" required disabled={disabled} value={name} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setName(event.target.value)}/>
                        </div>
                    </label>                    
                    
                    <div className={styles.area}>
                        <div className={styles.areatitle}></div>
                        <div className={styles.areainput}>
                            <button disabled={disabled}>ADD ITEM</button>
                        </div>
                    </div>
                </form>
            </div >
            
        </div >
    );
}

export default AddSuplier;