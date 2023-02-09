import {useState, useEffect} from 'react'
import styles from "./AddCategory.module.scss"
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

type CategoriesType = {
    _id: string,
    name: string,
    slug: string
}


function AddCategory() {

    const api = useApi()    

    const [name, setName] = useState('')    
    const [disabled, setDisabled] = useState(false)
    const [error, setError] = useState({} as ErrorType)
    const [success, setSuccess] = useState('')
        

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

        event.preventDefault()
        setDisabled(true) 
        setError({} as ErrorType)       

        const json = await api.addCategory(name)

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

            <div className={styles.pageTitle}> <h1>Add New Product</h1></div>

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

export default AddCategory;