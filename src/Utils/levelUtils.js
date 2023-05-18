const BASE_XP_PER_LEVEL = 30
const XP_GROWTH = 1.1

export function calculateTotalLevelXP(level) {
    return Math.round(level * BASE_XP_PER_LEVEL * XP_GROWTH)
}

export function getLevelProgress(level, xp) {
    const total = calculateTotalLevelXP(level)
    return xp / total
}

export function getUpdatedLevelProgress(level, xp) {
    const levelUps = Math.floor(getLevelProgress(level, xp))
    if (levelUps > 0) {
        const updatedLevel = level + levelUps
        let totalXPforLevels = 0
        for (let i=level; i<updatedLevel; i++) {
            totalXPforLevels += calculateTotalLevelXP(i)
        }
        const updatedXP = Math.round(xp - totalXPforLevels)

        return {updatedLevel: updatedLevel, updatedXP: updatedXP}
    }

    return {updatedLevel: level, updatedXP: xp}
}

export function getLevelProgressClass(level, xp) {
    const ratio = getLevelProgress(level, xp)

    if (ratio === 0) return "w-0"
    if (ratio > 0 && ratio < .083) return "w-2"
    if (ratio >= .083 && ratio < .166) return "w-1/12"
    if (ratio >= .166 && ratio < .250) return "w-2/12"
    if (ratio >= .250 && ratio < .333) return "w-3/12"
    if (ratio >= .333 && ratio < .416) return "w-4/12"
    if (ratio >= .416 && ratio < .50) return "w-5/12"
    if (ratio >= .50 && ratio < .583) return "w-6/12"
    if (ratio >= .583 && ratio < .6666) return "w-7/12"
    if (ratio >= .6666 && ratio < .75) return "w-8/12"
    if (ratio >= .75 && ratio < .833) return "w-9/12"
    if (ratio >= .833 && ratio < .916) return "w-10/12"
    if (ratio >= .916 && ratio < 1) return "w-11/12"
    if (ratio >= 1) return "w-full"

    return ""
}

export function getLevelColorClass(level) {
    if (level < 10) return "bg-[#6e6e6e]"
    if (level < 25) return "bg-[#6f584b]"
    if (level < 50) return "bg-[#ba9818]"
    if (level < 75) return "bg-[#05855e]"
    if (level < 100) return "bg-[#b52452]"

    return "bg-[#6B21A8]"
}