export const POMODORO_TIMER = {WORK_LIST: [25,50,75,100,125,150], BREAK_LIST: [5,10,15,20,25,30]}


export const getCorrespondingBreak = (min) => {
    const canDivideBy = Math.floor(min / 30)
    if (canDivideBy === 0) return 30 - min
    
    const nextMilestone = 30*(canDivideBy+1)
    return nextMilestone - min
}