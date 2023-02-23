import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import nock from 'nock'
import { BrowserRouter } from "react-router-dom";
import AddSuplier from ".";
import useApi from '../../helpers/SunriseAPI'


jest.mock('../../helpers/SunriseAPI')
const mockedAddSuplier = jest.mocked(useApi.addSuplier)

describe("Add Suplier...", () => {

    afterEach(() => nock.cleanAll())

    it("Call the API after press Button", async () => {
        mockedAddSuplier.mockImplementation(async (name: string) => {
            return { status: 'New Suplier Added' }
        })

        nock('http://192.168.0.3:4000')
            .intercept('/suplier/add', 'OPTIONS')
            .reply(200)
            .defaultReplyHeaders({
                'access-control-allow-origin': '*',
                'access-control-allow-credentials': 'true',
                'Access-Control-allow-Headers': '*'
            })
            .post('/suplier/add')
            .reply(200, {
                body: { status: 'New Suplier Added' }
            })

        render(<AddSuplier />, { wrapper: BrowserRouter })

        const buttonAdd = screen.getByText('ADD SUPPLIER')
        const categoryField = screen.getByTestId('inputAddSuplier')

        fireEvent.change(categoryField, { target: { value: "New Suplier" } })
        fireEvent.click(buttonAdd)

        await waitFor(() => expect(mockedAddSuplier).toBeCalledTimes(1))

    })
    it("Show Success Message", async () => {
        mockedAddSuplier.mockImplementation(async (name: string) => {
            return { status: 'New Suplier Added' }
        })

        nock('http://192.168.0.3:4000')
            .intercept('/suplier/add', 'OPTIONS')
            .reply(200)
            .defaultReplyHeaders({
                'access-control-allow-origin': '*',
                'access-control-allow-credentials': 'true',
                'Access-Control-allow-Headers': '*'
            })
            .post('/suplier/add')
            .reply(200, {
                body: { status: 'New Suplier Added' }
            })


        render(<AddSuplier />, { wrapper: BrowserRouter })

        const buttonAdd = screen.getByText('ADD SUPPLIER')
        const categoryField = screen.getByTestId('inputAddSuplier')

        fireEvent.change(categoryField, { target: { value: "New Suplier" } })
        fireEvent.click(buttonAdd)

        expect(await screen.findByText('Suplier Added Successfully')).toBeTruthy()

    })
    it("Show Error Message when API fails", async () => {
        mockedAddSuplier.mockImplementation(async (name: string) => {
            return { error: [{ param: 'Server', msg: "Server is not Available" }] }
        })

        nock('http://192.168.0.3:4000')
            .intercept('/suplier/add', 'OPTIONS')
            .reply(400)
            .defaultReplyHeaders({
                'access-control-allow-origin': '*',
                'access-control-allow-credentials': 'true',
                'Access-Control-allow-Headers': '*'
            })
            .post('/suplier/add')
            .reply(400, {
                body: { error: [{ param: 'Server', msg: "Server is not Available" }] }
            })

        render(<AddSuplier />, { wrapper: BrowserRouter })

        const buttonAdd = screen.getByText('ADD SUPPLIER')
        const categoryField = screen.getByTestId('inputAddSuplier')

        fireEvent.change(categoryField, { target: { value: "New Suplier" } })
        fireEvent.click(buttonAdd)

        expect(await screen.findByText('Server is not Available', { exact: false })).toBeTruthy()

    })

});







