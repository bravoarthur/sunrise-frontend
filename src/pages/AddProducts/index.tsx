import {useState, useEffect} from 'react'
import styles from "./AddProducts.module.scss"
import useApi from '../../helpers/SunriseAPI'


type ErrorType = {
    param: string,
    msg: string
}

/*type ProductType = {
    category: string;
    name: string;
    unit: "Kg" | 'Bag' | 'Tray' | 'Box' | 'Unit' | 'Default';
    image: string;    
};*/

type CategoriesType = {
    _id: string,
    name: string,
    slug: string
}



function AddProducts() {

    const api = useApi       

    const [name, setName] = useState('')
    const [unit, setUnit] = useState('')   
    const [productCategorie, setProductCategorie] = useState('')
    const [img, setImg] = useState<File | undefined>(undefined) 
    const [disabled, setDisabled] = useState(false)
    const [error, setError] = useState({} as ErrorType)
    const [success, setSuccess] = useState('')
    const [categories, setCategories] = useState([] as CategoriesType[])    
    //const [masterPass, setMasterPass] = useState('')

    const units = ["Kg", 'Bag', 'Tray', 'Box', 'Unit','Default']
    
    useEffect(() => {
        const getCats = async () => {
            const catlist: CategoriesType[] = await  api.getCategories()            
            setCategories(catlist)
        }
        getCats()
    }, [api])    

    

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

        event.preventDefault()
        setDisabled(true) 
        setError({} as ErrorType)  
        
        const dataForm = new FormData()

        if(img) {
            dataForm.append('img', img)
            dataForm.append('unit', unit)
            dataForm.append('newProduct', name)
            dataForm.append('category', productCategorie)

            console.log(img)
            console.log(dataForm)
           
        } else {
            dataForm.append('unit', unit)
            dataForm.append('newProduct', name)
            dataForm.append('category', productCategorie)

            console.log('SEM IMAGEM')
            console.log(dataForm)
        }

        const json = await api.addProduct(dataForm)

        if(json.error) {
            setError(json.error[0])           
            setDisabled(false)
            return
        } else {            
            setDisabled(false)
            setName('')
            setUnit('')
            setProductCategorie('')
            setSuccess('Product Added Successfully')  
            setTimeout(() => {
                setSuccess('')
            },5000)             
        }
    }

    return (  

        <div className={styles.pageContainer}>

            <h1 className={styles.pageTitle}>Add New Product</h1>

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


                    <label className={styles.area}>
                        <div className={styles.areatitle}>Unit</div>
                        <div className={styles.areainput}>
                            <select required disabled={disabled} value={unit} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setUnit(event.target.value)}>
                                <option></option>
                                {units.map((item, index) => <option value={item} key={index}>{item}</option>)}


                            </select>
                        </div>
                    </label>                    
                    <label className={styles.area}>
                        <div className={styles.areatitle}>Category</div>
                        <div className={styles.areainput}>
                            <select required disabled={disabled} value={productCategorie} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setProductCategorie(event.target.value)}>
                                <option></option>
                                {categories.map((item, index) => <option value={item._id} key={index}>{item.name}</option>)}
                            </select>
                        </div>
                    </label>
                    <label className={styles.area}>
                        <div className={styles.areatitle}>Image</div>
                        <div className={styles.areainput}>
                            <input type="file" disabled={disabled} accept='image/jpeg' onChange={(event: React.ChangeEvent<HTMLInputElement>) => setImg(event?.currentTarget?.files?.[0])} />
                        </div>
                    </label>
                    
                    <div className={styles.areaButton}>                        
                        
                        <button disabled={disabled}>ADD ITEM</button>
                        
                    </div>
                </form>
            </div >
            
        </div >
    );
}

export default AddProducts;