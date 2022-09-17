import './cell-list.css'
import {useTypeSelector} from "../hooks/use-type-selector";
import CellListItem from "./cell-list-item";
import AddCell from "./add-cell";
import React from "react";


const CellList: React.FC = () => {
    const cells = useTypeSelector(({cells: {order, data}}) => {
        return order.map((id) => {
            return data[id];
        })
    })

    const renderedCells = cells.map(cell => <React.Fragment key={cell.id}>
        <CellListItem cell={cell}></CellListItem>
        <AddCell previousCellId={cell.id}/>
    </React.Fragment>)

    return <div className="cell-list">
        <AddCell forceVisible={cells.length === 0} previousCellId={null}/>
        {renderedCells}
    </div>
}

export default CellList;
