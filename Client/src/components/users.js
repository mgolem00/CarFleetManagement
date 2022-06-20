import React, {useState, useEffect} from "react";
import { useTable } from 'react-table';
import { Navigate } from 'react-router-dom';
import Modal from 'react-modal';
import Header from "./header";
import Footer from "./footer";

const Users = () =>{

    Modal.setAppElement('#root');

    const emptyUser = {
        ID: null,
        Username: null,
        NameSurname: null,
        Password: null,
        FK_RoleID: null,
        Role: null,
        Vehicle: null,
        VUID: null
    };
    const [reload, setReload] = useState(false);
    const [users, setUsers] = useState([]);
    const [availableVehicles, setAvailableVehicles] = useState([]);
    const [selectedUser, setSelectedUser] = useState(emptyUser);
    const [createModalIsOpen, setCreateIsOpen] = useState(false);
    const [updateModalIsOpen, setUpdateIsOpen] = useState(false);
    const [deleteModalIsOpen, setDeleteIsOpen] = useState(false);
    const [changeVehicleModalIsOpen, setChangeVehicleIsOpen] = useState(false);

    let loggedUser;

    const options = {headers:{
        Authorization: "Bearer " + localStorage.getItem("token")
    }};
    useEffect(()=>{
        fetch("http://localhost:4000/api/getAllUsers", options)
        .then((response)=>response.json())
        .then((users)=>{
            console.log(users.recordsets[0]);
            for(i=0; i < users.recordsets[0].length; i++) {
                if(users.recordsets[0][i].FK_RoleID == 1) {
                    users.recordsets[0][i].Role = "Admin"
                }
                else if(users.recordsets[0][i].FK_RoleID == 2) {
                    users.recordsets[0][i].Role = "Manager"
                }
                else if(users.recordsets[0][i].FK_RoleID == 3) {
                    users.recordsets[0][i].Role = "Employee"
                }
            }
            setUsers(users.recordsets[0]);
        });

        fetch("http://localhost:4000/api/getAvailableVehicles", options)
        .then((response)=>response.json())
        .then((avVehicles)=>{
            console.log(avVehicles.recordsets[0]);
            setAvailableVehicles(avVehicles.recordsets[0]);
        });
    }, [reload]);
    

    const verifyAuth = () => {
        if(localStorage.getItem("token")) {
            //console.log(localStorage.getItem("token"))
            //setUser(JSON.parse(localStorage.getItem("user")));
            loggedUser = JSON.parse(localStorage.getItem("user"));
            return true;
        }
        else {
            return false;
        }
    }

    const verifyRole = () => {
        if(loggedUser.roleID == 1) {
            return true;
        }
        else {
            return false;
        }
    }

    function closeModals() {
        setSelectedUser(emptyUser);
        setCreateIsOpen(false);
        setUpdateIsOpen(false);
        setDeleteIsOpen(false);
        setChangeVehicleIsOpen(false);
    }

    function callCreate() {
        setSelectedUser(emptyUser);
        setCreateIsOpen(true);
    }
    function confirmCreate() {
        fetch(`http://localhost:4000/api/registration`, {
            method: "POST",
            body: JSON.stringify({
                username: selectedUser.Username,
                password: selectedUser.Password,
                namesurname: selectedUser.NameSurname,
                roleID: selectedUser.FK_RoleID
            }),headers: {"Content-type": "application/json;charset=UTF-8", Authorization: "Bearer " + localStorage.getItem("token")}
        })
        .then((result)=>{
            console.log(result);
            setReload(!reload);
            setSelectedUser(emptyUser);
            closeModals();
        })
        .catch((err)=>console.log(err));
    }

    function callEdit(rowData) {
        console.log(rowData);
        setSelectedUser(rowData);
        setUpdateIsOpen(true);
    }
    function confirmEdit() {
        fetch(`http://localhost:4000/api/updateUser`, {
            method: "PUT",
            body: JSON.stringify({
                userID: selectedUser.ID,
                username: selectedUser.Username,
                password: selectedUser.Password,
                namesurname: selectedUser.NameSurname,
                roleID: selectedUser.FK_RoleID
            }), headers: {"Content-type": "application/json;charset=UTF-8", Authorization: "Bearer " + localStorage.getItem("token")}
        })
        .then((result)=>{
            console.log(result);
            setReload(!reload);
            setSelectedUser(emptyUser);
            closeModals();
        })
        .catch((err)=>console.log(err));
    }

    function callDelete(rowData) {
        console.log(rowData);
        setSelectedUser(rowData);
        setDeleteIsOpen(true);
    }
    function confirmDelete() {
        fetch(`http://localhost:4000/api/deleteUser`, {
            method: "DELETE",
            body: JSON.stringify({
                userID: selectedUser.ID
            }), headers: {"Content-type": "application/json;charset=UTF-8", Authorization: "Bearer " + localStorage.getItem("token")}
        })
        .then((result)=>{
            console.log(result);
            setReload(!reload);
            setSelectedUser({});
            closeModals();
        })
        .catch((err)=>console.log(err));
    }

    function callChangeVehicle(rowData) {
        console.log(rowData);
        setSelectedUser(rowData);
        setChangeVehicleIsOpen(true);
    }
    function confirmChangeVehicle() {
        if(selectedUser.VUID != null) {
            fetch(`http://localhost:4000/api/takeUserVehicle`, {
            method: "PATCH",
            body: JSON.stringify({
                id: selectedUser.VUID
            }), headers: {"Content-type": "application/json;charset=UTF-8", Authorization: "Bearer " + localStorage.getItem("token")}
        })
        .then((result)=>{
            console.log(result);
        })
        .catch((err)=>console.log(err));
        }
        if(selectedUser.Vehicle != null) {
            fetch(`http://localhost:4000/api/giveUserVehicle`, {
                method: "POST",
                body: JSON.stringify({
                    userID: selectedUser.ID,
                    vehicleID: selectedUser.Vehicle //.substring(0, selectedUser.Vehicle.indexOf(' '))
                }), headers: {"Content-type": "application/json;charset=UTF-8", Authorization: "Bearer " + localStorage.getItem("token")}
            })
            .then((result)=>{
                console.log(result);
                setReload(!reload);
                setSelectedUser(emptyUser);
                closeModals();
            })
            .catch((err)=>console.log(err));
        }
    }

    function onChangeUsername(e) {
        selectedUser.Username = e.target.value;
        //console.log(selectedUser);
    }
    function onChangeNameSurname(e) {
        selectedUser.NameSurname = e.target.value;
        //console.log(selectedUser);
    }
    function onChangePassword(e) {
        selectedUser.Password = e.target.value;
        //console.log(selectedUser);
    }
    function onChangeRoleID(e) {
        selectedUser.FK_RoleID = e.target.value;
        //console.log(selectedUser);
    }
    function onChangeVehicle(e) {
        selectedUser.Vehicle = e.target.value;
        //console.log(selectedUser);
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
            verifyRole() ? 
            hooks.visibleColumns.push(columns => [
                //...columns,
                ...columns.slice(0,-1),
                {
                    accessor: 'actions',
                    Header: ("Actions"),
                    Cell: ({ row }) => (
                        <div>
                            <button onClick={e=> callEdit(row.original)}>Edit</button>
                            <button onClick={e=> callDelete(row.original)}>Delete</button>
                        </div>
                    ),
                }
            ]):
            hooks.visibleColumns.push(columns => [
                //...columns,
                ...columns.slice(0,-1),
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
                Header: 'ID',
                accessor: 'ID',       
            },
            {   
                Header: 'Username',
                accessor: 'Username',       
            },
            {   
                Header: 'Full name',
                accessor: 'NameSurname',       
            },
            {   
                Header: 'Role',
                accessor: 'Role',       
            },
            {   
                Header: 'Vehicle',
                accessor: 'Vehicle',       
            },
            {   
                Header: 'Change Vehicle',
                accessor: 'ChangeVehicle',
                Cell: ({ row }) => (
                    <button onClick={e=> callChangeVehicle(row.original)}>Change</button>
                ),       
            },
            {
                id: 'VUID',
                Header: 'VUID',
                accessor: 'VUID'
            },
        ],
        []
    )

    if(verifyAuth()){
        return(
            <div>
                <Header />
                <div className="aBody">
                    {verifyRole() && <button onClick={e => callCreate()}>Create User</button>}
                    <Table columns={columns} data={users}/>
                </div>
                <Modal
                    isOpen={createModalIsOpen}
                    onRequestClose={closeModals}
                    shouldCloseOnOverlayClick={false}
                >
                    <h2>Create:</h2>
                    <form className="CRUD" onSubmit={(e)=>{ e.preventDefault();}}>
                        <div className="CRUDBlock">
                            <label htmlFor="username">Username:</label>
                            <input
                                type="text"
                                onChange={onChangeUsername}
                                onBlur={onChangeUsername}
                            ></input>
                        </div>
                        <div className="CRUDBlock">
                            <label htmlFor="namesurname">Name and surname:</label>
                            <input
                                type="text"
                                onChange={onChangeNameSurname}
                                onBlur={onChangeNameSurname}
                            ></input>
                        </div>
                        <div className="CRUDBlock">
                            <label htmlFor="password">Password:</label>
                            <input
                                type="text"
                                onChange={onChangePassword}
                                onBlur={onChangePassword}
                            ></input>
                        </div>
                        <div className="CRUDBlock">
                            <label htmlFor="role">Role:</label>
                            <select onChange={onChangeRoleID}>
                                <option value={1}>Admin</option>
                                <option value={2}>Manager</option>
                                <option value={3}>Employee</option>
                            </select>
                        </div>
                        <div>
                            <button onClick={e=> confirmCreate()}>Create</button>
                            <button onClick={closeModals}>Close</button>
                        </div>
                    </form>
                </Modal>
                <Modal
                    isOpen={updateModalIsOpen}
                    onRequestClose={closeModals}
                    shouldCloseOnOverlayClick={false}
                >
                    <h2>Update:</h2>
                    <form className="CRUD" onSubmit={(e)=>{ e.preventDefault();}}>
                        <div className="CRUDBlock">
                            <label htmlFor="username">New username:</label>
                            <input
                                type="text"
                                defaultValue={selectedUser.Username}
                                onChange={onChangeUsername}
                                onBlur={onChangeUsername}
                            ></input>
                        </div>
                        <div className="CRUDBlock">
                            <label htmlFor="namesurname">New name and surname:</label>
                            <input
                                type="text"
                                defaultValue={selectedUser.NameSurname}
                                onChange={onChangeNameSurname}
                                onBlur={onChangeNameSurname}
                            ></input>
                        </div>
                        <div className="CRUDBlock">
                            <label htmlFor="password">New password:</label>
                            <input
                                type="text"
                                onChange={onChangePassword}
                                onBlur={onChangePassword}
                            ></input>
                        </div>
                        <div className="CRUDBlock">
                            <label htmlFor="role">New role:</label>
                            <select onChange={onChangeRoleID} defaultValue={selectedUser.FK_RoleID}>
                                <option value={1}>Admin</option>
                                <option value={2}>Manager</option>
                                <option value={3}>Employee</option>
                            </select>
                        </div>
                        <div>
                            <button onClick={e=> confirmEdit()}>Update</button>
                            <button onClick={closeModals}>Close</button>
                        </div>
                    </form>
                </Modal>
                <Modal
                    isOpen={deleteModalIsOpen}
                    onRequestClose={closeModals}
                    shouldCloseOnOverlayClick={false}
                >
                    <h3>Are you sure you want to DELETE user: <b>{selectedUser.Username}</b>?</h3>
                    <form onSubmit={(e)=>{ e.preventDefault();}}>
                        <button onClick={e=> confirmDelete()}>Yes</button>
                        <button onClick={closeModals}>No</button>
                    </form>
                </Modal>
                <Modal
                    isOpen={changeVehicleModalIsOpen}
                    onRequestClose={closeModals}
                    shouldCloseOnOverlayClick={false}
                >
                    <h3>Change vehicle for user: <b>{selectedUser.Username}</b></h3>
                    <form className="CRUD" onSubmit={(e)=>{ e.preventDefault();}}>
                        <div className="CRUDBlock">
                            <label htmlFor="currentVehicle">Current vehicle: {selectedUser.Vehicle}</label>
                        </div>
                        <div className="CRUDBlock">
                            <label htmlFor="newVehicle">New vehicle:</label>
                            <select onChange={onChangeVehicle} defaultValue={null}>
                                <option value={null}>None</option>
                                {availableVehicles.map(vehicle => <option value={vehicle.ID}>{vehicle.ID} {vehicle.Manufacturer} {vehicle.Model}</option>)}
                            </select>
                        </div>
                        <div>
                            <button onClick={e=> confirmChangeVehicle()}>Update</button>
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
export default Users;