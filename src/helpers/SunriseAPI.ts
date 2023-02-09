import Cookies from "js-cookie"
import qs from 'qs'

type BodyType = {
    email?: string,
    password?: string,
    token?: string
    name?: string,
    suplier?: string,
    masterPass?: string,
    category?: string,
    image?: string,
    unit?: string,
    newProduct?: string,
    newCategory?: string

}

const BASE_API = 'http://localhost:4000'

const apiFetchPost = async (endPoint: string, body: BodyType) => {

    let token = Cookies.get('token') 
    
    const res = await fetch(BASE_API+endPoint, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        //'x-access-token':
        body: JSON.stringify(body)
    })
    
    const json = await res.json()

    /*if(json.notallowed) {
        go to /signin
    }
    */
    console.log(json)

    return json
    
}


const apiFetchGet = async (endPoint: string, body: BodyType = {}) => {

    let token = Cookies.get('token') 
    
    const res = await fetch(`${BASE_API+endPoint}?${qs.stringify(body)}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer${token}`
        },
        //'x-access-token':        
    })
    
    const json = await res.json()

    /*if(json.notallowed) {
        go to /signin
    }
    */
    console.log(json)

    return json
    
}



const BravoStoreAPI = {

    login: async (email: string, password: string) => {

        const json = await apiFetchPost('/user/login', {email: email, password: password}) 

        return json

    },

    register: async (name: string, email: string, password: string, masterPass: string) => {

        const json = await apiFetchPost('/user/register', {email: email, password: password, name: name, masterPass: masterPass}) 

        return json

    },
   
    
    getCategories: async () => {

        const json = await apiFetchGet('/category/list', {})         
        return json.categoryList

    },

    getOrder: async (options: {}) => {

        const json = await apiFetchGet('/order/list', options) 
        
        return json.orderList

    },

    getOrderItem: async (options: {}, id: string) => {

        const json = await apiFetchGet(`/order/item/${id}`, options) 
        
        return json.orderList

    },

    getProductsList: async (options: {}, ) => {

        const json = await apiFetchGet(`/products/list`, options) 
        
        return json.productsList

    },

    addProduct: async (name: string, unit: string, category: string, image?: string) => {

        const json = await apiFetchPost('/products/add', {newProduct: name, unit: unit, category: category}) 

        return json

    },

    addCategory: async (name: string) => {

        const json = await apiFetchPost('/category/add', {newCategory: name}) 

        return json

    },
    





}

export default () => BravoStoreAPI