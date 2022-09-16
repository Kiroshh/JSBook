import produce from "immer";
import {Cell} from "../cell";
import {Action} from "../actions";
import {ActionType} from "../action-types";


interface CellState {
    loading: boolean;
    error: string | null;
    order: String[];
    data: {
        [key: string]: Cell
    }
}

const initialState: CellState = {
    loading: false,
    error: null,
    order: [],
    data: {}

}

const reducer = produce((state: CellState = initialState, action: Action) => {
    switch (action.type) {
        case ActionType.UPDATE_CELL:
            const {id, content} = action.payload;
            state.data[id].content = content;
            return state;
        case ActionType.DELETE_CELL:
            delete state.data[id];
            state.order = state.order.filter((id) => id !== action.payload)
            return state;
        case ActionType.MOVE_CELL:
            const {direction} = action.payload;
            const index = state.order.findIndex((id) => id === action.payload.id);
            const targetIndex = direction === 'up' ? (index - 1) : (index + 1)
            if (targetIndex < 0 || targetIndex > state.order.length - 1) {
                return state;
            }
            state.order[targetIndex] = state.order[index];
            state.order[index] = action.payload.id;
            return state;
        case ActionType.INSERT_CELL_BEFORE: {

            let cell: Cell = {
                id: randomId(),
                type: action.payload.type,
                content: '',

            }
            state.data[cell.id] = cell;
            const index = state.order.findIndex((id) => id === action.payload.id);
            if (index < 0) {
                state.order.push(cell.id);
            } else {
                state.order.splice(index, 0, cell.id);

            }

            return state;
        }
        default:
            return state
    }
})

const randomId = () => {
    return Math.random().toString(36).substring(2, 5);
}

export default reducer;
