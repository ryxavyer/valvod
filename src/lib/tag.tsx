import { ArrowUpFromDot, AudioLines, Book, BookCopy, BookDashed, BookUp2, Brain, Dices, Fence, Pickaxe, Shield, Sparkles, Swords, Tag } from 'lucide-react';

export enum TagGroupType {
    ATTACK = 'Attack',
    DEFENSE = 'Defense',
    IMPACT = 'Impact',
}

export enum TagType {
    DEFAULT = 'Default',
    RUSH = 'Rush',
    SPLIT = 'Split',
    FAKE = 'Fake',
    STACK = 'Stack',
    SETUP = 'Setup',
    ENTRY = 'Entry',
    UTIL = 'Utility Usage',
    IQ = '200 IQ',
    COMMS = 'Comms',
}

export const tagGroupTypeToJSX = (type: TagGroupType, className: string) => {
    switch (type) {
        case TagGroupType.ATTACK:
            return <Swords className={className}/>;
        case TagGroupType.DEFENSE:
            return <Shield className={className}/>;
        case TagGroupType.IMPACT:
            return <Sparkles className={className}/>;
        default:
            return <Tag className={className}/>;
    }
}

export const tagTypeToJSX = (type: TagType, className: string) => {
    switch (type) {
        case TagType.DEFAULT:
            return <Book className={className}/>;
        case TagType.RUSH:
            return <BookUp2 className={className}/>;
        case TagType.SPLIT:
            return <BookCopy className={className}/>;
        case TagType.FAKE:
            return <BookDashed className={className}/>;
        case TagType.STACK:
            return <Dices className={className}/>;
        case TagType.SETUP:
            return <Fence className={className}/>;
        case TagType.ENTRY:
            return <ArrowUpFromDot className={className}/>;
        case TagType.UTIL:
            return <Pickaxe className={className}/>;
        case TagType.IQ:
            return <Brain className={className}/>;
        case TagType.COMMS:
            return <AudioLines className={className}/>;
        default:
            return <Tag className={className}/>;

    }
}

export interface TagSelectType {
    name: TagGroupType | TagType,
    value: TagGroupType | TagType,
    icon: React.FC<React.SVGProps<SVGSVGElement>>,
}

export const TagGroupTypes = [
    { name: TagGroupType.ATTACK, value: TagGroupType.ATTACK, icon: Swords },
    { name: TagGroupType.DEFENSE, value: TagGroupType.DEFENSE, icon: Shield },
    { name: TagGroupType.IMPACT, value: TagGroupType.IMPACT, icon: Sparkles },
]

export const TagTypes = [
    { name: TagType.DEFAULT, value: TagType.DEFAULT, icon: Book },
    { name: TagType.RUSH, value: TagType.RUSH, icon: BookUp2 },
    { name: TagType.SPLIT, value: TagType.SPLIT, icon: BookCopy },
    { name: TagType.FAKE, value: TagType.FAKE, icon: BookDashed },
    { name: TagType.STACK, value: TagType.STACK, icon: Dices },
    { name: TagType.SETUP, value: TagType.SETUP, icon: Fence },
    { name: TagType.ENTRY, value: TagType.ENTRY, icon: ArrowUpFromDot },
    { name: TagType.UTIL, value: TagType.UTIL, icon: Pickaxe },
    { name: TagType.IQ, value: TagType.IQ, icon: Brain },
    { name: TagType.COMMS, value: TagType.COMMS, icon: AudioLines },
]

export const AttackTagTypes = [
    TagType.DEFAULT,
    TagType.RUSH,
    TagType.SPLIT,
    TagType.FAKE,
];

export const DefenseTagTypes = [
    TagType.STACK,
    TagType.SETUP,
];

export const ImpactTagTypes = [
    TagType.ENTRY,
    TagType.UTIL,
    TagType.IQ,
    TagType.COMMS,
];

export interface Tag {
    id: number;
    time: number;
    type: TagType;
    description: string;
}

export const TAG_BUFFER_SEC = 3;  // tags should preceed the key moment by a few seconds

export const isTagOfType = (tag: Tag, type: TagGroupType | TagType | null) => {
    if (!type) return true;
    if (
        AttackTagTypes.includes(tag.type) && type === TagGroupType.ATTACK ||
        DefenseTagTypes.includes(tag.type) && type === TagGroupType.DEFENSE ||
        ImpactTagTypes.includes(tag.type) && type === TagGroupType.IMPACT
    ) {
        return true;
    }
    return tag.type === type;
}
