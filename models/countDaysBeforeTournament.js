function countDaysBeforeTournament(tournamentDate) {
    let diff = (new Date(tournamentDate) - Date.now())
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    let result = days.toString()
    const lastDigit = result[result.length - 1]
    const secondLastDigit = result[result.length - 2]

    if (secondLastDigit !== '1')
        if (lastDigit === '1')
            result += ' день'
        else if (lastDigit === '2' || lastDigit === '3' || lastDigit === '4')
            result += ' дня'
        else
            result += ' днів'
    else
        result += ' днів'

    return result
}

module.exports = {countDaysBeforeTournament}