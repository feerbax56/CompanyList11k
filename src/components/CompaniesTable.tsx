import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { addCompany, removeCompany, toggleSelectCompany, toggleSelectAllCompanies, updateCompany } from '../features/companies/companiesSlice';
import { Table, Column, AutoSizer, ScrollEventData, TableRowRenderer } from 'react-virtualized';
import './CompaniesTable.css';

const CompaniesTable: React.FC = () => {
    const dispatch = useDispatch();
    const companies = useSelector((state: RootState) => state.companies.list);
    const [newCompanyName, setNewCompanyName] = useState('');
    const [newCompanyAddress, setNewCompanyAddress] = useState('');
    const tableRef = useRef<Table>(null);

    const handleAddCompany = () => {
        if (newCompanyName && newCompanyAddress) {
            dispatch(addCompany({ id: Date.now(), name: newCompanyName, address: newCompanyAddress, selected: false }));
            setNewCompanyName('');
            setNewCompanyAddress('');
        }
    };

    const handleRemoveCompany = () => {
        const selectedCompanies = companies.filter(company => company.selected).map(company => company.id);
        dispatch(removeCompany(selectedCompanies));
    };

    const handleScroll = ({ scrollTop, scrollHeight, clientHeight }: ScrollEventData) => {
        if (tableRef.current) {
            if (scrollHeight - scrollTop === clientHeight) {
                // Load more companies
                for (let i = 0; i < 10; i++) {
                    dispatch(addCompany({ id: Date.now() + i, name: `Company ${companies.length + i + 1}`, address: `Address ${companies.length + i + 1}`, selected: false }));
                }
            }
        }
    };

    const rowRenderer: TableRowRenderer = ({ index, key, style }) => {
        const company = companies[index];
        return (
            <div key={key} style={{ ...style, display: 'flex' }} className={company.selected ? 'selected-row' : ''}>
                <input type="checkbox" checked={company.selected} onChange={() => dispatch(toggleSelectCompany(company.id))} className="select-column small-checkbox" />
                <input type="text" value={company.name} onChange={(e) => dispatch(updateCompany({ id: company.id, name: e.target.value, address: company.address }))} className="name-column small-input" />
                <input type="text" value={company.address} onChange={(e) => dispatch(updateCompany({ id: company.id, name: company.name, address: e.target.value }))} className="address-column small-input" />
            </div>
        );
    };

    return (
        <div className="companies-table-container">
            <div className="input-container">
                <input
                    type="text"
                    placeholder="Company Name"
                    value={newCompanyName}
                    onChange={(e) => setNewCompanyName(e.target.value)}
                    className="input-field"
                />
                <input
                    type="text"
                    placeholder="Company Address"
                    value={newCompanyAddress}
                    onChange={(e) => setNewCompanyAddress(e.target.value)}
                    className="input-field"
                />
                <button onClick={handleAddCompany} className="button">Add Company</button>
                <button onClick={handleRemoveCompany} className="remove-button">Remove Selected</button>
            </div>
            <div className="table-header">
                <input
                    type="checkbox"
                    onChange={() => dispatch(toggleSelectAllCompanies())}
                    className="select-column"
                />
                <span className="name-column">Name</span>
                <span className="address-column">Address</span>
            </div>
            <div className="table-container">
                <AutoSizer>
                    {({ height, width }) => (
                        <Table
                            ref={tableRef}
                            height={height}
                            width={width}
                            headerHeight={0}
                            rowHeight={50}
                            rowCount={companies.length}
                            rowGetter={({ index }) => companies[index]}
                            onScroll={handleScroll}
                            rowRenderer={rowRenderer}
                        >
                            <Column
                                label="Select"
                                dataKey="selected"
                                width={50}
                                className="select-column"
                            />
                            <Column
                                label="Name"
                                dataKey="name"
                                width={200}
                                className="name-column"
                            />
                            <Column
                                label="Address"
                                dataKey="address"
                                width={300}
                                className="address-column"
                            />
                        </Table>
                    )}
                </AutoSizer>
            </div>
        </div>
    );
};

export default CompaniesTable;