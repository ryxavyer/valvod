import { supabase } from '../supabaseClient'

export const WEEKLY_CHALLENGES = [
    "Complete a 25 minute session",
    "Complete a 50 minute session",
    "Complete a 150 minute session",
    "Complete 5 sessions",
    "Complete 10 sessions",
    "Complete 20 sessions",
    "Complete 3 sessions in one day",
    "Complete 6 sessions in one day",
    "Complete a total of 500 minutes in sessions",
    "Complete a total of 1000 minutes in sessions",
    "Complete 3 sessions with unique work-break intervals",
    "Complete 6 sessions with unique work-break intervals",
]
  
export const WEEKLY_CHALLENGES_XP = {
    [WEEKLY_CHALLENGES[0]]: 100,
    [WEEKLY_CHALLENGES[1]]: 150,
    [WEEKLY_CHALLENGES[2]]: 350,
    [WEEKLY_CHALLENGES[3]]: 300,
    [WEEKLY_CHALLENGES[4]]: 600,
    [WEEKLY_CHALLENGES[5]]: 1200,
    [WEEKLY_CHALLENGES[6]]: 500,
    [WEEKLY_CHALLENGES[7]]: 1000,
    [WEEKLY_CHALLENGES[8]]: 750,
    [WEEKLY_CHALLENGES[9]]: 1500,
    [WEEKLY_CHALLENGES[10]]: 500,
    [WEEKLY_CHALLENGES[11]]: 1000,
}
  
export const WEEKLY_CHALLENGES_KEY_METRIC = {
    [WEEKLY_CHALLENGES[0]]: 1,
    [WEEKLY_CHALLENGES[1]]: 1,
    [WEEKLY_CHALLENGES[2]]: 1,
    [WEEKLY_CHALLENGES[3]]: 5,
    [WEEKLY_CHALLENGES[4]]: 10,
    [WEEKLY_CHALLENGES[5]]: 20,
    [WEEKLY_CHALLENGES[6]]: 3,
    [WEEKLY_CHALLENGES[7]]: 6,
    [WEEKLY_CHALLENGES[8]]: 500,
    [WEEKLY_CHALLENGES[9]]: 1000,
    [WEEKLY_CHALLENGES[10]]: 3,
    [WEEKLY_CHALLENGES[11]]: 6,
}

const TOTAL_WEEKLY_CHALLENGES = 3

export function getRandomChallenges() {
    const challengeKeys = Object.keys(WEEKLY_CHALLENGES_XP)
    const pickedChallenges = {}

    for (let i = 0; i < TOTAL_WEEKLY_CHALLENGES; i++) {
      const randomIndex = Math.floor(Math.random() * challengeKeys.length)
      const randomChallenge = challengeKeys[randomIndex]
      pickedChallenges[randomChallenge] = {xp: WEEKLY_CHALLENGES_XP[randomChallenge], metric: WEEKLY_CHALLENGES_KEY_METRIC[randomChallenge], progress: 0, dates: null, intervals: null}
      challengeKeys.splice(randomIndex, 1)
    }
  
    return pickedChallenges
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
            return null
        }

        const startDate = new Date(data.start_date)
        const currentDate = new Date()
        const daysDifference = (currentDate - startDate) / (1000 * 60 * 60 * 24)
    
        if (daysDifference < 7 && startDate.getDay() <= currentDate.getDay()) {
            return data.challenges
        }
  
        return null
    }
    catch (error) {
        return null
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

async function updateAssignedChallenges(user, challenges) {
    const { data, error } = await supabase  // eslint-disable-line
    .from('challenges')
    .update({ challenges: challenges })
    .eq('user_id', user.id)
  
    if (error) {
        return
    }
}

export async function updateChallengeProgress(user, xpEarned, workBreakPair) {
    // Get the assigned challenges
    const assignedChallenges = await getAssignedChallenges(user)
    let xpGained = 0
    let updated = false
  
    if (!assignedChallenges) {
      return { xpGained, updatedChallenges: null }
    }

    let updatedChallenges = { ...assignedChallenges }
    for (const [challengeText, attributes] of Object.entries(assignedChallenges)) {
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
            if (attributes.progress !== targetWork) {
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
                if (challengeText.includes('in one day')) {
                    if (attributes.dates === null) {
                        updatedChallenges[challengeText].dates = new Set()
                    }
                    const now = new Date()
                    const yesterday = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
                    for (const date of attributes.dates) {
                        if (new Date(date) < yesterday) {
                            updatedChallenges[challengeText].dates.delete(date)
                            updatedChallenges[challengeText].progress -= 1
                        }
                    }
                    updatedChallenges[challengeText].dates.add(now.toISOString())
                    const newProgress = updatedChallenges[challengeText].dates.size
                    updatedChallenges[challengeText].progress = newProgress >= targetNumber ? targetNumber : newProgress
                    xpGained += newProgress >= targetNumber ? attributes.xp : 0
                    continue
                }
                else if (challengeText.includes('with unique work-break intervals')) {
                    if (attributes.intervals === null) {
                        updatedChallenges[challengeText].intervals = new Set()
                    }
                    updatedChallenges[challengeText].intervals.add(workBreakPair)
                    const newProgress = updatedChallenges[challengeText].intervals.size
                    updatedChallenges[challengeText].progress = newProgress >= targetNumber ? targetNumber : newProgress
                    xpGained += newProgress >= targetNumber ? attributes.xp : 0
                    continue
                }
                else {
                    const newProgress = attributes.progress + 1
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
    let assignedChallenges = await getAssignedChallenges(user)
  
    if (!assignedChallenges) {
      assignedChallenges = getRandomChallenges()
      await setAssignedChallenges(user, assignedChallenges)
    }
  
    return assignedChallenges
}