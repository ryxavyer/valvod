'use client'
import { isTagOfType, Tag, TagGroupType, TagType, TagGroupTypes, TagTypes, tagTypeToJSX } from '@src/lib/tag';
import { formatTime } from '@src/utils/time';
import { ArrowLeft, LoaderCircle } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { debounce } from '@src/utils/debounce';
import { useToast } from '@src/hooks/use-toast';
import DOMPurify from "isomorphic-dompurify";
import { Separator } from './ui/separator';
import SelectCombobox from './ui/select-combobox';

interface TagEditorProps {
    tags: Tag[];
    setTags: (tags: Tag[]) => void;
    activeTagId: number | null;
    setActiveTagId: (id: number | null) => void;
}

export default function TagEditor({ tags, setTags, activeTagId, setActiveTagId }: TagEditorProps) {
    const { toast } = useToast();
    const activeTag: Tag | undefined = tags.find(tag => tag.id === activeTagId);
    const [activeFilter, setActiveFilter] = useState<TagGroupType | TagType | null>(null);
    const [saving, setSaving] = useState(false);
    const [desc, setDesc] = useState(activeTag?.description || "");

    useEffect(() => {
        setDesc(activeTag?.description || "");
    }, [activeTag]);

    const handleTagClick = (tag: Tag) => {
        setActiveTagId(tag.id);
    }

    const saveDescriptionMemo = useCallback(async (newDesc: string) => {
        if (saving || !newDesc) return;
        setSaving(true);
        setTags(tags.map(tag => tag.id === activeTagId ? { ...tag, description: newDesc } : tag));
        const res = await fetch('/api/tags', {
            method: 'PUT',
            body: JSON.stringify({ id: activeTagId, description: DOMPurify.sanitize(newDesc) }),
        });
        if (!res.ok) {
            toast({
                title: "Uh oh, we couldn't update your description",
                description: "Please try again later.",
                variant: "destructive"
            })
            // rollback changes
            setTags(tags.map(tag => tag.id === activeTagId ? { ...tag, description: activeTag?.description || "" } : tag));
        }
        setSaving(false);
    }, [activeTag, saving]);

    const debouncedDescSave = useMemo(() => debounce(saveDescriptionMemo, 5000), [saveDescriptionMemo]);

    const deleteActiveTag = async (tags: Tag[], activeTagId: number) => {
        setTags(tags.filter(tag => tag.id !== activeTagId));
        setActiveTagId(null);
        const res = await fetch('/api/tags', {
            method: 'DELETE',
            body: JSON.stringify({ tagId: activeTagId }),
        });
        if (!res.ok) {
            toast({
                title: "Uh oh, we couldn't delete this tag",
                description: "Please try again later.",
                variant: "destructive"
            })
            // rollback changes
            setTags(tags);
            setActiveTagId(activeTagId);
            return;
        }
    }

    return (
        <div className='w-full h-full p-4 items-center bg-neutral-900 rounded-lg overflow-y-auto'>
            {!activeTag && <>
                <SelectCombobox
                    options={[...TagGroupTypes, ...TagTypes]}
                    optionName='tag filter'
                    selectValue={activeFilter}
                    setSelectValue={setActiveFilter}
                    className='w-full border-secondary hover:bg-secondary'
                />
                <Separator className='my-2 bg-secondary' />
                <div className='flex flex-col w-full space-y-2'>
                    {tags.filter(tag => isTagOfType(tag, activeFilter)).toSorted((a, b) => a.time - b.time).map((tag, index) => {
                        return (
                            <Button
                                variant='outlineSecondary'
                                key={tag.id}
                                className='flex flex-row w-full h-14 items-center justify-start'
                                onClick={() => handleTagClick(tag)}
                            >
                                <div className='flex flex-row w-full items-center justify-between space-x-2'>
                                    <div className='flex flex-row items-center justify-start space-x-4'>
                                        {tagTypeToJSX(tag.type, 'h-6 w-6 shrink-0 opacity-100')}
                                        <span className='text-md font-semibold'>{tag.type}</span>
                                    </div>
                                    <span className='text-xs font-light'>{formatTime(tag.time)}</span>
                                </div>
                            </Button>
                        );
                    })}
                </div>
                {tags.length === 0 && 
                    <div className='w-full h-full text-neutral-500 text-sm'>
                        Edit tag details here. Add a tag to get started!
                    </div>
                }
            </>
            }
            {activeTag && 
                <div className='flex flex-col items-center space-y-4'>
                    <div className='flex flex-row w-full items-center justify-between'>
                        <Button
                            variant='ghostSecondary'
                            className='flex flex-row items-center justify-start'
                            onClick={() => setActiveTagId(null)}
                        >
                            <ArrowLeft className='h-4 w-4 shrink-0 opacity-100'/>
                        </Button>
                        <div className='flex flex-col items-center justify-center'>
                            <span className='text-lg font-semibold'>{activeTag.type}</span>
                            <span className='text-xs font-normal'>{formatTime(activeTag.time)}</span>
                        </div>
                        <LoaderCircle className={`opacity-0 w-4 h-4 mx-4 my-2 animate-spin ${saving ? 'opacity-100' : ''}`}/>
                    </div>
                    <div className='w-full'>
                        <Textarea
                            className='h-[300px] resize-none rounded-b-none border-b-0 focus-visible:ring-offset-0'
                            maxLength={1000}
                            placeholder="What's important here?"
                            onChange={(e) => {
                                setDesc(e.target.value);
                                debouncedDescSave(e.target.value);
                            }}
                            defaultValue={activeTag.description}
                        />
                        <span className='flex items-center justify-center bg-background w-full text-xs text-neutral-500 h-[40px] border-accent border border-t-0 rounded-b-md'>{`Characters left: ${1000 - desc.length}`}</span>
                    </div>
                    <Button
                        variant='destructive'
                        className='w-1/2'
                        onClick={() => deleteActiveTag(tags, activeTag.id)}
                    >
                        DELETE
                    </Button>
                </div>
            }
        </div>
    );
}
