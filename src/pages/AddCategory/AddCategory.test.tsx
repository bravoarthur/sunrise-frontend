import { fireEvent, render, screen, waitFor} from "@testing-library/react";
import nock from 'nock'
import { BrowserRouter } from "react-router-dom";
import AddCategory from ".";
import useApi from '../../helpers/SunriseAPI'


jest.mock('../../helpers/SunriseAPI')
const mockedAddCategory = jest.mocked(useApi.addCategory)

describe("Add Category...", () => {    

    afterEach(() => nock.cleanAll())
    
    it("Call the API after press Button", async () => {    
        mockedAddCategory.mockImplementation(async (name: string) => {
            return {status: 'New Category Added'}
        })   

        nock('http://localhost:4000')        
        .intercept('/category/add', 'OPTIONS' )
        .reply(200)        
        .defaultReplyHeaders({
            'access-control-allow-origin': '*',
            'access-control-allow-credentials': 'true',  
            'Access-Control-allow-Headers': '*'                     
        })
        .post('/category/add')        
        .reply(200, {
            body: {status: 'New Category Added'}
        })                 
        
        render(<AddCategory/>, {wrapper: BrowserRouter})

        const buttonAdd =  screen.getByText('ADD CATEGORY')
        const categoryField = screen.getByTestId('inputAddCategory')
                  
        fireEvent.change(categoryField, { target: { value: "New Category"}})
        fireEvent.click(buttonAdd)
                                          
       await waitFor(() =>expect(mockedAddCategory).toBeCalledTimes(1))

    })
    it("Show Success Message", async () => {    
        mockedAddCategory.mockImplementation(async (name: string) => {
            return {status: 'New Category Added'}
        })   

        nock('http://localhost:4000')        
        .intercept('/category/add', 'OPTIONS' )
        .reply(200)        
        .defaultReplyHeaders({
            'access-control-allow-origin': '*',
            'access-control-allow-credentials': 'true',  
            'Access-Control-allow-Headers': '*'                     
        })
        .post('/category/add')        
        .reply(200, {
            body: {status: 'New Category Added'}
        })
                
        
        render(<AddCategory/>, {wrapper: BrowserRouter})

        const buttonAdd =  screen.getByText('ADD CATEGORY')
        const categoryField = screen.getByTestId('inputAddCategory')
                  
        fireEvent.change(categoryField, { target: { value: "New Category"}})
        fireEvent.click(buttonAdd)
                                  
       expect( await screen.findByText('Category Added Successfully')).toBeTruthy()

    })   
    it("Show Error Message when API fails", async () => {    
        mockedAddCategory.mockImplementation(async (name: string) => {
            return {error: [{param: 'Server', msg: "Server is not Available"}]}
        })   

        nock('http://localhost:4000')        
        .intercept('/category/add', 'OPTIONS' )
        .reply(400)        
        .defaultReplyHeaders({
            'access-control-allow-origin': '*',
            'access-control-allow-credentials': 'true',  
            'Access-Control-allow-Headers': '*'                     
        })
        .post('/category/add')        
        .reply(400, {
            body: {error: [{param: 'Server', msg: "Server is not Available"}]}
        })                
        
        render(<AddCategory/>, {wrapper: BrowserRouter})

        const buttonAdd =  screen.getByText('ADD CATEGORY')
        const categoryField = screen.getByTestId('inputAddCategory')
                  
        fireEvent.change(categoryField, { target: { value: "New Category"}})
        fireEvent.click(buttonAdd)
                                  
       expect( await screen.findByText('Server is not Available', {exact: false})).toBeTruthy()

    })  
    
});






