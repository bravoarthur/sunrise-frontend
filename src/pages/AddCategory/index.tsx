import {useState} from 'react'
import styles from "./AddCategory.module.scss"
import useApi from '../../helpers/SunriseAPI'
import { ErrorType } from '../../types/types'

function AddCategory() {

    const api = useApi    

    const [name, setName] = useState('')    
    const [disabled, setDisabled] = useState(false)
    const [error, setError] = useState({} as ErrorType)
    const [success, setSuccess] = useState('')
        

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

        event.preventDefault()
        setDisabled(true) 
        setError({} as ErrorType)       

        const json = await api.addCategory(name)
        console.log(json)
        if(json.error) {
            setError(json.error[0])            
            setDisabled(false)
            return
        } else {            
            setDisabled(false)
            setName('')            
            setSuccess('Category Added Successfully')  
            setTimeout(() => {
                setSuccess('')
            },5000)             
        }
    }




    return (  

        <div className={styles.pageContainer}>

            <h1 className={styles.pageTitle}>Add New Category</h1>      

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
                            <input data-testid='inputAddCategory' type="text" required disabled={disabled} value={name} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setName(event.target.value)}/>
                        </div>
                    </label>                    
                    
                    <div className={styles.areaButton}>
                        
                            <button disabled={disabled}>ADD CATEGORY</button>
                        
                    </div>
                </form>
            </div >
            
        </div >
    );
}

export default AddCategory;