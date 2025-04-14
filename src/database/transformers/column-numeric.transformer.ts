import { isNumber } from 'class-validator'

export class ColumnNumericTransformer {
    to(data: number): number {
        return data
    }

    from(data: string): number {
        if (data?.length || isNumber(data)) {
            return Number(data)
        }

        return null
    }
}
