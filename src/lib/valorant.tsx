import Duelist from '@public/VALORANT/roles/duelist.svg';
import Controller from '@public/VALORANT/roles/controller.svg';
import Initiator from '@public/VALORANT/roles/initiator.svg';
import Sentinel from '@public/VALORANT/roles/sentinel.svg';
import { VODWithTags } from '@src/app/api/youtube/types';


export const AGENTS = [
    {name: "Astra", value: "astra"},
    {name: "Breach", value: "breach"},
    {name: "Brimstone", value: "brimstone"},
    {name: "Chamber", value: "chamber"},
    {name: "Clove", value: "clove"},
    {name: "Cypher", value: "cypher"},
    {name: "Deadlock", value: "deadlock"},
    {name: "Fade", value: "fade"},
    {name: "Gekko", value: "gekko"},
    {name: "Harbor", value: "harbor"},
    {name: "Iso", value: "iso"},
    {name: "Jett", value: "jett"},
    {name: "Kay/o", value: "kayo"},
    {name: "Killjoy", value: "killjoy"},
    {name: "Neon", value: "neon"},
    {name: "Omen", value: "omen"},
    {name: "Phoenix", value: "phoenix"},
    {name: "Raze", value: "raze"},
    {name: "Reyna", value: "reyna"},
    {name: "Sage", value: "sage"},
    {name: "Skye", value: "skye"},
    {name: "Sova", value: "sova"},
    {name: "Tejo", value: "tejo"},
    {name: "Viper", value: "viper"},
    {name: "Vyse", value: "vyse"},
    {name: "Waylay", value: "waylay"},
    {name: "Yoru", value: "yoru"},
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

const TEAMS = [
    {name: "100 Thieves", slug:"100t", values: ["100 thieves", "100thieves", "100t"]},
    {name: "Sentinels", slug: "sen", values: ["sentinels", "sen"]},
    {name: "T1", slug: "t1", values: ["t1"]},
    {name: "Leviatan", slug: "lev", values: ["leviatan", "lev"]},
    {name: "Loud", slug: "loud", values: ["loud"]},
    {name: "Furia", slug: "fur", values: ["furia", "fur"]},
    {name: "Kru", slug: "kru", values: ["kru"]},
    {name: "G2", slug: "g2", values: ["g2"]},
    {name: "Fnatic", slug: "fnc", values: ["fnatic", "fnc"]},
    {name: "Cloud9", slug: "c9", values: ["cloud9", "cloud 9", "c9"]},
    {name: "YFP", slug: "yfp", values: ["yfp"]},
    {name: "Vitality", slug: "vit", values: ["vitality", "vit"]},
    {name: "GenG", slug: "gen", values: ["geng", "gen"]},
    {name: "FUT", slug: "fut", values: ["fut"]},
    {name: "MIBR", slug: "mibr", values: ["mibr"]},
    {name: "Paper Rex", slug: "prx", values: ["paper rex", "paperrex", "prx"]},
    {name: "EDward Gaming", slug: "edg", values: ["edward gaming", "edwardgaming", "edg"]},
    {name: "DRX", slug: "drx", values: ["drx"]},
    {name: "Shopify Rebellion", slug: "sr", values: ["shopify rebellion", "shopifyrebellion", "sr"]},
    {name: "Bilibili Gaming", slug: "blg", values: ["bilibili gaming", "bilibiligaming", "blg"]},
    {name: "Evil Geniuses", slug: "eg", values: ["evil geniuses", "evilgeniuses", "eg"]},
    {name: "NRG", slug: "nrg", values: ["nrg"]},
]
const TEAMS_WITH_REGEX = TEAMS.map(team => ({
    name: team.name,
    slug: team.slug,
    regex: compileRegexFromValues(team.values),
}));

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
    } else {
        for (const team of TEAMS) {
            if (team.slug === name) {
                return {type: TagType.TEAM, name: team.slug};
            }
        }
        for (const tour of TOURS) {
            if (tour.name === name) {
                return {type: TagType.TOUR, name: tour.name};
            }
        }
    }
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
    for (const team of TEAMS_WITH_REGEX) {
        if (team.regex.test(title)) {
            // gotchas with team names
            if (
                (team.slug === "loud" && (title.toLowerCase().includes("cloud9") || title.toLowerCase().includes("cloud 9"))) ||
                (team.slug === "eg" && title.toLowerCase().includes("eggster"))
            ) {
                continue;
            }
            tags.push({type: TagType.TEAM, name: team.slug});
        }
    }
    for (const tour of TOURS_WITH_REGEX) {
        if (tour.regex.test(title)) {
            tags.push({type: TagType.TOUR, name: tour.name });
            break;
        }
    }
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

export const getSearchResults = (vods: VODWithTags[], searchString: string): VODWithTags[] => {
    const searchTags = getTags(searchString);
    let res = vods.filter(vod => shouldReturnInSearch(vod.tags, searchTags));
    // sort into: vods with map tag match, vods without - then by published_at in each group
    res.sort((a, b) => {
        const aHasMap = a.tags.some(tag => tag.type === TagType.MAP && searchTags.some(searchTag => searchTag.name === tag.name));
        const bHasMap = b.tags.some(tag => tag.type === TagType.MAP && searchTags.some(searchTag => searchTag.name === tag.name));
        if (aHasMap && !bHasMap) {
            return -1;
        }
        if (!aHasMap && bHasMap) {
            return 1;
        }
        return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
    });
    return res
}
