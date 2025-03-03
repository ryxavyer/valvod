'use client';
import React from 'react';
import { LuChevronsUpDown } from "react-icons/lu";
import { FaCheck } from "react-icons/fa";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@src/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@src/components/ui/popover"
import { Button } from '@src/components/ui/button';
import { cn } from '@src/lib/utils';


interface ComboboxProps {
    options: { name: string, value: string }[];
    optionName: string;
    selectValue: string;
    setSelectValue: (value: any) => void;
    className?: string;
}

const SelectCombobox = ({ options, optionName, selectValue, setSelectValue, className=undefined }: ComboboxProps) => {
    const [isOpen, setIsOpen] = React.useState(false);
    // for all intents and purposes, classname styles are only usefully applied to button and content elements
    return (
        <div>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={isOpen}
                        className={`justify-between ${className}`}
                    >
                        {selectValue
                            ? options.find((option) => option.value === selectValue)?.name
                            : `Select ${optionName.toLowerCase()}...`}
                        <LuChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className={`p-0 mx-auto ${className}`}>
                    <Command>
                    <CommandInput placeholder={`Search ${optionName.toLowerCase()}...`} />
                    <CommandList>
                        <CommandEmpty>No {optionName.toLowerCase()}s found.</CommandEmpty>
                        <CommandGroup>
                        {options.map((option) => (
                            <CommandItem
                                key={option.value}
                                value={option.value}
                                onSelect={(currentValue) => {
                                    setSelectValue(currentValue === selectValue ? "" : currentValue)
                                    setIsOpen(false)
                                }}
                            >
                                <FaCheck
                                    className={cn(
                                        "mr-2 h-2 w-2",
                                        selectValue === option.value ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                {option.name}
                            </CommandItem>
                        ))}
                        </CommandGroup>
                    </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}

export default SelectCombobox;
