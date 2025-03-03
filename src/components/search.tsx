'use client';

import React, { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search as SearchIcon } from 'lucide-react';

interface SearchProps {
  className?: string;
}

const Search = ({ className }: SearchProps) => {
    const router = useRouter();

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const searchValue = formData.get("search") as string;
        if (!searchValue) return;
        router.push(`/search/?q=${encodeURIComponent(searchValue)}`);
    };

    return (
        <form
            className={className}
            onSubmit={handleSubmit}
        >
            <Input
                id="search"
                name="search"
                autoComplete='off'
                placeholder="Search e.g. Yoru Bind"
                className="rounded-tr-none rounded-br-none border-secondary border-r-0 focus-visible:border-none focus-visible:mr-[0.2%] focus-visible:ring-offset-[-1.25px]"
            />
            <Button
                type="submit"
                variant="secondary"
                className="px-6 py-2 rounded-md rounded-tl-none rounded-bl-none focus-visible:border-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-[-1.25px]"
            >
                <SearchIcon className="h-5 w-5 shrink-0 opacity-100" />
            </Button>
        </form>
    );
};

export default Search;
