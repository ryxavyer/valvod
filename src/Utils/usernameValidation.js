import { supabase } from '../supabaseClient'

const USERNAME_BANNED_WORDS = [
    "support",
    "nigga",
    "nigga",
    "niggga",
    "nigggga",
    "nigger",
    "niggger",
    "nigggger",
    "niggerr",
    "niggerrr",
    "niggerrrr",
    "exploit",
    "highschool",
    "middleschool",
    "primaryschool",
    "elementaryschool",
    "preschool",
    "admin",
    "staff",
    "juvenile",
    "underage",
    "rape",
    "rapee",
    "raping",
    "raped",
    "rapist",
    "animalsex",
    "animalfuck",
    "murder",
    "strangle",
    "pedo",
    "beastiality",
    "toddler",
    "incest",
    "hooker",
    "prostitute",
    "virgin",
    "inzest",
    "faggot",
    "fagggot",
    "faggggot",
    "retard",
    "reetard",
    "reeetard",
    "reeeetard",
]

const checkForBannedWords = (username) => {
    let containsWord = undefined
    for (let i=0; i<USERNAME_BANNED_WORDS.length; i++) {
        const bannedWord = USERNAME_BANNED_WORDS[i]
        if (username.includes(bannedWord)) {
            containsWord = bannedWord
            break
        }
    }

    return containsWord
}

export const validateUsername = async (username) => {
    let success = false
    let validationError = ""

    if (username === "" || username === undefined) {
        validationError = "You must set a username to continue"
        return {success, validationError}
    }

    const bannedWord = checkForBannedWords(username)
    if (bannedWord !== undefined) {
        validationError = `Usernames cannot contain the word: ${bannedWord}`
        return {success, validationError}
    }

    let { data, error } = await supabase
        .from('users')
        .select('username')
        .eq('username', username)

    if (error) {
        validationError = "There was an error communicating with the database. Refresh and try again"
        return {success, validationError}
    }

    if (data.length) {
        validationError = "That username is taken. Try another."
        return {success, validationError}
    }

    if (username.length < 3) {
        validationError = "Username must be longer than 3 characters"
        return {success, validationError}
    }

    if (username.length > 20) {
        validationError = "Username cannot be longer than 20 characters"
        return {success, validationError}
    }
    
    success = true
    return {success, validationError}
}