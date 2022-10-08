import { supabase } from './supabaseClient'

export const validateUsername = async (username) => {
    let success = false
    let error = ""

    if (username === "" || username === undefined) {
        error = "You must set a username to continue"
        return {success, error}
    }

    let { data, dbError } = await supabase
        .from('users')
        .select('username')
        .eq('username', username)

    if (dbError) {
        error = "There was an error validating your username.  Please try again."
        return {success, error}
    }

    if (!data) {
        error = "That username is taken. Try another."
        return {success, error}
    }

    if (username.length < 3) {
        error = "Username must be longer than 3 characters"
        return {success, error}
    }

    if (username.length > 20) {
        error = "Username cannot be longer than 20 characters"
        return {success, error}
    }
    
    success = true
    return {success, error}
}