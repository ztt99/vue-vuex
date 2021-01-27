import { forEachValue } from "./utils";

export default class Modules {
    constructor(newModule){
        this._row = newModule
        this._children = {}
        this.state = newModule.state
    }
    getModuleChildren(key){
        return this._children[key]
    }
    setModuleChildren(key,children){
        this._children[key] = children
    }
    forEachMutaions(fn){
        if(this._row.mutaions){
            forEachValue(this._row.mutaions,fn)
        }
    }
    forEachActions(fn){
        if(this._row.actions){
            forEachValue(this._row.actions,fn)
        }
    }  
    forEachGetters(fn){
        if(this._row.getters){
            forEachValue(this._row.actions,fn)
        }
    }
    forEachChildren(fn){
        forEachValue(this._children,fn)
    }

}