import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import nock from 'nock'
import { BrowserRouter } from "react-router-dom";
import NewOrder from ".";
import { ListType } from "../../types/types";



const mockedCategoryList = {
    categoryList: [{
        _id: 'f2d1fd2f0d',
        name: 'Cat1',
        slug: 'Cat1'
    }, {
        _id: 'f2d1dffd2f0d',
        name: 'Cat2',
        slug: 'Cat2'
    }, {
        _id: 'f2dfgfd2f0d',
        name: 'Cat3',
        slug: 'Cat3'
    }]
}

const mockedProductList = {
    productsList: [{
        id: "1234",
        name: "Coke",
        category: 'Cat1',
        unit: 'Unit',
        image: `http://`
    }, {
        id: "12345",
        name: "Bread",
        category: 'Cat2',
        unit: 'Unit',
        image: `http://`
    }, {
        id: "123456",
        name: "Melon",
        category: 'Cat3',
        unit: 'Unit',
        image: `http://`
    }]
}

const mockedSuplierList = {
    suplierList: [{
        _id: '123',
        name: 'suplier1',
        slug: 'suplier1'
    }, {
        _id: '1234',
        name: 'suplier2',
        slug: 'suplier2'
    }, {
        _id: '12345',
        name: 'suplier3',
        slug: 'suplier3'
    }]
}

const mockedfn = jest.fn()
jest.mock("../../helpers/SunriseAPI", () => {
    const SunriseAPI = jest.requireActual("../../helpers/SunriseAPI")
    SunriseAPI.default.addOrder = () => mockedfn()

    return SunriseAPI

});

jest.mock('js-cookie', () => jest.fn())
const mockedCookie = jest.fn()
jest.mock('js-cookie', () => ({
    ...jest.requireActual('js-cookie'),
    get: () => mockedCookie()
}));

describe("Add Order...", () => {

    afterEach(() => nock.cleanAll())

    it("Call the API when press Button", async () => {

        mockedCookie.mockImplementation(() => {
            return 'USER'
        })

        mockedfn.mockImplementation(async (idAdm: string, idSuplier: string, listOrder: ListType[], desc: string) => {
            return { status: 'success' }
        })

        nock('http://192.168.0.3:4000')
            .intercept('/category/list', 'OPTIONS')
            .query({})
            .reply(200)
            .defaultReplyHeaders({
                'access-control-allow-origin': '*',
                'access-control-allow-credentials': 'true',
                'Access-Control-allow-Headers': '*'
            })
            .get('/category/list')
            .query({})
            .reply(200, { categoryList: mockedCategoryList.categoryList })

        nock('http://192.168.0.3:4000')
            .intercept('/suplier/list', 'OPTIONS')
            .query({})
            .reply(200)
            .defaultReplyHeaders({
                'access-control-allow-origin': '*',
                'access-control-allow-credentials': 'true',
                'Access-Control-allow-Headers': '*'
            })
            .get('/suplier/list')
            .query({})
            .reply(200, { suplierList: mockedSuplierList.suplierList })

        nock('http://192.168.0.3:4000')
            .intercept('/products/list', 'OPTIONS')
            .query({ q: '', cat: '' })
            .reply(200)
            .defaultReplyHeaders({
                'access-control-allow-origin': '*',
                'access-control-allow-credentials': 'true',
                'Access-Control-allow-Headers': '*'
            })
            .get('/products/list')
            .query({ q: '', cat: '' })
            .reply(200, { productsList: mockedProductList.productsList })

        render(<NewOrder />, { wrapper: BrowserRouter })

        const buttonSendList = screen.getByText('Send List')
        const suplierSelect = await screen.findByTestId('newOrderSuplier')
        expect(await screen.findByText('suplier1')).toBeTruthy()
        userEvent.selectOptions(suplierSelect, ["suplier1"])
        const productQtdInput = await screen.findByTestId(`newOrderProductQtd1`)
        fireEvent.change(productQtdInput, { target: { value: 5 } })

        fireEvent.click(buttonSendList)

        await waitFor(() => expect(mockedfn).toBeCalledTimes(1))
        expect(await screen.findByText('Order Created Successfully')).toBeTruthy()

    })
    it("API is not called if the list is empty", async () => {

        mockedCookie.mockImplementation(() => {
            return 'USER'
        })

        mockedfn.mockImplementation(async (idAdm: string, idSuplier: string, listOrder: ListType[], desc: string) => {
            return { status: 'success' }
        })

        nock('http://192.168.0.3:4000')
            .intercept('/category/list', 'OPTIONS')
            .query({})
            .reply(200)
            .defaultReplyHeaders({
                'access-control-allow-origin': '*',
                'access-control-allow-credentials': 'true',
                'Access-Control-allow-Headers': '*'
            })
            .get('/category/list')
            .query({})
            .reply(200, { categoryList: mockedCategoryList.categoryList })

        nock('http://192.168.0.3:4000')
            .intercept('/suplier/list', 'OPTIONS')
            .query({})
            .reply(200)
            .defaultReplyHeaders({
                'access-control-allow-origin': '*',
                'access-control-allow-credentials': 'true',
                'Access-Control-allow-Headers': '*'
            })
            .get('/suplier/list')
            .query({})
            .reply(200, { suplierList: mockedSuplierList.suplierList })

        nock('http://192.168.0.3:4000')
            .intercept('/products/list', 'OPTIONS')
            .query({ q: '', cat: '' })
            .reply(200)
            .defaultReplyHeaders({
                'access-control-allow-origin': '*',
                'access-control-allow-credentials': 'true',
                'Access-Control-allow-Headers': '*'
            })
            .get('/products/list')
            .query({ q: '', cat: '' })
            .reply(200, { productsList: mockedProductList.productsList })

        render(<NewOrder />, { wrapper: BrowserRouter })

        const buttonSendList = screen.getByText('Send List')
        const suplierSelect = await screen.findByTestId('newOrderSuplier')
        expect(await screen.findByText('suplier1')).toBeTruthy()
        userEvent.selectOptions(suplierSelect, ["suplier1"])

        fireEvent.click(buttonSendList)

        await waitFor(() => expect(mockedfn).toBeCalledTimes(0))
        expect(await screen.findByText('Select at Least one item', { exact: false })).toBeTruthy()

    })
    it("API is not called if is not logged or dont have a user", async () => {

        mockedCookie.mockImplementation(() => {
            return ''
        })

        mockedfn.mockImplementation(async (idAdm: string, idSuplier: string, listOrder: ListType[], desc: string) => {
            return { status: 'success' }
        })

        nock('http://192.168.0.3:4000')
            .intercept('/category/list', 'OPTIONS')
            .query({})
            .reply(200)
            .defaultReplyHeaders({
                'access-control-allow-origin': '*',
                'access-control-allow-credentials': 'true',
                'Access-Control-allow-Headers': '*'
            })
            .get('/category/list')
            .query({})
            .reply(200, { categoryList: mockedCategoryList.categoryList })

        nock('http://192.168.0.3:4000')
            .intercept('/suplier/list', 'OPTIONS')
            .query({})
            .reply(200)
            .defaultReplyHeaders({
                'access-control-allow-origin': '*',
                'access-control-allow-credentials': 'true',
                'Access-Control-allow-Headers': '*'
            })
            .get('/suplier/list')
            .query({})
            .reply(200, { suplierList: mockedSuplierList.suplierList })

        nock('http://192.168.0.3:4000')
            .intercept('/products/list', 'OPTIONS')
            .query({ q: '', cat: '' })
            .reply(200)
            .defaultReplyHeaders({
                'access-control-allow-origin': '*',
                'access-control-allow-credentials': 'true',
                'Access-Control-allow-Headers': '*'
            })
            .get('/products/list')
            .query({ q: '', cat: '' })
            .reply(200, { productsList: mockedProductList.productsList })

        render(<NewOrder />, { wrapper: BrowserRouter })

        const buttonSendList = screen.getByText('Send List')
        const suplierSelect = await screen.findByTestId('newOrderSuplier')
        expect(await screen.findByText('suplier1')).toBeTruthy()
        userEvent.selectOptions(suplierSelect, ["suplier1"])
        const productQtdInput = await screen.findByTestId(`newOrderProductQtd1`)
        fireEvent.change(productQtdInput, { target: { value: 5 } })

        fireEvent.click(buttonSendList)

        await waitFor(() => expect(mockedfn).toBeCalledTimes(0))
        expect(await screen.findByText('UserAdmin Invalid - Please login Again', { exact: false })).toBeTruthy()

    })
    it("Show Error Message when Server reply an error", async () => {

        mockedCookie.mockImplementation(() => {
            return 'USER'
        })

        mockedfn.mockImplementation(async (idAdm: string, idSuplier: string, listOrder: ListType[], desc: string) => {
            return { status: 'success' }
        })

        nock('http://192.168.0.3:4000')
            .intercept('/category/list', 'OPTIONS')
            .query({})
            .reply(200)
            .defaultReplyHeaders({
                'access-control-allow-origin': '*',
                'access-control-allow-credentials': 'true',
                'Access-Control-allow-Headers': '*'
            })
            .get('/category/list')
            .query({})
            .reply(200, { categoryList: mockedCategoryList.categoryList })

        nock('http://192.168.0.3:4000')
            .intercept('/suplier/list', 'OPTIONS')
            .query({})
            .reply(200)
            .defaultReplyHeaders({
                'access-control-allow-origin': '*',
                'access-control-allow-credentials': 'true',
                'Access-Control-allow-Headers': '*'
            })
            .get('/suplier/list')
            .query({})
            .reply(401, {
                error: [{ param: 'Server', msg: "Server is not Available" }]
            })

        nock('http://192.168.0.3:4000')
            .intercept('/products/list', 'OPTIONS')
            .query({ q: '', cat: '' })
            .reply(200)
            .defaultReplyHeaders({
                'access-control-allow-origin': '*',
                'access-control-allow-credentials': 'true',
                'Access-Control-allow-Headers': '*'
            })
            .get('/products/list')
            .query({ q: '', cat: '' })
            .reply(200, { productsList: mockedProductList.productsList })

        render(<NewOrder />, { wrapper: BrowserRouter })

        expect(await screen.findByText('Server is not Available', { exact: false })).toBeTruthy()

    })

});








