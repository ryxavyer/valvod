const getMinuteDifference = (startDate, endDate) => {
    const msInMinute = 60 * 1000;
  
    return Math.round(
      Math.abs(endDate - startDate) / msInMinute
    )
}

const getDifferenceString = (difference) => {
    const hours = Math.floor(difference / 60)

    if (hours < 1) return `${difference} min`
    if (hours >= 24) return "Yesterday"

    return `${hours} hr`
}

export const getTimeToDisplay = (dateString) => {
    const then = new Date(dateString)
    const now = new Date()

    const difference = getMinuteDifference(then, now)
    // if less than 2 days ago, return prettier string
    if (difference <= (1440*2)) {
        return getDifferenceString(difference)
    }
    // if more than 2 days ago, return the date
    return then.toLocaleDateString()
}

export const makeSessionEndReadable = (sessionEndDate) => {
    if (!sessionEndDate) {
        return "On break"
    }
    const now = new Date()
    const sessionEnd = new Date(sessionEndDate)
    if (now > sessionEnd) {
        return "Away"
    }
    const minDiff = Math.ceil((Math.abs(sessionEnd - now)/1000)/60)
    const prettyDiff = `${minDiff} min left`
    return prettyDiff
}