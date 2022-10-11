import { supabase } from '../supabaseClient'

export const validateUsername = async (username) => {
    let success = false
    let validationError = ""

    if (username === "" || username === undefined) {
        validationError = "You must set a username to continue"
        return {success, validationError}
    }

    let { data, error } = await supabase
        .from('users')
        .select('username')
        .eq('username', username)
        .single()

    if (data) {
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
    return {success, error}
}