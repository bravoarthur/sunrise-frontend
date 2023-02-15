import styles from './NewOrder.module.scss'
import useApi from '../../helpers/SunriseAPI'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { CategoriesType, ErrorType, ListType, ProductsType, SuplierType } from '../../types/types'



const NewOrder = () => {

    const api = useApi
            
    const [products, setProducts] = useState([] as ProductsType[])
    const [supliersList, setSupliersList] = useState([] as SuplierType[])
    const [list, setList] = useState([] as ListType[])
    const [description, setDescription] = useState('')
    const [suplier, setSuplier] = useState('')
    const [categories, setCategories] = useState([] as CategoriesType[])
    const [textFilter, setTextFilter] = useState('')
    const [catFilter, setCatFilter] = useState('')
    const [blocked, setBlocked] = useState(false)
    const [error, setError] = useState({} as ErrorType)
    const [success, setSuccess] = useState({
        param: '',
        msg: ''
    })
    const userAdmin = Cookies.get('user')
        
    useEffect(() => {
        const getProducts = async () => {
            const pList = await  api.getProductsList({q: textFilter, cat: catFilter})            
            setProducts(pList)
        }
        getProducts()
    }, [api, textFilter, catFilter])

    useEffect(() => {
        const getSupliersList = async () => {
            const supList = await  api.getSupliersList({})            
            setSupliersList(supList)
        }
        getSupliersList()
    }, [api])

    useEffect(() => {
        const getCategories = async () => {
            const catList = await  api.getCategories()            
            setCategories(catList)
        }
        getCategories()
    }, [api])


    console.log(list)

    const qtdHandler = (item: ProductsType, value:number) => {
        
        const verifier = list.findIndex(it => item.id===it.idProduct)
        if(verifier > -1) {
            const newList = list.map(item => item)

            if(value === 0) {  
                newList.splice(verifier, 1) 
                newList.sort((a,b) => {
                    return a.product < b.product ? -1 : a.product > b.product ? 1 : 0;
                });
                setList(newList)
            } else {
                newList[verifier].qtd = value
                newList.sort((a,b) => {
                    return a.product < b.product ? -1 : a.product > b.product ? 1 : 0;
                });
                setList(newList)
            }
            
        } else {

            if(value === 0) {
                return
            } else {
                const newItem: ListType = {idProduct: item.id,
                    product: item.name,
                    unit: item.unit,
                    qtd: value,
                    image: item.image,
                    divergent: false
                }
                const newList = list.map(item => item)
                newList.push(newItem)
                newList.sort((a,b) => {
                    return a.product < b.product ? -1 : a.product > b.product ? 1 : 0;
                });
                setList(newList)                       
            }
        }    
    }

    const handleSendOrder = async () => {

        setError({param: '', msg: ''})
        setBlocked(true)
        if(!userAdmin) {
            setError({param: 'User', msg: 'UserAdmin Invalid - Please login Again'})
            setBlocked(false)
            return
        }
        if(suplier ==='') {
            setError({param: 'Suplier', msg: 'Plese Select the Suplier'})
            setBlocked(false)
            return
        } 

        if(list.length === 0) {
            setError({param: 'Order', msg: 'The List is Empty - Select at Least one item'})
            setBlocked(false)
            return
        } 

        const json = await api.addOrder(userAdmin, suplier, list, description)

        if(json.error) {
            setError(json.error[0])
            setBlocked(false)
        } else {
            setSuccess({param: 'Order', msg: 'Order Created Successfully'})
            setTimeout(() => {
                setList([])
                setSuplier('')
                setDescription('') 
                setSuccess({param: '', msg: ''})
                setBlocked(false)
                window.location.reload();
            }, 2500)
        }
    }


    return (
        <div className={styles.pageContainer}>

            {
                error.param && 
                <div className={styles.errorMessage}>
                    {`${error.param} error - ${error.msg}`}
                </div>
            }

            {
                success.param && 
                <div className={styles.successMessage}>
                    {`${success.msg}`}
                </div>
            }

            <div className={styles.descSuplier}>

                <label className={styles.inputDesc}>
                    <div>Note: </div>
                    <div>
                        <input type="text" disabled={blocked} placeholder='Insert a note...'  value={description} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setDescription(event.target.value)}/>
                    </div>
                </label>
                <label className={styles.inputSuplier}>
                    <div>Select the Suplier: </div>
                    <div>
                        <select value={suplier} disabled={blocked} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setSuplier(event.target.value)}>
                            <option></option>
                            {supliersList.map((item, index) => <option value={item._id} key={item._id}>{item.name}</option>)}

                        </select>
                    </div>
                </label>                
                
                <button className={styles.buttonSend} disabled={blocked} onClick={handleSendOrder}>Send List</button>
                 

            </div>

            <div className={styles.tableContainer}>

                <div className={styles.FiltersBox}>

                    <p>Filters</p>
                               
                    <div className={styles.filterCategory}>
                        <select required disabled={blocked} value={catFilter} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setCatFilter(event.target.value)}>
                            <option value=''>Category/All</option>
                            {categories.map((item, index) => <option value={item._id} key={index}>{item.name}</option>)}
                        </select>
                    </div>                        
                               
                    <div className={styles.filterText}>
                        <input type="text" disabled={blocked} placeholder='Type a product...'  value={textFilter} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setTextFilter(event.target.value)}/>
                    </div>
                   

                </div>

                <div className={styles.tableBox}>
                    
                    <table className={styles.tableInput} cellSpacing={0}>
                        <thead>
                            <tr>
                                <th className={styles.thProduct}></th>
                                <th className={styles.thProduct}>Product</th>
                                <th className={styles.thUnit}>Unit</th>
                                <th className={styles.thQtd} >Qtd</th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                products.map((item, index) => 

                            <tr key={item.id} className={(index%2 ===0)? styles.trColor : styles.trWhite}>
                                
                                <td><img src={item.image} width={40} height={40} className={styles.image} alt=''></img></td>
                                <td>{item.name}</td>
                                <td>{item.unit}</td>
                                <td><input type="number" disabled={blocked} min={0}  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {qtdHandler(item, Number(event.target.value))}}/></td>
                            </tr>                            

                            )}
                        </tbody>                
                    </table>   

                    <table cellSpacing={0} className={styles.tablePreview}>
                        <thead>
                            <tr>
                                <th >Product</th>
                                <th >Unit</th>
                                <th >Qtd</th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                list.map((it, index) => 

                            <tr key={it.idProduct}>
                                <td>{it.product}</td>
                                <td>{it.unit}</td>
                                <td>{it.qtd}</td>
                            </tr>                            

                            )}
                        </tbody>                
                    </table> 
                    
                </div>

            </div>

           
                     
        </div>

    )

}


export default NewOrder