import axios, { AxiosRequestConfig } from 'axios'

export abstract class BaseAxiosService {
    protected _baseUrl: string
    protected _apiKey: string

    //region Getters and Setters

    get baseUrl() {
        return this._baseUrl
    }

    get apiKey(): string {
        return this._apiKey
    }

    //endregion

    //region Protected Methods

    protected async getAsync(
        path: string,
        queries: Record<string, string>,
        authHeader: object = null
    ) {
        const url = `${this.baseUrl}${path}`

        const axiosConfig: AxiosRequestConfig = {
            method: 'GET',
            url,
            headers: authHeader,
            params: queries,
        }

        const res = await axios(axiosConfig)

        return res.data
    }

    //endregion
}
