import { produce } from 'immer';
import { Template } from '@pdfme/common';
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type initialStateType = {
    value: {
        switcher: {[key: string]: SwitcherState} | {},
        templates: Template | {}
    }
} 

type SwitcherState = {
    label: string,
    value: string,
    shareCode: string
}

const initialState: initialStateType = {
    value: {
        switcher: {},
        templates: {},
    }
}

const templateSlice = createSlice({
    name: "userTemplate",
    initialState,
    reducers: {
        reset: () => {
            return initialState;
        },
        addSwitchers: (state = initialState, action) => {
            return produce(state, (draftState) => {
                draftState.value.switcher = {...draftState.value.switcher, ...action.payload}
            })
        },
        addSwitcher: (state = initialState, action: {
            payload: {key: string, value: any};
            type: string;
        }) => {
            const {key, value} = action.payload
            return produce(state, (draftState: any) => {
                draftState.value.switcher[key] = value
            })
        },
        removeSwitcher: (state = initialState, action) => {
            return produce(state, (draftState) => {
                const { key } = action.payload;
                draftState.value.switcher = {
                    ...draftState.value.switcher,
                    [key]: undefined
                }
            })
        },
        removeSwitchers: (state = initialState, action) => {
            return produce(state, (draftState) => {
                draftState.value.switcher = {}
            })
        },
        addTemplate: (state = initialState, action: {
            payload: {key: string, value: any};
            type: string;
        }) => {
            return produce(state, (draftState: any) => {
                const { key, value } = action.payload
                draftState.value.templates[key] = value
            })
        },
        removeTemplate: (state = initialState, action) => {
            return produce(state, (draftState) => {
                const { key } = action.payload
                draftState.value.templates = {
                    ...draftState.value.templates,
                    [key]: undefined
                }
            })
        }
    }
})

export const {
    reset,
    addSwitchers,
    addSwitcher,
    removeSwitcher,
    removeSwitchers,
    addTemplate,
    removeTemplate
} = templateSlice.actions

export default templateSlice