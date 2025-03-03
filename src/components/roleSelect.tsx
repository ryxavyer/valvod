'use client';
import React from 'react';
import { ROLES } from '@src/lib/valorant';
import Combobox from './ui/select-combobox';


const RoleSelect = ({ selectValue, setSelectValue, className=undefined }) => {
    return (
        <Combobox
            options={ROLES}
            optionName='Role'
            selectValue={selectValue}
            setSelectValue={setSelectValue}
            className={className}
        />
    );
}

export default RoleSelect;
