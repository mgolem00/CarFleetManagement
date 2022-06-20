import React, { useState, useEffect } from "react";
import { Navigate } from 'react-router-dom';
import { useTable, useFilters} from 'react-table';
import matchSorter from 'match-sorter';
import Header from "./header";
import Footer from "./footer";

const CompanyMileage = () =>{
    
    const [companyMileage, setCompanyMileage] = useState([]);
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
        fetch(`http://localhost:4000/api/getCompanyMileage`, options)
        .then((response)=>response.json())
        .then((companyMileages)=>{
            console.log(companyMileages.recordsets[0]);
            for(i=0; i < companyMileages.recordsets[0].length; i++) {
                companyMileages.recordsets[0][i].Year = companyMileages.recordsets[0][i].DateChecked.substring(0,4);
                dateQ = parseInt(companyMileages.recordsets[0][i].DateChecked.substring(5,7));
                if(dateQ >= 1 && dateQ < 4) {
                    companyMileages.recordsets[0][i].Q = 1;
                }
                if(dateQ >= 4 && dateQ < 7) {
                    companyMileages.recordsets[0][i].Q = 2;
                }
                if(dateQ >= 7 && dateQ < 10) {
                    companyMileages.recordsets[0][i].Q = 3;
                }
                if(dateQ >= 10 && dateQ <= 12) {
                    companyMileages.recordsets[0][i].Q = 4;
                }
            }
            setCompanyMileage(companyMileages.recordsets[0]);
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
                Header: 'Company Mileage',
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
                        Header: 'Kilometers',
                        accessor: 'KilometersPassed',       
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
                    <Table columns={columns} data={companyMileage}/>
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
export default CompanyMileage;