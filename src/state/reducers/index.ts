import cellReducer from "./cellReducer";
import {combineReducers} from "redux";
import bundleReducer from "./bundleReducer";

const reducers = combineReducers({
    cells: cellReducer,
    bundles: bundleReducer
})

export default reducers;

export type RootState = ReturnType<typeof reducers>
