import { useContext } from "react";
import {AddheaderContext} from '../Context/addheaderContext'

export const UseaddheaderContext=()=>{
    const context=useContext(AddheaderContext)
    if (!context){
        throw Error('useaddheaderContext must be used inside an addheaderContextProvider')
    }

    return context
}