import Duelist from '@public/VALORANT/roles/duelist.svg';
import Controller from '@public/VALORANT/roles/controller.svg';
import Initiator from '@public/VALORANT/roles/initiator.svg';
import Sentinel from '@public/VALORANT/roles/sentinel.svg';
import { VODWithTags } from '@src/app/api/youtube/types';

// vod_importance field (0 -> 1) is for sorting carousel / links outside of recommender
// just using my own ideas about how useful reviewing vods is for the agent for now
// considering agent popularity, lineup reliance, unique ability game sense, etc.
export const AGENTS = [
    {name: "Astra", value: "astra", icon_small: "VALORANT/agents/41FB69C1-4189-7B37-F117-BCAF1E96F1BF_small.png", bg_hex: "#2c1972", role_hex: "#a894e9", vod_importance: 0.5},
    {name: "Breach", value: "breach", icon_small: "VALORANT/agents/5F8D3A7F-467B-97F3-062C-13ACF203C006_small.png", bg_hex: "#5c2915", role_hex: "#fcc362", vod_importance: 0.4},
    {name: "Brimstone", value: "brimstone", icon_small: "VALORANT/agents/9F0D8BA9-4140-B941-57D3-A7AD57C6B417_small.png", bg_hex: "#7f2105", role_hex: "#f5dfb0", vod_importance: 0.4},
    {name: "Chamber", value: "chamber", icon_small: "VALORANT/agents/22697A3D-45BF-8DD7-4FEC-84A9E28C69D7_small.png", bg_hex: "#562e24", role_hex: "#d3b872", vod_importance: 0.4},
    {name: "Clove", value: "clove", icon_small: "VALORANT/agents/1DBF2EDD-4729-0984-3115-DAA5EED44993_small.png", bg_hex: "#354a75", role_hex: "#e2ac97", vod_importance: 0.5},
    {name: "Cypher", value: "cypher", icon_small: "VALORANT/agents/117ED9E3-49F3-6512-3CCF-0CADA7E3823B_small.png", bg_hex: "#043c39", role_hex: "#76f9fa", vod_importance: 0.8},
    {name: "Deadlock", value: "deadlock", icon_small: "VALORANT/agents/CC8B64C8-4B25-4FF9-6E7F-37B4DA43D235_small.png", bg_hex: "#150414", role_hex: "#e5c79c", vod_importance: 0.7},
    {name: "Fade", value: "fade", icon_small: "VALORANT/agents/DADE69B4-4F5A-8528-247B-219E5A1FACD6_small.png", bg_hex: "#040d14", role_hex: "#e6edee", vod_importance: 0.6},
    {name: "Gekko", value: "gekko", icon_small: "VALORANT/agents/E370FA57-4757-3604-3648-499E1F642D3F_small.png", bg_hex: "#50324c", role_hex: "#c1e177", vod_importance: 0.6},
    {name: "Harbor", value: "harbor", icon_small: "VALORANT/agents/95B78ED7-4637-86D9-7E41-71BA8C293152_small.png", bg_hex: "#465a4e", role_hex: "#a1b2cf", vod_importance: 0.5},
    {name: "Iso", value: "iso", icon_small: "VALORANT/agents/0E38B510-41A8-5780-5E8F-568B2A4F2D6C_small.png", bg_hex: "#2e2e38", role_hex: "#8e78ee", vod_importance: 0.6},
    {name: "Jett", value: "jett", icon_small: "VALORANT/agents/ADD6443A-41BD-E414-F6AD-E58D267F4E95_small.png", bg_hex: "#2c5b76", role_hex: "#fff", vod_importance: 0.9},
    {name: "Kay/o", value: "kayo", icon_small: "VALORANT/agents/601DBBE7-43CE-BE57-2A40-4ABD24953621_small.png", bg_hex: "#0f1d5c", role_hex: "#d2abf7", vod_importance: 0.4},  // low prio for now bc no vods
    {name: "Killjoy", value: "killjoy", icon_small: "VALORANT/agents/1E58DE9C-4950-5125-93E9-A0AEE9F98746_small.png", bg_hex: "#133362", role_hex: "#f7dd30", vod_importance: 0.8},
    {name: "Neon", value: "neon", icon_small: "VALORANT/agents/BB2A4828-46EB-8CD1-E765-15848195D751_small.png", bg_hex: "#04247b", role_hex: "#79caf0", vod_importance: 0.7},
    {name: "Omen", value: "omen", icon_small: "VALORANT/agents/8E253930-4C05-31DD-1B6C-968525494517_small.png", bg_hex: "#062661", role_hex: "#8485bc", vod_importance: 0.7},
    {name: "Phoenix", value: "phoenix", icon_small: "VALORANT/agents/EB93336A-449B-9C1B-0A54-A891F7921D69_small.png", bg_hex: "#6e2111", role_hex: "#ffd099", vod_importance: 0.5},
    {name: "Raze", value: "raze", icon_small: "VALORANT/agents/F94C3B30-42BE-E959-889C-5AA313DBA261_small.png", bg_hex: "#5b251b", role_hex: "#e69840", vod_importance: 0.7},
    {name: "Reyna", value: "reyna", icon_small: "VALORANT/agents/A3BFB853-43B2-7238-A4F1-AD90E9E46BCC_small.png", bg_hex: "#921772", role_hex: "#de84d9", vod_importance: 0.5},
    {name: "Sage", value: "sage", icon_small: "VALORANT/agents/569FDD95-4D10-43AB-CA70-79BECC718B46_small.png", bg_hex: "#2b2d30", role_hex: "#84ffe7", vod_importance: 0.5},
    {name: "Skye", value: "skye", icon_small: "VALORANT/agents/6F2A04CA-43E0-BE17-7F36-B3908627744D_small.png", bg_hex: "#641c04", role_hex: "#b3dd8b", vod_importance: 0.6},
    {name: "Sova", value: "sova", icon_small: "VALORANT/agents/320B2A48-4D9B-A075-30F1-1F93A9B638FA_small.png", bg_hex: "#136370", role_hex: "#d9e6d2", vod_importance: 0.9},
    {name: "Tejo", value: "tejo", icon_small: "VALORANT/agents/B444168C-4E35-8076-DB47-EF9BF368F384_small.png", bg_hex: "#6e3c17", role_hex: "#f7d782", vod_importance: 0.6},
    {name: "Viper", value: "viper", icon_small: "VALORANT/agents/707EAB51-4836-F488-046A-CDA6BF494859_small.png", bg_hex: "#110b15", role_hex: "#509730", vod_importance: 0.7},
    {name: "Vyse", value: "vyse", icon_small: "VALORANT/agents/EFBA5359-4016-A1E5-7626-B1AE76895940_small.png", bg_hex: "#2d2465", role_hex: "#efc971", vod_importance: 0.8},
    {name: "Waylay", value: "waylay", icon_small: "VALORANT/agents/DF1CB487-4902-002E-5C17-D28E83E78588_small.png", bg_hex: "#6c341d", role_hex: "#f1c957", vod_importance: 0.5},
    {name: "Yoru", value: "yoru", icon_small: "VALORANT/agents/7F94D92C-4234-0A36-9646-3A87EB8B5C89.png", bg_hex: "#0f1d5c", role_hex: "#6f9ed2", vod_importance: 0.8},
];
const AGENTS_TAGS = new Set(AGENTS.map(agent => agent.value));

export const ROLES = [
    {name: "Controller", value: "controller"},
    {name: "Duelist", value: "duelist"},
    {name: "Initiator", value: "initiator"},
    {name: "Sentinel", value: "sentinel"},
]
const ROLES_TAGS = new Set(ROLES.map(role => role.value));
export const roleTagToJSX = (tag: Tags, className: string) => {
    switch (tag.name) {
        case "Controller":
            return <Controller alt="Controller" className={className}/>;
        case "Duelist":
            return <Duelist alt="Duelist" className={className}/>;
        case "Initiator":
            return <Initiator alt="Initiator" className={className}/>;
        case "Sentinel":
            return <Sentinel alt="Sentinel" className={className}/>;
        default:
            return <img alt='Unknown role' className={className}/>;
    }
}

const CONTROLLERS = new Set([
    "astra",
    "brimstone",
    "clove",
    "viper",
    "omen",
    "harbor",
]);
const DUELISTS = new Set([
    "iso",
    "jett",
    "phoenix",
    "neon",
    "raze",
    "reyna",
    "waylay",
    "yoru",
]);
const INITIATORS = new Set([
    "breach",
    "fade",
    "gekko",
    "kayo",
    "skye",
    "sova",
    "tejo",
]);
const SENTINELS = new Set([
    "chamber",
    "cypher",
    "killjoy",
    "sage",
    "deadlock",
    "vyse",
]);
export const agentToRole = (agent: string): string => {
    if (CONTROLLERS.has(agent)) {
        return "controller";
    } else if (DUELISTS.has(agent)) {
        return "duelist";
    } else if (INITIATORS.has(agent)) {
        return "initiator";
    } else if (SENTINELS.has(agent)) {
        return "sentinel";
    }
    return "unknown";
}
export const roleToJSX = (role: string, className: string) => {
    switch (role) {
        case "controller":
            return <Controller alt="Controller" className={className}/>;
        case "duelist":
            return <Duelist alt="Duelist" className={className}/>;
        case "initiator":
            return <Initiator alt="Initiator" className={className}/>;
        case "sentinel":
            return <Sentinel alt="Sentinel" className={className}/>;
        default:
            return <img alt='Unknown role' className={className}/>;
    }
}

export const MAPS = [
    {name: "Ascent", value: "ascent"},
    {name: "Abyss", value: "abyss"},
    {name: "Bind", value: "bind"},
    {name: "Breeze", value: "breeze"},
    {name: "Fracture", value: "fracture"},
    {name: "Haven", value: "haven"},
    {name: "Icebox", value: "icebox"},
    {name: "Lotus", value: "lotus"},
    {name: "Pearl", value: "pearl"},
    {name: "Split", value: "split"},
    {name: "Sunset", value: "sunset"},
];
const MAPS_TAGS = new Set(MAPS.map(map => map.value));

// const TEAMS = [
//     {name: "100 Thieves", slug:"100t", values: ["100 thieves", "100thieves", "100t"]},
//     {name: "Sentinels", slug: "sen", values: ["sentinels", "sen"]},
//     {name: "T1", slug: "t1", values: ["t1"]},
//     {name: "Leviatan", slug: "lev", values: ["leviatan", "lev"]},
//     {name: "Loud", slug: "loud", values: ["loud"]},
//     {name: "Furia", slug: "fur", values: ["furia", "fur"]},
//     {name: "Kru", slug: "kru", values: ["kru"]},
//     {name: "G2", slug: "g2", values: ["g2"]},
//     {name: "Fnatic", slug: "fnc", values: ["fnatic", "fnc"]},
//     {name: "Cloud9", slug: "c9", values: ["cloud9", "cloud 9", "c9"]},
//     {name: "YFP", slug: "yfp", values: ["yfp"]},
//     {name: "Vitality", slug: "vit", values: ["vitality", "vit"]},
//     {name: "GenG", slug: "gen", values: ["geng", "gen"]},
//     {name: "FUT", slug: "fut", values: ["fut"]},
//     {name: "MIBR", slug: "mibr", values: ["mibr"]},
//     {name: "Paper Rex", slug: "prx", values: ["paper rex", "paperrex", "prx"]},
//     {name: "EDward Gaming", slug: "edg", values: ["edward gaming", "edwardgaming", "edg"]},
//     {name: "DRX", slug: "drx", values: ["drx"]},
//     {name: "Shopify Rebellion", slug: "sr", values: ["shopify rebellion", "shopifyrebellion", "sr"]},
//     {name: "Bilibili Gaming", slug: "blg", values: ["bilibili gaming", "bilibiligaming", "blg"]},
//     {name: "Evil Geniuses", slug: "eg", values: ["evil geniuses", "evilgeniuses", "eg"]},
//     {name: "NRG", slug: "nrg", values: ["nrg"]},
//     {name: "Team Heretics", slug: "th", values: ["team heretics", "teamheretics", "th"]},
// ]
// const TEAMS_WITH_REGEX = TEAMS.map(team => ({
//     name: team.name,
//     slug: team.slug,
//     regex: compileRegexFromValues(team.values),
// }));

const TOURS = [
    {name: "Champions", values: ["champions"]},
    {name: "Masters", values: ["masters"]},
    {name: "Challengers", values: ["challengers"]},
    {name: "Game Changers", values: ["game changers", "gamechangers", "game-changers"]},
]
const TOURS_WITH_REGEX = TOURS.map(tour => ({
    name: tour.name,
    regex: compileRegexFromValues(tour.values),
}));

const RANKS = [
    {name: "Iron", value: "iron"},
    {name: "Bronze", value: "bronze"},
    {name: "Silver", value: "silver"},
    {name: "Gold", value: "gold"},
    {name: "Platinum", value: "platinum"},
    {name: "Diamond", value: "diamond"},
    {name: "Ascendant", value: "ascendant"},
    {name: "Immortal", value: "immortal"},
    {name: "Radiant", value: "radiant"},
];
const RANKS_TAGS = new Set(RANKS.map(rank => rank.value));

export enum TagType {
    AGENT = "agent",
    MAP = "map",
    ROLE = "role",
    TEAM = "team",
    TOUR = "tour",
}

export interface Tags {
    type: TagType;
    name: string;
}

/**
 * Escapes special regex characters in a string.
*/
function escapeRegExp(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
  
/**
 * Compiles an array of strings into a regular expression.
 * If desired, you could wrap the pattern in word boundaries (\b),
 * but be aware that this might not match well if your values contain punctuation.
 *
 * @param values - The array of strings to compile.
 * @returns A RegExp that matches any of the values (case-insensitively).
*/
function compileRegexFromValues(values: string[]): RegExp {
    // Escape each string and join with the OR operator.
    const pattern = values.map(value => escapeRegExp(`${value}`)).join('|');
    // You could add word boundaries if that fits your use case:
    // const pattern = `\\b(?:${values.map(escapeRegExp).join('|')})\\b`;
    return new RegExp(pattern, 'i'); // 'i' flag for case-insensitivity
}

const getTag = (name: string): Tags | undefined => {
    if (AGENTS_TAGS.has(name)) {
        return {type: TagType.AGENT, name};
    } else if (MAPS_TAGS.has(name)) {
        return {type: TagType.MAP, name};
    } else if (ROLES_TAGS.has(name)) {
        return {type: TagType.ROLE, name};
    } 
    // else {
    //     for (const team of TEAMS) {
    //         if (team.slug === name) {
    //             return {type: TagType.TEAM, name: team.slug};
    //         }
    //     }
    //     for (const tour of TOURS) {
    //         if (tour.name === name) {
    //             return {type: TagType.TOUR, name: tour.name};
    //         }
    //     }
    // }
    return undefined;
}

export const getTags = (title: string): Tags[] => {
    const tags = [];
    const words = title.replace(/[^a-zA-Z ]/g, "").toLowerCase().split(" ");
    let hasAgent: boolean, hasMap: boolean, hasRole: boolean = false;
    for (const word of words) {
        if (hasAgent && hasMap && hasRole) {
            break;
        }
        if (!hasAgent && AGENTS_TAGS.has(word)) {
            tags.push({type: TagType.AGENT, name: word});
            if (CONTROLLERS.has(word)) {
                tags.push({type: TagType.ROLE, name: "Controller"});
                hasRole = true;
            } else if (DUELISTS.has(word)) {
                tags.push({type: TagType.ROLE, name: "Duelist"});
                hasRole = true;
            } else if (INITIATORS.has(word)) {
                tags.push({type: TagType.ROLE, name: "Initiator"});
                hasRole = true;
            } else if (SENTINELS.has(word)) {
                tags.push({type: TagType.ROLE, name: "Sentinel"});
                hasRole = true;
            }
            hasAgent = true;
        } else if (!hasMap && MAPS_TAGS.has(word)) {
            tags.push({type: TagType.MAP, name: word});
            hasMap = true;
        }
    }
    // for (const team of TEAMS_WITH_REGEX) {
    //     if (team.regex.test(title)) {
    //         // gotchas with team names
    //         const titleLower = title.toLowerCase();
    //         if (
    //             (team.slug === "loud" && (titleLower.includes("cloud9") || titleLower.includes("cloud 9"))) ||
    //             (team.slug === "eg" && titleLower.includes("eggster") ||
    //             (team.slug === "gen" && titleLower.includes("agent")) ||
    //             (team.slug === "th" && (titleLower.includes("the") || titleLower.includes("dasnerth"))) ||
    //             ((team.slug === "eg" || team.slug === "gen" ) && titleLower.includes("legend"))
    //         ) 
    //         ) {
    //             continue;
    //         }
    //         tags.push({type: TagType.TEAM, name: team.slug});
    //     }
    // }
    // for (const tour of TOURS_WITH_REGEX) {
    //     if (tour.regex.test(title)) {
    //         tags.push({type: TagType.TOUR, name: tour.name });
    //         break;
    //     }
    // }
    // sort tags by type - team, tour, map, agent, role
    tags.sort((a, b) => {
            if (a.type === b.type) {
                return a.name.localeCompare(b.name);
            }
            if (a.type === TagType.TEAM) {
                return -1;
            }
            if (a.type === TagType.TOUR) {
                if (b.type === TagType.TEAM) {
                    return 1;
                }
                return -1;
            }
            if (a.type === TagType.MAP) {
                if (b.type === TagType.TEAM || b.type === TagType.TOUR) {
                    return 1;
                }
                return -1;
            }
            if (a.type === TagType.AGENT) {
                if (b.type === TagType.ROLE) {
                    return -1;
                }
                return 1;
            }
            return 1;
        }
    );
    return tags;
}

export const getSearchResults = (vods: VODWithTags[], searchString: string): VODWithTags[] => {
    const shouldReturnInSearch = (vodTags: Tags[], searchTags: Tags[]): boolean => {
        // tags of the same type are OR'd together and those requirements are AND'd together
        const requiredTagsByType = new Map<string, Set<string>>();
        for (const tag of searchTags) {
            if (!requiredTagsByType.has(tag.type)) {
                requiredTagsByType.set(tag.type, new Set());
            }
            // name should be lowercase already but just in case
            requiredTagsByType.get(tag.type).add(tag.name.toLowerCase());
        }
        const isOnlyMapSearch = searchTags.length === 1 && searchTags[0].type === TagType.MAP;
        // for each type in the search criteria, check that vodTags contains at least one matching tag
        // map type is an exception since inconsistently added to titles
        for (const [type, requiredNames] of requiredTagsByType.entries()) {
            const vodTagsForType = vodTags.filter(tag => tag.type === type);
            const matchFound = vodTagsForType.some(tag => requiredNames.has(tag.name.toLowerCase()));
            if (!matchFound && (type !== TagType.MAP || isOnlyMapSearch)) {
                return false;
            }
        }
        return true;
    }

    const searchTags = getTags(searchString);
    let res = vods.filter(vod => shouldReturnInSearch(vod.tags, searchTags));
    // sort into: vods with map tag match, vods without - then by published_at in each group
    res.sort((a, b) => {
        const aHasSearchMap = a.tags.some(tag => tag.type === TagType.MAP && searchTags.some(searchTag => searchTag.name === tag.name));
        const bHasSearchMap = b.tags.some(tag => tag.type === TagType.MAP && searchTags.some(searchTag => searchTag.name === tag.name));
        if (aHasSearchMap && !bHasSearchMap) {
            return -1;
        }
        if (!aHasSearchMap && bHasSearchMap) {
            return 1;
        }
        const aHasAnyMap = a.tags.some(tag => tag.type === TagType.MAP);
        const bHasAnyMap = b.tags.some(tag => tag.type === TagType.MAP);
        if (aHasAnyMap && !bHasAnyMap) {
            return -1;
        }
        if (!aHasAnyMap && bHasAnyMap) {
            return 1;
        }
        return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
    });
    return res
}

export const getRelatedResults = (vods: VODWithTags[], title: string): VODWithTags[] => {
    const shouldReturnInRelated = (vodTags: Tags[], searchTags: Tags[]): boolean => {
        // tags of the same type are OR'd together and those requirements are AND'd together
        const requiredTagsByType = new Map<string, Set<string>>();
        for (const tag of searchTags) {
            // we only care about agent and map for related
            if (tag.type !== TagType.AGENT && tag.type !== TagType.MAP) {
                continue;
            }
            if (!requiredTagsByType.has(tag.type)) {
                requiredTagsByType.set(tag.type, new Set());
            }
            // name should be lowercase already but just in case
            requiredTagsByType.get(tag.type).add(tag.name.toLowerCase());
        }
        const isOnlyMapSearch = searchTags.length === 1 && searchTags[0].type === TagType.MAP;
        // for each type in the search criteria, check that vodTags contains at least one matching tag
        // map type is an exception since inconsistently added to titles
        for (const [type, requiredNames] of requiredTagsByType.entries()) {
            const vodTagsForType = vodTags.filter(tag => tag.type === type);
            const matchFound = vodTagsForType.some(tag => requiredNames.has(tag.name.toLowerCase()));
            if (!matchFound && (type !== TagType.MAP || isOnlyMapSearch)) {
                return false;
            }
        }
        return true;
    }

    const searchTags = getTags(title);
    let res = vods.filter(vod => shouldReturnInRelated(vod.tags, searchTags));
    // sort into: vods with map tag match, vods without - then by published_at in each group
    res.sort((a, b) => {
        const aHasTitleMap = a.tags.some(tag => tag.type === TagType.MAP && searchTags.some(searchTag => searchTag.name === tag.name));
        const bHasTitleMap = b.tags.some(tag => tag.type === TagType.MAP && searchTags.some(searchTag => searchTag.name === tag.name));
        if (aHasTitleMap && !bHasTitleMap) {
            return -1;
        }
        if (!aHasTitleMap && bHasTitleMap) {
            return 1;
        }
        const aHasAnyMap = a.tags.some(tag => tag.type === TagType.MAP);
        const bHasAnyMap = b.tags.some(tag => tag.type === TagType.MAP);
        if (aHasAnyMap && !bHasAnyMap) {
            return -1;
        }
        if (!aHasAnyMap && bHasAnyMap) {
            return 1;
        }
        return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
    });
    return res
}
