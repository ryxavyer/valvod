import { supabase } from '../supabaseClient'

// SINGLE SESSION CHALLENGES
const CHALLENGES_SINGLE_SESSION = [
    "Complete a 25 minute session",
    "Complete a 50 minute session",
    "Complete a 150 minute session",
]
const CHALLENGES_SINGLE_SESSION_XP = {
    [CHALLENGES_SINGLE_SESSION[0]]: 100,
    [CHALLENGES_SINGLE_SESSION[1]]: 150,
    [CHALLENGES_SINGLE_SESSION[2]]: 350,
}
const CHALLENGES_SINGLE_SESSION_METRIC = {
    [CHALLENGES_SINGLE_SESSION[0]]: 1,
    [CHALLENGES_SINGLE_SESSION[1]]: 1,
    [CHALLENGES_SINGLE_SESSION[2]]: 1,
}

// MULTIPLE SESSION CHALLENGES
const CHALLENGES_MULTIPLE_SESSIONS = [
    "Complete 5 sessions",
    "Complete 10 sessions",
    "Complete 20 sessions",
    "Complete 40 sessions",
]
const CHALLENGES_MULTIPLE_SESSIONS_XP = {
    [CHALLENGES_MULTIPLE_SESSIONS[0]]: 300,
    [CHALLENGES_MULTIPLE_SESSIONS[1]]: 600,
    [CHALLENGES_MULTIPLE_SESSIONS[2]]: 1200,
    [CHALLENGES_MULTIPLE_SESSIONS[3]]: 2400,
}
const CHALLENGES_MULTIPLE_SESSIONS_METRIC = {
    [CHALLENGES_MULTIPLE_SESSIONS[0]]: 5,
    [CHALLENGES_MULTIPLE_SESSIONS[1]]: 10,
    [CHALLENGES_MULTIPLE_SESSIONS[2]]: 20,
    [CHALLENGES_MULTIPLE_SESSIONS[3]]: 40,
}

// SINGLE DAY CHALLENGES
const CHALLENGES_SINGLE_DAY = [
    "Complete 3 sessions in one day",
    "Complete 6 sessions in one day",
]
const CHALLENGES_SINGLE_DAY_XP = {
    [CHALLENGES_SINGLE_DAY[0]]: 500,
    [CHALLENGES_SINGLE_DAY[1]]: 1000,
}
const CHALLENGES_SINGLE_DAY_METRIC = {
    [CHALLENGES_SINGLE_DAY[0]]: 3,
    [CHALLENGES_SINGLE_DAY[1]]: 6,
}

// TOTAL MINUTES CHALLENGES
const CHALLENGES_TOTAL_MINUTES = [
    "Complete a total of 500 minutes in sessions",
    "Complete a total of 1000 minutes in sessions",
    "Complete a total of 2000 minutes in sessions",
]
const CHALLENGES_TOTAL_MINUTES_XP = {
    [CHALLENGES_TOTAL_MINUTES[0]]: 750,
    [CHALLENGES_TOTAL_MINUTES[1]]: 1500,
    [CHALLENGES_TOTAL_MINUTES[2]]: 3000,
}
const CHALLENGES_TOTAL_MINUTES_METRIC = {
    [CHALLENGES_TOTAL_MINUTES[0]]: 500,
    [CHALLENGES_TOTAL_MINUTES[1]]: 1000,
    [CHALLENGES_TOTAL_MINUTES[2]]: 2000,
}

// UNIQUE WORK INTERVALS CHALLENGES
const CHALLENGES_UNIQUE_WORK = [
    "Complete 3 sessions with unique work intervals",
    "Complete 6 sessions with unique work intervals",
]
const CHALLENGES_UNIQUE_WORK_XP = {
    [CHALLENGES_UNIQUE_WORK[0]]: 500,
    [CHALLENGES_UNIQUE_WORK[1]]: 1000,
}
const CHALLENGES_UNIQUE_WORK_METRIC = {
    [CHALLENGES_UNIQUE_WORK[0]]: 3,
    [CHALLENGES_UNIQUE_WORK[1]]: 6,
}

export const WEEKLY_CHALLENGES = [
    ...CHALLENGES_SINGLE_SESSION,
    ...CHALLENGES_MULTIPLE_SESSIONS,
    ...CHALLENGES_SINGLE_DAY,
    ...CHALLENGES_TOTAL_MINUTES,
    ...CHALLENGES_UNIQUE_WORK
]
  
export const WEEKLY_CHALLENGES_XP = {
    ...CHALLENGES_SINGLE_SESSION_XP,
    ...CHALLENGES_MULTIPLE_SESSIONS_XP,
    ...CHALLENGES_SINGLE_DAY_XP,
    ...CHALLENGES_TOTAL_MINUTES_XP,
    ...CHALLENGES_UNIQUE_WORK_XP
}
  
export const WEEKLY_CHALLENGES_KEY_METRIC = {
    ...CHALLENGES_SINGLE_SESSION_METRIC,
    ...CHALLENGES_MULTIPLE_SESSIONS_METRIC,
    ...CHALLENGES_SINGLE_DAY_METRIC,
    ...CHALLENGES_TOTAL_MINUTES_METRIC,
    ...CHALLENGES_UNIQUE_WORK_METRIC
}

const TOTAL_WEEKLY_CHALLENGES = 3

export function getRandomChallenges() {
    const challengeCategories = [CHALLENGES_SINGLE_SESSION, CHALLENGES_MULTIPLE_SESSIONS, CHALLENGES_SINGLE_DAY, CHALLENGES_TOTAL_MINUTES, CHALLENGES_UNIQUE_WORK]
    const pickedChallenges = {}

    for (let i = 0; i < TOTAL_WEEKLY_CHALLENGES; i++) {
      const randomCategory = Math.floor(Math.random() * challengeCategories.length)
      const randomIndex = Math.floor(Math.random() * challengeCategories[randomCategory].length)
      const randomChallenge = challengeCategories[randomCategory][randomIndex]
      pickedChallenges[randomChallenge] = {xp: WEEKLY_CHALLENGES_XP[randomChallenge], metric: WEEKLY_CHALLENGES_KEY_METRIC[randomChallenge], progress: 0, dates: [], intervals: []}
      challengeCategories.splice(randomCategory, 1)
    }
  
    return pickedChallenges
}

function getWeekNumber(date) {
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7)
    const week1 = new Date(d.getFullYear(), 0, 4)
    return 1 + Math.round(((d - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7)
}

async function getAssignedChallenges(user) {
    try {
        const { data, error } = await supabase
            .from('challenges')
            .select('*')
            .eq('user_id', user.id)
            .single()
    
        if (error) {
            throw error
        }
    
        if (!data || !data.start_date) {
            return { challenges: null, expired: false }
        }

        const startDate = new Date(data.start_date);
        const startWeekNumber = getWeekNumber(startDate)
        const currentDate = new Date()
        const currentWeekNumber = getWeekNumber(currentDate)

        if (currentWeekNumber === startWeekNumber && startDate.getFullYear() === currentDate.getFullYear()) {
            return { challenges: data.challenges, expired: false }
        }
  
        return { challenges: null, expired: true }
    }
    catch (error) {
        return { challenges: null, expired: false }
    }
}

async function setAssignedChallenges(user, challenges) {
    const { data, error } = await supabase  // eslint-disable-line
    .from('challenges')
    .insert(
      [
        {
          user_id: user.id,
          start_date: new Date().toISOString(),
          challenges: challenges,
        },
      ],
      { returning: 'minimal' }
    )
  
    if (error) {
        return
    }
}

async function updateAssignedChallenges(user, challenges, addStartDate=false) {
    let updateObj = {
        challenges: challenges,
        start_date: new Date().toISOString(),
    }
    if (!addStartDate) {
        delete updateObj.start_date
    }
    const { data, error } = await supabase  // eslint-disable-line
    .from('challenges')
    .update(updateObj)
    .eq('user_id', user.id)
  
    if (error) {
        return
    }
}

export async function updateChallengeProgress(user, xpEarned, workBreakPair) {
    // Get the assigned challenges
    const { challenges, expired } = await getAssignedChallenges(user)  // eslint-disable-line
    let xpGained = 0
    let updated = false

    if (!challenges) {
        return { xpGained, updatedChallenges: null }
    }

    let updatedChallenges = { ...challenges }
    for (const [challengeText, attributes] of Object.entries(challenges)) {
        if (challengeText.includes('Complete a total of')) {
            const targetMinutes = parseInt(challengeText.split(' ')[4])
            if (attributes.progress !== attributes.metric) {
                updated = true
                const newProgress = attributes.progress + xpEarned
                updatedChallenges[challengeText].progress = newProgress >= targetMinutes ? targetMinutes : newProgress
                xpGained += newProgress >= targetMinutes ? attributes.xp : 0
            }
            continue
        }
        else if (challengeText.includes('Complete a')) {
            const targetWork = parseInt(challengeText.split(' ')[2])
            if (xpEarned < workBreakPair.work) {
                // user didn't complete a full session
                continue
            }
            if (attributes.progress !== 1) {
                updated = true
                updatedChallenges[challengeText].progress = workBreakPair.work === targetWork ? 1 : 0
                xpGained += workBreakPair.work === targetWork ? attributes.xp : 0
            }
            continue
        }
        else if (challengeText.includes('Complete')) {
            const targetNumber = parseInt(challengeText.split(' ')[1])
            if (attributes.progress !== targetNumber) {
                if (xpEarned < workBreakPair.work) {
                    // user didn't complete a full session
                    continue
                }
                updated = true
                const sessionsCompleted = Math.floor(xpEarned / workBreakPair.work)
                if (challengeText.includes('in one day')) {
                    const now = new Date()
                    const yesterday = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
                    updatedChallenges[challengeText].dates = updatedChallenges[challengeText].dates.filter((date) => new Date(date) >= yesterday)
                    for (let i = 0; i < sessionsCompleted; i++) {
                        let date = new Date().toISOString()
                        updatedChallenges[challengeText].dates.push(date)
                    }
                    const newProgress = updatedChallenges[challengeText].dates.length
                    updatedChallenges[challengeText].progress = newProgress >= targetNumber ? targetNumber : newProgress
                    xpGained += newProgress >= targetNumber ? attributes.xp : 0
                    continue
                }
                else if (challengeText.includes('with unique work intervals')) {
                    updatedChallenges[challengeText].intervals.push(workBreakPair.work)
                    const newProgress = updatedChallenges[challengeText].intervals.length
                    updatedChallenges[challengeText].progress = newProgress >= targetNumber ? targetNumber : newProgress
                    xpGained += newProgress >= targetNumber ? attributes.xp : 0
                    continue
                }
                else {
                    const newProgress = attributes.progress + sessionsCompleted
                    updatedChallenges[challengeText].progress = newProgress >= targetNumber ? targetNumber : newProgress
                    xpGained += newProgress >= targetNumber ? attributes.xp : 0
                }
            }
            continue
        }
    }
  
    // Update the assigned challenges in the database if needed
    if (updated) {
        await updateAssignedChallenges(user, updatedChallenges)
        return { xpGained, updatedChallenges }
    }

    return { xpGained, updatedChallenges: null }
}

export async function getCurrentChallenges(user) {
    let { challenges, expired } = await getAssignedChallenges(user)
  
    if (!challenges) {
      challenges = getRandomChallenges()
      expired ? await updateAssignedChallenges(user, challenges, true) : await setAssignedChallenges(user, challenges)
    }
  
    return challenges
}