import React, { useState, useEffect } from "react";
import { Navigate } from 'react-router-dom';
import { useTable, useFilters} from 'react-table';
import matchSorter from 'match-sorter';
import Header from "./header";
import Footer from "./footer";

const CompanySpending = () =>{
    
    const [companySpending, setCompanySpending] = useState([]);
    let user = {};

    const options = {headers:{
        Authorization: "Bearer " + localStorage.getItem("token")
    }};

    const verifyRole = () => {
        if(user.roleID == 1 || user.roleID == 2) {
            /*fetch("http://localhost:4000/api/getAllUsers", options)
            .then((response)=>response.json())
            .then((users)=>{
                console.log(users.recordsets[0]);
                setUserList(users.recordsets[0]);
            });*/
            return true;
        }
        else {
            return false;
        }
    }

    const verifyAuth = () => {
        if(localStorage.getItem("token")) {
            user = JSON.parse(localStorage.getItem("user"));
            //setChosenUserID(user.id);
            return true;
        }
        else {
            return false;
        }
    }

    useEffect(()=>{
        fetch(`http://localhost:4000/api/getCompanyReceipt`, options)
        .then((response)=>response.json())
        .then((companyReceipts)=>{
            console.log(companyReceipts.recordsets[0]);
            for(i=0; i < companyReceipts.recordsets[0].length; i++) {
                companyReceipts.recordsets[0][i].Year = companyReceipts.recordsets[0][i].DateMade.substring(0,4);
                dateQ = parseInt(companyReceipts.recordsets[0][i].DateMade.substring(5,7));
                if(dateQ >= 1 && dateQ < 4) {
                    companyReceipts.recordsets[0][i].Q = 1;
                }
                if(dateQ >= 4 && dateQ < 7) {
                    companyReceipts.recordsets[0][i].Q = 2;
                }
                if(dateQ >= 7 && dateQ < 10) {
                    companyReceipts.recordsets[0][i].Q = 3;
                }
                if(dateQ >= 10 && dateQ <= 12) {
                    companyReceipts.recordsets[0][i].Q = 4;
                }
            }
            for(i=0; i < companyReceipts.recordsets[0].length-1; i++) {
                for(j=i+1; j < companyReceipts.recordsets[0].length; j++) {
                    console.log(companyReceipts.recordsets[0][i]);
                    console.log(companyReceipts.recordsets[0][j]);
                    console.log("--------");
                    if(companyReceipts.recordsets[0][i].DateMade != companyReceipts.recordsets[0][j].DateMade &&
                        companyReceipts.recordsets[0][i].CostName == companyReceipts.recordsets[0][j].CostName && 
                        companyReceipts.recordsets[0][i].Year == companyReceipts.recordsets[0][j].Year && 
                        companyReceipts.recordsets[0][i].Q == companyReceipts.recordsets[0][j].Q) {
                            companyReceipts.recordsets[0][i].Cost += companyReceipts.recordsets[0][j].Cost;
                            companyReceipts.recordsets[0].splice(j, 1);
                            console.log(companyReceipts.recordsets[0]);
                        }
                }
            }
            setCompanySpending(companyReceipts.recordsets[0]);
        });
    }, []);

    function Table({ columns, data }) {
        //console.log(...columns);
        //console.log(...columns.slice(0,-1));
        const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        } = useTable(
        {
            columns,
            data,
        },
        hooks => { 
            hooks.visibleColumns.push(columns => [
                ...columns,
                //...columns.slice(0,-1)
            ])
        }
        )

        return (
        <>
            <table {...getTableProps()}>
                <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                        <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                    ))}
                    </tr>
                ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                {rows.map((row, i) => {
                    prepareRow(row)
                    return (
                    <tr {...row.getRowProps()}>
                        {row.cells.map(cell => {
                        return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                        })}
                    </tr>
                    )
                })}
                </tbody>
            </table>
        </>
        )
    }

    const columns = React.useMemo(
        () => [
            {   
                Header: 'Vehicle',
                columns: [
                    {   
                        Header: 'Info',
                        accessor: 'Vehicle',       
                    }
                ] 
            },
            {   
                Header: 'Company Spending',
                columns: [
                    {   
                        Header: 'Year',
                        accessor: 'Year',       
                    },
                    {   
                        Header: 'Quarter',
                        accessor: 'Q',       
                    },
                    {   
                        Header: 'Type of cost',
                        accessor: 'CostName',       
                    },
                    {   
                        Header: 'Cost',
                        accessor: 'Cost',       
                    }
                ]      
            }
        ],
        []
    )

    if(verifyAuth()){
        return(
            <div>
                <Header />
                <div className="aBody">
                    <Table columns={columns} data={companySpending}/>
                </div>
                <Footer />
            </div>
        );
    } 
    else{
        return (
            <Navigate to="/login" replace={true} />
        );
    }
};
export default CompanySpending;