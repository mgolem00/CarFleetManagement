import React, {useState, useEffect} from "react";
import { useTable } from 'react-table';
import Modal from 'react-modal';
import Header from "./header";
import Footer from "./footer";

const Vehicles = () =>{
    
    Modal.setAppElement('#root');

    const [reload, setReload] = useState(false);
    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState({});
    const [createModalIsOpen, setCreateIsOpen] = useState(false);
    const [updateModalIsOpen, setUpdateIsOpen] = useState(false);
    const [deleteModalIsOpen, setDeleteIsOpen] = useState(false);
    const [retireModalIsOpen, setRetireIsOpen] = useState(false);

    const options = {headers:{
        Authorization: "Bearer " + localStorage.getItem("token")
    }};
    useEffect(()=>{
        fetch("http://localhost:4000/api/getAllVehicles", options)
        .then((response)=>response.json())
        .then((result)=>{
            /*console.log(result.recordsets[0]);
            for(i=0; i < result.recordsets[0].length; i++) {
                console.log(result.recordsets[0][i].ActiveFrom + typeof(result.recordsets[0][i].ActiveFrom))
                result.recordsets[0][i].ActiveFrom  = result.recordsets[0][i].ActiveFrom.subString(0,9);
                if(result.recordsets[0][i].RetiredFrom) {
                    result.recordsets[0][i].RetiredFrom  = result.recordsets[0][i].RetiredFrom.subString(0,9);
                }
            }*/
            setVehicles(result.recordsets[0]);
        });
    }, [reload]);
    

    const verifyAuth = () => {
        if(localStorage.getItem("token")) {
            return true;
        }
        else {
            return false;
        }
    }

    function closeModals() {
        setSelectedVehicle({});
        setCreateIsOpen(false);
        setUpdateIsOpen(false);
        setDeleteIsOpen(false);
        setRetireIsOpen(false);
    }

    function callCreate() {
        setSelectedVehicle({});
        setCreateIsOpen(true);
    }
    function confirmCreate() {
        fetch(`http://localhost:4000/api/createVehicle`, {
            method: "POST",
            body: JSON.stringify({
                manufacturer: selectedVehicle.Manufacturer,
                model: selectedVehicle.Model,
                color: selectedVehicle.Color,
                yearManufactured: selectedVehicle.YearManufactured,
                fuelType: selectedVehicle.FuelType,
                transmissionType: selectedVehicle.TransmissionType
            }),headers: {"Content-type": "application/json;charset=UTF-8", Authorization: "Bearer " + localStorage.getItem("token")}
        })
        .then((result)=>{
            console.log(result);
            setReload(!reload);
            setSelectedVehicle({});
            closeModals();
        })
        .catch((err)=>console.log(err));
    }

    function callEdit(rowData) {
        console.log(rowData);
        setSelectedVehicle(rowData);
        setUpdateIsOpen(true);
    }
    function confirmEdit() {
        fetch(`http://localhost:4000/api/updateVehicle`, {
            method: "PUT",
            body: JSON.stringify({
                vehicleID: selectedVehicle.ID,
                manufacturer: selectedVehicle.Manufacturer,
                model: selectedVehicle.Model,
                color: selectedVehicle.Color,
                yearManufactured: selectedVehicle.YearManufactured,
                fuelType: selectedVehicle.FuelType,
                transmissionType: selectedVehicle.TransmissionType
            }), headers: {"Content-type": "application/json;charset=UTF-8", Authorization: "Bearer " + localStorage.getItem("token")}
        })
        .then((result)=>{
            console.log(result);
            setReload(!reload);
            setSelectedVehicle({});
            closeModals();
        })
        .catch((err)=>console.log(err));
    }

    function callDelete(rowData) {
        console.log(rowData);
        setSelectedVehicle(rowData);
        setDeleteIsOpen(true);
    }
    function confirmDelete() {
        fetch(`http://localhost:4000/api/deleteVehicle`, {
            method: "DELETE",
            body: JSON.stringify({
                vehicleID: selectedVehicle.ID
            }), headers: {"Content-type": "application/json;charset=UTF-8", Authorization: "Bearer " + localStorage.getItem("token")}
        })
        .then((result)=>{
            console.log(result);
            setReload(!reload);
            setSelectedVehicle({});
            closeModals();
        })
        .catch((err)=>console.log(err));
    }

    function callRetire(rowData) {
        console.log(rowData);
        setSelectedVehicle(rowData);
        setRetireIsOpen(true);
    }
    function confirmRetire() {
        fetch(`http://localhost:4000/api/retireVehicle`, {
            method: "PATCH",
            body: JSON.stringify({
                vehicleID: selectedVehicle.ID
            }), headers: {"Content-type": "application/json;charset=UTF-8", Authorization: "Bearer " + localStorage.getItem("token")}
        })
        .then((result)=>{
            console.log(result);
            setReload(!reload);
            setSelectedVehicle({});
            closeModals();
        })
        .catch((err)=>console.log(err));
    }

    function onChangeManufacturer(e) {
        selectedVehicle.Manufacturer = e.target.value;
        //console.log(selectedUser);
    }
    function onChangeModel(e) {
        selectedVehicle.Model = e.target.value;
        //console.log(selectedUser);
    }
    function onChangeColor(e) {
        selectedVehicle.Color = e.target.value;
        //console.log(selectedUser);
    }
    function onChangeYearManufactured(e) {
        selectedVehicle.YearManufactured = e.target.value;
        //console.log(selectedUser);
    }
    function onChangeFuelType(e) {
        selectedVehicle.FuelType = e.target.value;
        //console.log(selectedUser);
    }
    function onChangeTransmissionType(e) {
        selectedVehicle.TransmissionType = e.target.value;
        //console.log(selectedUser);
    }


    function Table({ columns, data }) {
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
                {
                    id: 'retire',
                    Header: ("Retire"),
                    Cell: ({ row }) => (
                        <div>
                            <button onClick={e=> callRetire(row.original)}>Retire</button>
                        </div>
                    ),
                },
                {
                    id: 'actions',
                    Header: ("Actions"),
                    Cell: ({ row }) => (
                        <div>
                            <button onClick={e=> callEdit(row.original)}>Edit</button>
                            <button onClick={e=> callDelete(row.original)}>Delete</button>
                        </div>
                    ),
                },
            ])
        },
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
                Header: 'Manufacturer',
                accessor: 'Manufacturer',       
            },
            {   
                Header: 'Model',
                accessor: 'Model',       
            },
            {   
                Header: 'Color',
                accessor: 'Color',       
            },
            {   
                Header: 'Year Manufactured',
                accessor: 'YearManufactured',       
            },
            {   
                Header: 'Fuel Type',
                accessor: 'FuelType',       
            },
            {   
                Header: 'Transmission Type',
                accessor: 'TransmissionType',       
            },
            {   
                Header: 'Active From',
                accessor: 'ActiveFrom',       
            },
            {   
                Header: 'Retired From',
                accessor: 'RetiredFrom',       
            }
        ],
        []
    )

    if(verifyAuth()){
        return(
            <div>
                <Header />
                <div className="aBody">
                    <button onClick={e => callCreate()}>Create Vehicle</button>
                    <Table columns={columns} data={vehicles}/>
                </div>
                <Modal
                    isOpen={createModalIsOpen}
                    onRequestClose={closeModals}
                    shouldCloseOnOverlayClick={false}
                >
                    <h2>Create:</h2>
                    <form className="CRUD" onSubmit={(e)=>{ e.preventDefault();}}>
                        <div className="CRUDBlock">
                            <label htmlFor="manufacturer">Manufacturer:</label>
                            <input
                                type="text"
                                onChange={onChangeManufacturer}
                                onBlur={onChangeManufacturer}
                            ></input>
                        </div>
                        <div className="CRUDBlock">
                            <label htmlFor="model">Model:</label>
                            <input
                                type="text"
                                onChange={onChangeModel}
                                onBlur={onChangeModel}
                            ></input>
                        </div>
                        <div className="CRUDBlock">
                            <label htmlFor="color">Color:</label>
                            <input
                                type="text"
                                onChange={onChangeColor}
                                onBlur={onChangeColor}
                            ></input>
                        </div>
                        <div className="CRUDBlock">
                            <label htmlFor="yearManufactured">Year manufactured:</label>
                            <input
                                type="number"
                                onChange={onChangeYearManufactured}
                                onBlur={onChangeYearManufactured}
                            ></input>
                        </div>
                        <div className="CRUDBlock">
                            <label htmlFor="fuelType">Fuel type:</label>
                            <select onChange={onChangeFuelType} defaultValue={selectedVehicle.FuelType}>
                                <option value={"Petrol"}>Petrol</option>
                                <option value={"Diesel"}>Diesel</option>
                                <option value={"Electric"}>Electric</option>
                            </select>
                        </div>
                        <div className="CRUDBlock">
                            <label htmlFor="transmissionType">Transmission type:</label>
                            <select onChange={onChangeTransmissionType} defaultValue={selectedVehicle.TransmissionType}>
                                <option value={"Manual"}>Manual</option>
                                <option value={"Automatic"}>Automatic</option>
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
                            <label htmlFor="username">New manufacturer:</label>
                            <input
                                type="text"
                                defaultValue={selectedVehicle.Manufacturer}
                                onChange={onChangeManufacturer}
                                onBlur={onChangeManufacturer}
                            ></input>
                        </div>
                        <div className="CRUDBlock">
                            <label htmlFor="namesurname">New model:</label>
                            <input
                                type="text"
                                defaultValue={selectedVehicle.Model}
                                onChange={onChangeModel}
                                onBlur={onChangeModel}
                            ></input>
                        </div>
                        <div className="CRUDBlock">
                            <label htmlFor="color">Color:</label>
                            <input
                                type="text"
                                defaultValue={selectedVehicle.Color}
                                onChange={onChangeColor}
                                onBlur={onChangeColor}
                            ></input>
                        </div>
                        <div className="CRUDBlock">
                            <label htmlFor="yearManufactured">Year manufactured:</label>
                            <input
                                type="number"
                                defaultValue={selectedVehicle.YearManufactured}
                                onChange={onChangeYearManufactured}
                                onBlur={onChangeYearManufactured}
                            ></input>
                        </div>
                        <div className="CRUDBlock">
                            <label htmlFor="fuelType">New fuel type:</label>
                            <select onChange={onChangeFuelType} defaultValue={selectedVehicle.FuelType}>
                                <option value={"Petrol"}>Petrol</option>
                                <option value={"Diesel"}>Diesel</option>
                                <option value={"Electric"}>Electric</option>
                            </select>
                        </div>
                        <div className="CRUDBlock">
                            <label htmlFor="transmissionType">New transmission type:</label>
                            <select onChange={onChangeTransmissionType} defaultValue={selectedVehicle.TransmissionType}>
                                <option value={"Manual"}>Manual</option>
                                <option value={"Automatic"}>Automatic</option>
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
                    <h3>Are you sure you want to DELETE vehicle: <b>{selectedVehicle.ID}</b>?</h3>
                    <form onSubmit={(e)=>{ e.preventDefault();}}>
                        <button onClick={e=> confirmDelete()}>Yes</button>
                        <button onClick={closeModals}>No</button>
                    </form>
                </Modal>
                <Modal
                    isOpen={retireModalIsOpen}
                    onRequestClose={closeModals}
                    shouldCloseOnOverlayClick={false}
                >
                    {
                        selectedVehicle.RetiredFrom ? (
                            <div>
                                <h3><b>{selectedVehicle.ID}</b>is already retired!</h3>
                                <button onClick={closeModals}>OK</button>
                            </div>
                        ) : (
                            <div>
                                <h3>Are you sure you want to RETIRE vehicle: <b>{selectedVehicle.ID}</b>?</h3>
                                <form onSubmit={(e)=>{ e.preventDefault();}}>
                                    <button onClick={e=> confirmRetire()}>Yes</button>
                                    <button onClick={closeModals}>No</button>
                                </form>
                            </div>
                        )
                    }
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
export default Vehicles;