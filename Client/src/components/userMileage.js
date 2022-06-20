import React, { useState, useEffect } from "react";
import { Navigate } from 'react-router-dom';
import { useTable, useFilters} from 'react-table';
import matchSorter from 'match-sorter';
import Header from "./header";
import Footer from "./footer";
import Modal from 'react-modal';

const UserMileage = () =>{
    
    const emptyUser = {
        ID: null,
        Username: null,
        NameSurname: null,
        FK_RoleID: null,
        Vehicle: null,
        VUID: null,
        Kilometers: null
    };
    let user = {};
    const [userList, setUserList] = useState([]);
    const [chosenUserID, setChosenUserID] = useState(11);
    const [userMileage, setUserMileage] = useState([]);
    const [createModalIsOpen, setCreateIsOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(emptyUser);

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
        fetch(`http://localhost:4000/api/createUserMileage`, {
            method: "POST",
            body: JSON.stringify({
                vehicleUserID: selectedUser.VUID,
                kilometersPassed: selectedUser.Kilometers
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
        fetch(`http://localhost:4000/api/getUserMileage?userID=${chosenUserID}`, options)
        .then((response)=>response.json())
        .then((userMileages)=>{
            //console.log(userMileages.recordsets[0]);
            for(i=0; i < userMileages.recordsets[0].length; i++) {
                userMileages.recordsets[0][i].DateChecked = userMileages.recordsets[0][i].DateChecked.substring(0,10);
                userMileages.recordsets[0][i].DateGranted = userMileages.recordsets[0][i].DateGranted.substring(0,10);
                if(userMileages.recordsets[0][i].DateTaken != null)
                    userMileages.recordsets[0][i].DateTaken = userMileages.recordsets[0][i].DateTaken.substring(0,10);
            }
            console.log(userMileages.recordsets[0]);
            setUserMileage(userMileages.recordsets[0]);
        });

        fetch("http://localhost:4000/api/getAllUsers", options)
            .then((response)=>response.json())
            .then((users)=>{
                console.log(users.recordsets[0]);
                setUserList(users.recordsets[0]);
            });
    }, [chosenUserID]);

    function onChangeKilometers(e) {
        selectedUser.Kilometers = e.target.value;
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
                Header: 'Mileage',
                columns: [
                    {   
                        Header: 'Date Checked',
                        accessor: 'DateChecked',       
                    },
                    {   
                        Header: 'Kilometers passed',
                        accessor: 'KilometersPassed',       
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
                    <Table columns={columns} data={userMileage}/>
                </div>
                <Modal
                    isOpen={createModalIsOpen}
                    onRequestClose={closeModals}
                    shouldCloseOnOverlayClick={false}
                >
                    <h3>Insert new mileage:</h3>
                    <form className="CRUD" onSubmit={(e)=>{ e.preventDefault();}}>
                        <div className="CRUDBlock">
                            <label htmlFor="currentVehicle">Current vehicle: {selectedUser.Vehicle}</label>
                        </div>
                        <div className="CRUDBlock">
                            <label htmlFor="newVehicle">Kilometers Passed:</label>
                            <input
                                type="text"
                                onChange={onChangeKilometers}
                                onBlur={onChangeKilometers}
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
export default UserMileage;