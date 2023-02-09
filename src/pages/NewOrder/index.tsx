import styles from './NewOrder.module.scss'
import useApi from '../../helpers/SunriseAPI'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Cookies from 'js-cookie'

type ListType = {
    idProduct: string,
    product: string,
    qtd: number,
    unit: string,
    image: string
}

type ErrorType = {
    param: string,
    msg: string
}

type Suplier={
    _id: string,
    name: string,
    slug: string,
}

type OrderItemType = {
    _id: string,
    idSuplier: string,
    suplierName: string,
    idAdm: string,
    userchecker?: string,
    orderDate: Date,
    checkDate?: Date,
    status: string,
    listOrder: ListType[],
    listCheck: ListType[],
    admDesc?: string,
    checkerDesc?: string,
}

type ProductsType = {
    id: string,
    category: string,
    name: string,
    unit: string,
    image: string
}
  


const NewOrder = () => {

    const api = useApi
            
    const [products, setProducts] = useState([] as ProductsType[])
    const [supliersList, setSupliersList] = useState([] as Suplier[])
    const [list, setList] = useState([] as ListType[])
    const [description, setDescription] = useState('')
    const [suplier, setSuplier] = useState('')
    const [error, setError] = useState({} as ErrorType)
    const [success, setSuccess] = useState({
        param: '',
        msg: ''
    })
    const userAdmin = Cookies.get('user')
        
    useEffect(() => {
        const getProducts = async () => {
            const pList = await  api.getProductsList({})            
            setProducts(pList)
        }
        getProducts()
    }, [api])

    useEffect(() => {
        const getSupliersList = async () => {
            const supList = await  api.getSupliersList({})            
            setSupliersList(supList)
        }
        getSupliersList()
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
                    image: item.image}
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

        if(!userAdmin) {
            setError({param: 'User', msg: 'UserAdmin Invalid - Please login Again'})
            return
        }
        if(suplier ==='') {
            setError({param: 'Suplier', msg: 'Plese Select the Suplier'})
            return
        } 

        if(list.length === 0) {
            setError({param: 'Order', msg: 'The List is Empty - Select at Least one item'})
            return
        } 

        const json = await api.addOrder(userAdmin, suplier, list, description)

        if(json.error) {
            setError(json.error)
        } else {
            setSuccess({param: 'Order', msg: 'Order Created Successfully'})
            setTimeout(() => {
                setSuccess({param: '', msg: ''})
            }, 5000)
        }
    }


    return (
        <div>

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

            <div className={styles.topInputs}>
            <label className={styles.area}>
                    <div>Note: </div>
                    <div>
                        <input type="text" placeholder='Insert a note...'  value={description} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setDescription(event.target.value)}/>
                    </div>
                </label>
                <label className={styles.area}>
                    <div>Select the Suplier: </div>
                    <div>
                        <select value={suplier} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setSuplier(event.target.value)}>
                            <option></option>
                            {supliersList.map((item, index) => <option value={item._id} key={item._id}>{item.name}</option>)}

                        </select>
                    </div>
                </label>

            </div>

            <div className={styles.pageContainer}>
                <div className={styles.tableInput}>
                    <table>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Unit</th>
                                <th>Qtd</th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                products.map((item, index) => 

                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>{item.unit}</td>
                                <td><input type="number" min={0}  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {qtdHandler(item, Number(event.target.value))}}/></td>
                            </tr>                            

                            )}
                        </tbody>                
                    </table>     
                </div>
                <div className={styles.tablePreview}>
                    <table>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Unit</th>
                                <th>Qtd</th>
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
                    <p>{description}</p>    

                </div>



            </div>
            <div className={styles.buttonsArea}>
                
                <button className={styles.buttonSend} onClick={handleSendOrder}>Send List</button>
            </div>            
        </div>


    )

}


export default NewOrder