import Cookies from "js-cookie"
import qs from 'qs'
import { BodyType, ListType } from "../types/types"

/*type BodyType = {
    [key: string]: string | any | undefined
}*/



const BASE_API = 'http://192.168.0.3:4000'

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
        body: JSON.stringify(body),    
        
    })
    
    const json = await res.json()

    /*if(json.notallowed) {
        go to /signin
    }
    */
    console.log(json)

    return json
    
}

const apiFetchFile = async (endPoint: string, body:FormData) => {

    let token = Cookies.get('token') 
    
    const res = await fetch(BASE_API+endPoint, {
        method: 'POST',
        headers: {            
            'Authorization': `Bearer ${token}`
        },        
        body: body,    
        
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

const apiFetchPut = async (endPoint: string, body: BodyType) => {

    let token = Cookies.get('token') 
    
    const res = await fetch(BASE_API+endPoint, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        //'x-access-token':
        body: JSON.stringify(body)
    })
    
    const json = await res.json()

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
        
        return json.order

    },

    getProductsList: async (options: {}, ) => {

        const json = await apiFetchGet(`/products/list`, options) 
        
        return json.productsList

    },

    getSupliersList: async (options: {}, ) => {

        const json = await apiFetchGet(`/suplier/list`, options) 
        
        return json.suplierList

    },

    addProduct: async (files: FormData) => {
        
        const json = await apiFetchFile('/products/add', files) 

        return json

    },

    addCategory: async (name: string) => {

        const json = await apiFetchPost('/category/add', {newCategory: name}) 

        return json

    },

    addSuplier: async (name: string) => {

        const json = await apiFetchPost('/suplier/add', {newSuplier: name}) 

        return json

    },

    addOrder: async (idAdm: string, idSuplier: string, listOrder: ListType[], desc: string) => {

        const json = await apiFetchPost('/order/add', {idAdm: idAdm, idSuplier: idSuplier, listOrder: listOrder, desc: desc}) 

        return json

    },
    
    orderCheck: async (checkOrder: ListType[],  userChecker: string, idOrder: string| undefined, status: string, checkerDesc?: string, divergent?: number[]) => {

        const json = await apiFetchPost('/order/check', {checkOrder: checkOrder, checkerDesc: checkerDesc, userChecker: userChecker, idOrder: idOrder, status: status, divergent: divergent}) 

        return json

    },

    updateCloseOrder: async (idOrder: string|undefined) => {

        const json = await apiFetchPut('/order/finish', {idOrder: idOrder}) 

        return json

    },
}

export default  BravoStoreAPI