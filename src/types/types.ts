export type ErrorType = {
    param: string,
    msg: string
}

export type CategoriesType = {
    _id: string,
    name: string,
    slug: string
}

export type SuplierType={
    _id: string,
    name: string,
    slug: string,
}

export type ProductsType = {
    id: string,
    category: string,
    name: string,
    unit: string,
    image: string
}


export type ListType = {
    idProduct: string,
    product: string,
    qtd: number,
    unit: string,
    image: string,
    divergent: boolean
}

export type OrderListType = {
    id: string,
    suplier: string,
    orderDate: string,
    checkDate?: string,
    userchecker?: string,
    listOrder: ListType[],
    listCheck: ListType[],
    admDesc?: string,
    checkerDesc?: string,
}

export type OrderItemType = {
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

export type BodyType = {
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
    newCategory?: string,
    newSuplier?: string,
    idAdm?: string,
    idSuplier?: string,
    listOrder?: ListType[],
    desc?: string,
    checkOrder?: ListType[],
    idOrder?: string,
    checkerDesc?: string,
    userChecker?: string,
    status?: string,
    divergent?: number[],
}

