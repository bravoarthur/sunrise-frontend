import styles from './CheckOrder.module.scss'
import useApi from '../../helpers/SunriseAPI'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

type ListType = {
    idProduct: string,
    product: string,
    qtd: number,
    image: string
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
    admDesc: string,
    checkerDesc: string,
}

type ProductsType = {
    _id: string,
    category: string,
    name: string,
    unit: string,
    image: string
}
           

const CheckOrder = () => {

    const api = useApi
    let {id} = useParams() 
    
    
    const [orderItem, setOrderItem] = useState({} as OrderItemType)
    const [products, setProducts] = useState([] as ProductsType[])

    useEffect(() => {
        const getOrder = async () => {
            const order: OrderItemType = await  api.getOrderItem({}, id!)            
            setOrderItem(order)
        }
        getOrder()
    }, [api])   
    
    useEffect(() => {
        const getProducts = async () => {
            const pList = await  api.getProductsList({})            
            setProducts(pList)
        }
        getProducts()
    }, [api])


    return (

        <div>

            {products.map((item, index) => <p key={index}>{item.name}</p>)}



        </div>

    )

}


export default CheckOrder