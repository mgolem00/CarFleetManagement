import React, { useState, useEffect } from "react";
import { Navigate } from 'react-router-dom';
import { useTable, useFilters} from 'react-table';
import matchSorter from 'match-sorter';
import Header from "./header";
import Footer from "./footer";
import Modal from 'react-modal';

const UserSpending = () =>{

    const emptyUser = {
        ID: null,
        Username: null,
        NameSurname: null,
        FK_RoleID: null,
        Vehicle: null,
        VUID: null,
        Cost: null,
        CostDesc: null,
        CostType: null
    };

    const [userList, setUserList] = useState([]);
    const [chosenUserID, setChosenUserID] = useState(11);
    const [userReceipts, setUserReceipts] = useState([]);
    const [createModalIsOpen, setCreateIsOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(emptyUser);
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

    function closeModals() {
        setSelectedUser(emptyUser);
        setCreateIsOpen(false);
    }
    function callCreate() {
        console.log(userList);
        setSelectedUser(userList.find((user)=>{return user.ID == chosenUserID && user}));
        setCreateIsOpen(true);
    }
    function confirmCreate() {
        fetch(`http://localhost:4000/api/createUserReceipt`, {
            method: "POST",
            body: JSON.stringify({
                vehicleUserID: selectedUser.VUID,
                typeOfCostID: selectedUser.CostType,
                cost: selectedUser.Cost,
                costDescription: selectedUser.CostDesc
            }),headers: {"Content-type": "application/json;charset=UTF-8", Authorization: "Bearer " + localStorage.getItem("token")}
        })
        .then((result)=>{
            console.log(result);
            setSelectedUser(emptyUser);
            closeModals();
        })
        .catch((err)=>console.log(err));
    }

    useEffect(()=>{
        fetch(`http://localhost:4000/api/getUserReceipt?userID=${chosenUserID}`, options)
        .then((response)=>response.json())
        .then((userReceipts)=>{
            for(i=0; i < userReceipts.recordsets[0].length; i++) {
                userReceipts.recordsets[0][i].DateMade = userReceipts.recordsets[0][i].DateMade.substring(0,10);
                userReceipts.recordsets[0][i].DateGranted = userReceipts.recordsets[0][i].DateGranted.substring(0,10);
                if(userReceipts.recordsets[0][i].DateTaken != null)
                userReceipts.recordsets[0][i].DateTaken = userReceipts.recordsets[0][i].DateTaken.substring(0,10);
            }
            console.log(userReceipts.recordsets[0]);
            setUserReceipts(userReceipts.recordsets[0]);
        });

        fetch("http://localhost:4000/api/getAllUsers", options)
            .then((response)=>response.json())
            .then((users)=>{
                console.log(users.recordsets[0]);
                setUserList(users.recordsets[0]);
            });
    }, [chosenUserID]);

    function onChangeCost(e) {
        selectedUser.Cost = e.target.value;
    }

    function onChangeCostType(e) {
        selectedUser.CostType = e.target.value;
    }

    function onChangeCostDesc(e) {
        selectedUser.CostDesc = e.target.value;
    }

    function onChangeChosenUser(e) {
        setChosenUserID(e.target.value);
    }

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
                //...columns,
                ...columns.slice(0,-1)
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
                Header:'User',
                columns: [
                    {   
                        Header: 'ID',
                        accessor: 'UserID',       
                    },
                    {   
                        Header: 'Username',
                        accessor: 'Username',       
                    },
                    {   
                        Header: 'Full name',
                        accessor: 'NameSurname',       
                    }
                ]
            },
            {   
                Header: 'Vehicle',
                columns: [
                    {   
                        Header: 'ID',
                        accessor: 'VehicleID',       
                    },
                    {   
                        Header: 'Manufacturer',
                        accessor: 'Manufacturer',       
                    },
                    {   
                        Header: 'Model',
                        accessor: 'Model',       
                    },
                    {   
                        Header: 'Granted',
                        accessor: 'DateGranted',       
                    },
                    {   
                        Header: 'Taken',
                        accessor: 'DateTaken',       
                    },
                ]      
            },
            {   
                Header: 'Spending',
                columns: [
                    {   
                        Header: 'Date Made',
                        accessor: 'DateMade',       
                    },
                    {   
                        Header: 'Cost',
                        accessor: 'Cost',       
                    },
                    {   
                        Header: 'Type of cost',
                        accessor: 'CostName',       
                    },
                    {   
                        Header: 'Description',
                        accessor: 'CostDescription',       
                    }
                ]      
            },
            {   
                id: 'VehicleUserID',
                Header: 'VUID',
                accessor: 'VehicleUserID'     
            }
        ],
        []
    )

    if(verifyAuth()){
        return(
            <div>
                <Header />
                <div className="aBody">
                    {/*selectedUser.VUID != null && <button onClick={e => callCreate()}>Insert new</button>*/}
                    <button onClick={e => callCreate()}>Insert new</button>
                    {verifyRole() && (
                        <select onChange={onChangeChosenUser} defaultValue={chosenUserID}>
                            {userList.map(user => <option value={user.ID}>{user.Username}</option>)}
                        </select>
                    )}
                    <Table columns={columns} data={userReceipts}/>
                </div>
                <Modal
                    isOpen={createModalIsOpen}
                    onRequestClose={closeModals}
                    shouldCloseOnOverlayClick={false}
                >
                    <h3>Insert new receipt:</h3>
                    <form className="CRUD" onSubmit={(e)=>{ e.preventDefault();}}>
                        <div className="CRUDBlock">
                            <label htmlFor="currentVehicle">Current vehicle: {selectedUser.Vehicle}</label>
                        </div>
                        <div className="CRUDBlock">
                            <label htmlFor="cost">Cost:</label>
                            <input
                                type="text"
                                onChange={onChangeCost}
                                onBlur={onChangeCost}
                            ></input>
                        </div>
                        <div className="CRUDBlock">
                            <label htmlFor="typeOfCost">Type of cost:</label>
                            <select onChange={onChangeCostType} defaultValue={1}>
                                <option value={1}>Fuel</option>
                                <option value={2}>Repair</option>
                                <option value={3}>Fine</option>
                            </select>
                        </div>
                        <div className="CRUDBlock">
                            <label htmlFor="desc">Description:</label>
                            <input
                                type="text"
                                onChange={onChangeCostDesc}
                                onBlur={onChangeCostDesc}
                            ></input>
                        </div>
                        <div>
                            <button onClick={e=> confirmCreate()}>Insert</button>
                            <button onClick={closeModals}>Close</button>
                        </div>
                    </form>
                </Modal>
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
export default UserSpending;