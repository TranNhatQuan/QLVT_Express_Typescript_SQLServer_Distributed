import moment from 'moment-timezone'

export const getGMTBetweenUTCAndOtherTime = (
    utcTime: Date,
    timeZone: string
) => {
    const utcDateTime = moment.utc(utcTime)

    const sydneyOffset = moment.tz(utcDateTime, timeZone).utcOffset()
    const utcOffset = utcDateTime.utcOffset()

    return (sydneyOffset - utcOffset) / 60
}

export const changeUTCTimeToSydneyTime = (timeChange: Date) => {
    const GMTBetweenUTCAndSydneyTime = getGMTBetweenUTCAndOtherTime(
        new Date(),
        TimeZone.AustraliaSydney
    )
    const timeSydney = timeChange.toLocaleString('en-US', {
        timeZone: TimeZone.AustraliaSydney,
    })

    const hourUTCTime = timeChange.getTime()
    const hourSydneyTime =
        hourUTCTime + GMTBetweenUTCAndSydneyTime * 60 * 60 * 1000
    timeChange.setTime(hourSydneyTime)

    const hourOfDay = timeChange.getHours()
    const dayOfWeek = timeChange.getDay()

    return { timeSydney, hourOfDay, dayOfWeek }
}

export enum TimeZone {
    AustraliaSydney = 'Australia/Sydney',
}
