import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Company {
    id: number;
    name: string;
    address: string;
    selected: boolean;
}

interface CompaniesState {
    list: Company[];
}

const generateCompanies = (count: number): Company[] => {
    const companies: Company[] = [];
    for (let i = 1; i <= count; i++) {
        companies.push({ id: i, name: `Company ${i}`, address: `Address ${i}`, selected: false });
    }
    return companies;
};

const initialState: CompaniesState = {
    list: generateCompanies(11000),
};

export const companiesSlice = createSlice({
    name: 'companies',
    initialState,
    reducers: {
        addCompany: (state, action: PayloadAction<Company>) => {
            state.list.unshift(action.payload);
        },
        removeCompany: (state, action: PayloadAction<number[]>) => {
            state.list = state.list.filter(company => !action.payload.includes(company.id));
        },
        toggleSelectCompany: (state, action: PayloadAction<number>) => {
            const company = state.list.find(c => c.id === action.payload);
            if (company) {
                company.selected = !company.selected;
            }
        },
        toggleSelectAllCompanies: (state) => {
            const allSelected = state.list.every(company => company.selected);
            state.list.forEach(company => company.selected = !allSelected);
        },
        updateCompany: (state, action: PayloadAction<{ id: number, name: string, address: string }>) => {
            const company = state.list.find(c => c.id === action.payload.id);
            if (company) {
                company.name = action.payload.name;
                company.address = action.payload.address;
            }
        },
    },
});

export const { addCompany, removeCompany, toggleSelectCompany, toggleSelectAllCompanies, updateCompany } = companiesSlice.actions;
export default companiesSlice.reducer;