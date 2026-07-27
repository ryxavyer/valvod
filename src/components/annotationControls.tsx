'use client'
import React, { useEffect, useRef, useState } from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@src/components/ui/tooltip";
import { ToggleGroup, ToggleGroupItem } from "@src/components/ui/toggle-group"
import { AttackTagTypes, DefenseTagTypes, ImpactTagTypes, TagGroupType, tagGroupTypeToJSX, TagType, tagTypeToJSX } from '@src/lib/tag';
import { Info, Star } from 'lucide-react';
import { Separator } from './ui/separator';
import { Button } from './ui/button';
import SignupModal from './signupModal';
import { Toggle } from './ui/toggle';
import { useParams } from 'next/navigation';
import { useToast } from '@src/hooks/use-toast';
import { User } from '@supabase/supabase-js';

interface AnnotationControlsProps {
    className?: string;
    user: User | null;
    addTag: (type: TagType) => void;
}

const FAVORITE_TOGGLE_CLASS = 'group w-[70px] border-secondary hover:bg-transparent hover:text-muted-foreground data-toggled:bg-transparent data-toggled:text-accent-foreground';

export const AnnotationControlsSkeleton = () => {
    return (
        <div className="h-full w-[75px] bg-muted animate-pulse rounded-lg rounded-bl-none rounded-tl-none" />
    );
};

const AnnotationControls = ({ className, user, addTag }: AnnotationControlsProps) => {
    const { videoId } = useParams();
    const { toast } = useToast();
    const [activeAnnotation, setActiveAnnotation] = useState<TagGroupType | null>(null);
    const [favorited, setFavorited] = useState(false);
    const attackTagsRef = useRef<HTMLButtonElement>(null);
    const defenseTagsRef = useRef<HTMLButtonElement>(null);
    const impactTagsRef = useRef<HTMLButtonElement>(null);

    window.addEventListener('resize', () => {
        setActiveAnnotation(null);
    });

    useEffect(() => {
        if (!user || !videoId) return;
        let cancelled = false;
        const fetchFavoriteStatus = async () => {
            const { favorited, error } = await (await fetch(`/api/favorites?videoId=${videoId}`)).json();
            if (cancelled) return;
            if (error) {
                toast({
                    title: "Uh oh, we couldn't get favorite status",
                    description: "Please try again later.",
                    variant: "destructive"
                })
                return;
            }
            setFavorited(favorited);
        }
        fetchFavoriteStatus();
        return () => { cancelled = true; };
    }, [user?.id, videoId]);

    const toggleFavorite = async (pressed: boolean) => {
        // show the new state right away, roll back if the write fails
        setFavorited(pressed);
        const res = await fetch(`/api/favorites/`, {
            method: pressed ? 'POST' : 'DELETE',
            body: JSON.stringify({ videoId }),
        });
        if (!res.ok) {
            setFavorited(!pressed);
            toast({
                title: "Uh oh, we couldn't update favorite status",
                description: "Please try again later.",
                variant: "destructive"
            })
        }
    }

    const handleToggleChange = (val: TagGroupType) => {
        setActiveAnnotation(prev => (prev === val ? null : val));
    };

    const handleTag = (type: TagType) => {
        addTag(type);
        setActiveAnnotation(null);
    };

    return (
        <div className={`hidden bg-neutral-900 w-[75px] min-w-[75px] py-4 sm:flex flex-col space-y-8 rounded-lg rounded-bl-none rounded-tl-none ${className}`}>
            <TooltipProvider>
                <div className='flex flex-col items-center space-y-8'>
                    {user
                    ?
                        <Toggle
                            pressed={favorited}
                            onPressedChange={toggleFavorite}
                            size="default"
                            variant="default"
                            className={FAVORITE_TOGGLE_CLASS}
                            title={favorited ? 'Remove from Favorites' : 'Add to Favorites'}
                            aria-label={favorited ? 'Remove from Favorites' : 'Add to Favorites'}>
                            <Star className='h-6 w-6 group-data-toggled:fill-accent'/>
                        </Toggle>
                    :
                        <SignupModal
                            trigger={
                                <Toggle
                                    size="default"
                                    variant="default"
                                    className={FAVORITE_TOGGLE_CLASS}
                                    title='Add to Favorites'
                                    aria-label='Add to Favorites'>
                                    <Star className='h-6 w-6 group-data-toggled:fill-accent'/>
                                </Toggle>
                            }
                        />
                    }
                    <Separator orientation="horizontal" decorative className='w-[30px] bg-secondary'/>
                </div>
                {/* anons still get the bar so the favorite star can pitch signup, but tagging needs an account */}
                <ToggleGroup type="single" disabled={!user} value={activeAnnotation || ""} className='flex flex-col items-center justify-center space-y-4 pb-4'>
                    <ToggleGroupItem
                        ref={attackTagsRef}
                        value={TagGroupType.ATTACK}
                        size="default"
                        variant="default"
                        onClick={() => handleToggleChange(TagGroupType.ATTACK)}
                        className='group w-full border-secondary hover:bg-transparent data-toggled:bg-transparent data-toggled:text-accent-foreground'
                        title='Attack Tags'
                        aria-label='Attack Tags'>
                            {tagGroupTypeToJSX(TagGroupType.ATTACK, "h-6 w-6 shrink-0 opacity-100 group-data-toggled:fill-accent")}
                    </ToggleGroupItem>
                    <ToggleGroupItem
                        ref={defenseTagsRef}
                        value={TagGroupType.DEFENSE}
                        size="default"
                        variant="default"
                        onClick={() => handleToggleChange(TagGroupType.DEFENSE)}
                        className='group w-full border-secondary hover:bg-transparent data-toggled:bg-transparent data-toggled:text-accent-foreground'
                        title="Defense Tags"
                        aria-label='Defense Tags'>
                            {tagGroupTypeToJSX(TagGroupType.DEFENSE, "h-6 w-6 shrink-0 opacity-100 group-data-toggled:fill-accent")}
                    </ToggleGroupItem>
                    <ToggleGroupItem
                        ref={impactTagsRef}
                        value={TagGroupType.IMPACT}
                        size="default"
                        variant="default" 
                        onClick={() => handleToggleChange(TagGroupType.IMPACT)}
                        className='group w-full border-secondary hover:bg-transparent data-toggled:bg-transparent data-toggled:text-accent-foreground'
                        title="Impact Tags"
                        aria-label='Impact Tags'>
                            {tagGroupTypeToJSX(TagGroupType.IMPACT, "h-6 w-6 shrink-0 opacity-100 group-data-toggled:fill-accent")}
                    </ToggleGroupItem>
                </ToggleGroup>
                <div className='flex flex-col justify-end items-center h-full'>
                    <Tooltip>
                        <TooltipTrigger className='hover:cursor-default'>
                            <Info className="h-6 w-6 shrink-0 opacity-100"/>
                        </TooltipTrigger>
                        <TooltipContent sideOffset={10}>Tag key moments as you watch so you can jump to them later.</TooltipContent>
                    </Tooltip>
                </div>
                <div
                    className={`
                        z-200 absolute bg-neutral-900 border border-secondary border-r-0 rounded-l-full
                        ${activeAnnotation === null ? 'hidden' : ''}
                    `}
                    // hardcoded positions are dependent on width/height of the button bar
                    style={
                        activeAnnotation === TagGroupType.ATTACK 
                            ? { top: `${attackTagsRef.current.offsetTop - 40}px`, left: `${attackTagsRef.current.offsetLeft - 416}px` } 
                        : activeAnnotation === TagGroupType.DEFENSE ?
                            { top: `${defenseTagsRef.current.offsetTop - 40}px`, left: `${defenseTagsRef.current.offsetLeft - 218}px` }
                        : activeAnnotation === TagGroupType.IMPACT ?
                            { top: `${impactTagsRef.current.offsetTop - 40}px`, left: `${impactTagsRef.current.offsetLeft - 490}px` }
                        : {}
                    }
                >
                    {activeAnnotation === TagGroupType.ATTACK && (
                        <div className="flex flex-row space-x-2 p-2">
                            {AttackTagTypes.map((tag, index) => (
                                <Button variant='outline' className='rounded-full' onClick={() => handleTag(tag)}>
                                    {tagTypeToJSX(tag, 'h-4 w-4 shrink-0 opacity-100 mr-2')} {tag}
                                </Button>
                            ))}
                        </div>
                    )}
                    {activeAnnotation === TagGroupType.DEFENSE && (
                        <div className="flex flex-row space-x-2 p-2">
                        {DefenseTagTypes.map((tag, index) => (
                            <Button variant='outline' className='rounded-full' onClick={() => handleTag(tag)}>
                                {tagTypeToJSX(tag, 'h-4 w-4 shrink-0 opacity-100 mr-2')} {tag}
                            </Button>
                        ))}
                    </div>
                    )}
                    {activeAnnotation === TagGroupType.IMPACT && (
                        <div className="flex flex-row space-x-2 p-2">
                            {ImpactTagTypes.map((tag, index) => (
                                <Button variant='outline' className='rounded-full' onClick={() => handleTag(tag)}>
                                    {tagTypeToJSX(tag, 'h-4 w-4 shrink-0 opacity-100 mr-2')} {tag}
                                </Button>
                            ))}
                        </div>
                    )}
                </div>
            </TooltipProvider>
        </div>
    );
}

export default AnnotationControls;
