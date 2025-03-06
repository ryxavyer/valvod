'use client'
import { Tag } from '@src/lib/tag';
import { formatTime } from '@src/utils/time';
import { LoaderCircle } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { debounce } from '@src/utils/debounce';
import { useToast } from '@src/hooks/use-toast';
import DOMPurify from "isomorphic-dompurify";

interface TagEditorProps {
    tags: Tag[];
    setTags: (tags: Tag[]) => void;
    activeTagId: number;
}

export default function TagEditor({ tags, setTags, activeTagId }: TagEditorProps) {
    const { toast } = useToast();
    const activeTag: Tag = tags.find(tag => tag.id === activeTagId);
    const [saving, setSaving] = useState(false);
    const [desc, setDesc] = useState(activeTag?.description || "");

    useEffect(() => {
        setDesc(activeTag.description);
    }, [activeTag]);

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
            setTags(tags.map(tag => tag.id === activeTagId ? { ...tag, description: activeTag.description || "" } : tag));
        }
        setSaving(false);
    }, [activeTag, saving]);

    const debouncedDescSave = useMemo(() => debounce(saveDescriptionMemo, 5000), [saveDescriptionMemo]);

    const deleteActiveTag = async (tags: Tag[], activeTagId: number) => {
        setTags(tags.filter(tag => tag.id !== activeTagId));
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
            return;
        }
    }

    return (
        <div className='flex flex-col items-center space-y-2'>
            <div className='flex flex-row w-full items-center justify-center'>
                <div className='flex flex-col items-center justify-center'>
                    <span className='text-lg font-semibold'>{activeTag.type}</span>
                    <span className='text-xs font-normal'>{formatTime(activeTag.time)}</span>
                </div>
                <LoaderCircle className={`absolute right-2 opacity-0 w-4 h-4 mx-4 my-2 animate-spin ${saving ? 'opacity-100' : ''}`}/>
            </div>
            <div className='w-full'>
                <Textarea
                    className='h-[200px] resize-none focus-visible:ring-offset-0'
                    maxLength={1000}
                    placeholder="What's important here?"
                    onChange={(e) => {
                        setDesc(e.target.value);
                        debouncedDescSave(e.target.value);
                    }}
                    defaultValue={activeTag.description}
                />
                <div className='w-full text-center'>
                    <span className='text-xs text-neutral-400'>{`Characters left: ${1000 - desc.length}`}</span>
                </div>
            </div>
            <Button
                variant='destructive'
                className='w-1/2'
                onClick={() => deleteActiveTag(tags, activeTag.id)}
            >
                DELETE
            </Button>
        </div>
    );
}
