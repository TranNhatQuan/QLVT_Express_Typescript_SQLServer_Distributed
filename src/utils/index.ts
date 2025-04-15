import moment from 'moment'

export const generateRandomString = (
    length: number,
    type: 'default' | 'number' | 'code' | 'string' = 'default'
): string => {
    let characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()'
    if (type === 'number') {
        characters = '0123456789'
    }
    if (type === 'string') {
        characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    }
    if (type === 'code') {
        characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    }
    const charactersLength = characters.length
    let result = ''

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charactersLength)
        result += characters.charAt(randomIndex)
    }

    return result
}

export const getObjectKeys = (obj: object) => {
    return Object.values(obj).join(', ')
}

export const generateCode = (data: {
    prefix?: string
    value: string
    base: string
    length: number
    sufix?: string
}) => {
    const { prefix = '', value, base, length, sufix = '' } = data
    const baseLength = length - value.length
    const basePart = base.repeat(baseLength)
    return prefix + basePart + value + sufix
}

export const daysDiff = (from: Date, to: Date) => {
    const timeDiff = Math.abs(from.getTime() - to.getTime())
    return Math.floor(timeDiff / (24 * 60 * 60 * 1000))
}

export const splitChunks = <T>(source: T[], size: number) => {
    const chunks: T[][] = []
    for (let i = 0; i < source.length; i += size) {
        chunks.push(source.slice(i, i + size))
    }
    return chunks
}

export const removeUndefinedFields = <T>(obj: T) =>
    Object.keys(obj).reduce((acc, key) => {
        if (obj[key] === undefined) {
            return acc
        }
        acc[key] = obj[key]
        return acc
    }, <T>{})

export const toUTCTimeGetRaceResult = (
    dt?: Date,
    fm = 'YYYY-MM-DDT00:00:00[Z]'
) => {
    dt = dt ?? new Date()
    return moment(dt).format(fm)
}

export function randomIntFromInterval(min: number, max: number) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export function replaceParams(message: string, params: string[]) {
    const regex = /\$param(\d+)\$/g
    let match
    let replacedMessage = message

    while ((match = regex.exec(message)) !== null) {
        const index = parseInt(match[1], 10) - 1
        if (index >= 0 && index < params.length) {
            replacedMessage = replacedMessage.replace(match[0], params[index])
        }
    }

    return replacedMessage
}

export function formatPrize(prize: string) {
    return Number(prize).toLocaleString('en-US', {
        maximumFractionDigits: 2,
    })
}

export async function handleListCallbackFunc(
    callbackFuncs: (() => Promise<unknown>)[]
) {
    const promises = []

    if (!callbackFuncs?.length) {
        return
    }

    for (const callback of callbackFuncs) {
        promises.push(callback())
    }

    return Promise.all(promises)
}

export async function handleListCallbackFuncByChunk(
    callbackFuncs: (() => Promise<unknown>)[],
    chunkSize = 100
) {
    const callbackFuncsChunk = splitChunks(callbackFuncs, chunkSize)

    for (const callbackFuncs of callbackFuncsChunk) {
        await handleListCallbackFunc(callbackFuncs)
    }
}
