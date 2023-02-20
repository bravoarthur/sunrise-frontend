import { render, screen} from "@testing-library/react";
import nock from 'nock'
import { BrowserRouter } from "react-router-dom";
import Home from ".";
import { isLogged } from "../../helpers/authHandler";


const mockedOrderList = {
    orderList: [{
        id: '63e865b7c4d5e8505b585cab',
        suplier: 'test store',
        orderDate: "2023-02-12T04:06:15.130Z",
        checkDate: '',
        checkerDesc: '',
        admDesc: 'see notes',
        listCheck: [],
        userchecker: '',
        listOrder: [{
            divergent: false,
            idProduct: "63e79c028e95fc308b0f192a",
            image: "http://192.168.0.3:4000/media/default.jpg",
            product: "Coke",
            qtd: 5,
            unit: "Unit"}]


    }, {
        id: '64e865b7c4d5e8505b585cab',
        suplier: 'Other Place',
        orderDate: "2023-02-12T04:06:15.130Z",
        checkDate: '',
        checkerDesc: '',
        admDesc: 'see Other notes',
        listCheck: [],
        userchecker: '',
        listOrder: [{
            divergent: false,
            idProduct: "64e79c028e95fc308b0f192a",
            image: "http://192.168.0.3:4000/media/default.jpg",
            product: "Pepsi",
            qtd: 15,
            unit: "Unit"}]
    }]
}

/*
let mockLogged = false
jest.mock("../../helpers/authHandler", () => ({
    ...jest.requireActual("../../helpers/authHandler"),
    isLogged: () => mockLogged,
}));
*/
jest.mock('../../helpers/authHandler')
const mockedLogged = jest.mocked(isLogged)

describe("Home Page NOT LOGGED", () => {    
    afterEach(() => nock.cleanAll())
    //beforeEach(() => mockedLogged.mockClear())
    
    it("Load the Items and show", async () => {
        mockedLogged.mockReturnValue(false)

        nock('http://localhost:4000')        
        .intercept('/order/list', 'OPTIONS' )
        .query({status: 'OPEN'})
        .reply(200)        
        .defaultReplyHeaders({
            'access-control-allow-origin': '*',
            'access-control-allow-credentials': 'true',  
            'Access-Control-allow-Headers': '*'                     
        })
        .get('/order/list')
        .query({status: 'OPEN'})
        .reply(200, {
            orderList: mockedOrderList.orderList
        })               
        
        render(<Home/>, {wrapper: BrowserRouter})

        expect(await screen.findByText('test store', {exact: false})).toBeTruthy()
        expect(screen.getAllByTestId('orderCard').length).toBe(mockedOrderList.orderList.length)
    })

    it("Show error Message when server is unable", async () => {
        mockedLogged.mockReturnValue(false)

        nock('http://localhost:4000')        
        .intercept('/order/list', 'OPTIONS' )
        .query({status: 'OPEN'})
        .reply(200)        
        .defaultReplyHeaders({
            'access-control-allow-origin': '*',
            'access-control-allow-credentials': 'true',  
            'Access-Control-allow-Headers': '*'                     
        })
        .get('/order/list')
        .query({status: 'OPEN'})
        .reply(401, {
            error: [{param: 'Server', msg: "Server is not Available"}]
        })               
        
        render(<Home/>, {wrapper: BrowserRouter})        
        const error = await screen.findByText('Server is not Available', {exact: false})                  
        
        expect(error).toBeTruthy()
        expect(error).toHaveClass('errorMessage') 
             
    })
    
});


describe("Home Page LOGGED", () => {    

    afterEach(() => nock.cleanAll())
    
    it("Load the Items and show", async () => {
        mockedLogged.mockReturnValue(true)

        nock('http://localhost:4000')        
        .intercept('/order/list', 'OPTIONS' )
        .query({status: 'DIVERGENT'})
        .reply(200)        
        .defaultReplyHeaders({
            'access-control-allow-origin': '*',
            'access-control-allow-credentials': 'true',  
            'Access-Control-allow-Headers': '*'                     
        })
        .get('/order/list')
        .query({status: 'DIVERGENT'})
        .reply(200, {
            orderList: mockedOrderList.orderList
        })               
        
        render(<Home/>, {wrapper: BrowserRouter})

        
        expect(await screen.findByText('test store', {exact: false})).toBeTruthy()
        expect(screen.getAllByTestId('orderCard').length).toBe(mockedOrderList.orderList.length)
    })
    
    it("Buttons Are Available", async () => {
        mockedLogged.mockReturnValue(true)

        nock('http://localhost:4000')        
        .intercept('/order/list', 'OPTIONS' )
        .query({status: 'DIVERGENT'})
        .reply(200)        
        .defaultReplyHeaders({
            'access-control-allow-origin': '*',
            'access-control-allow-credentials': 'true',  
            'Access-Control-allow-Headers': '*'                     
        })
        .get('/order/list')
        .query({status: 'DIVERGENT'})
        .reply(200, {
            orderList: mockedOrderList.orderList
        })               
        
        render(<Home/>, {wrapper: BrowserRouter})
       
        expect(screen.getAllByTestId('loggedButtons').length).toBe(3)
    })
    
});






