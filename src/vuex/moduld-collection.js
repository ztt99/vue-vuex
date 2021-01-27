import { forEachValue } from "./utils"

export default class ModuldCollection{
    constructor(options){
        this.root=null
        this.register([],options)
    }
    register(path,rootModule){
        //1. 创建格式化后的对象 
        let newModule = {
            _row:rootModule,
            _children :{},
            state:rootModule.state ||{}
        }
        //2.如果path.lenth是0,那么就是根模块
        if(path.length ===0){
            this.root = newModule
        }else{
            //4. 那么这个值就是children 
            /**
             *   [a,b,c, d] 给d找爸爸
             *   如果是root的children那么肯定是形成一个新数组的第一项
             */
            let  parent =  path.slice(0,-1).reduce((memo,current)=>{
               return memo._children[current]
            },this.root)
            parent._children[path[path.length -1]] = newModule
        }

        //3.如果rootModule对象中有module属性，那么需要循环对象再次注册

        if(rootModule.modules){
            forEachValue(rootModule.modules,(moduleObj,moduleName)=>{
                this.register(path.concat(moduleName),moduleObj)
            })
        }

    
    }

}

/**
 * 深度优先搜索
 * this.root = {
 *      _raw:根模块
 *      _children:{
 *      },
 *      state:根模块自己的状态
 * }
 */