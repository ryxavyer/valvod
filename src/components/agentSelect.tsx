'use client';
import React from 'react';
import { AGENTS } from '@src/lib/valorant';
import Combobox from './ui/select-combobox';


const AgentSelect = ({ selectValue, setSelectValue, className=undefined }) => {
    return (
        <Combobox
            options={AGENTS}
            optionName='Agent'
            selectValue={selectValue}
            setSelectValue={setSelectValue}
            className={className}
        />
    );
}

export default AgentSelect;
