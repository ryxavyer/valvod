'use client';
import React from 'react';
import { MAPS } from '@src/lib/valorant';
import Combobox from './ui/select-combobox';


const MapSelect = ({ selectValue, setSelectValue, className=undefined }) => {
    return (
        <Combobox
            options={MAPS}
            optionName='Map'
            selectValue={selectValue}
            setSelectValue={setSelectValue}
            className={className}
        />
    );
}

export default MapSelect;
