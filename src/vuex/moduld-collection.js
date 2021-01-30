import { forEachValue } from "./utils"
import Module from './modules'
//将state格式化为树结构
export default class ModuldCollection{
    constructor(options){
        this.register([],options)

    }
    getNamespaced(path){
        let root = this.root
        let moduleName = path.reduce((str,current)=>{
            //判断当前模块中是否有namespeced
            root = root.getModuleChildren(current)
           if(root.namespeced){
            str += current + '/'
           }
           return str
        },'')
        return moduleName
    }
    register(path,rootModule){
        //1. 创建格式化后的对象 
        let newModule = new Module(rootModule)
        //2.如果path.lenth是0,那么就是根模块
        if(path.length ===0){
            this.root = newModule
        }else{
            //4. 那么这个值就是children 
            /**
             *   [a,b,c, d] 给d找爸爸
             *   如果是root的children那么肯定是形成一个新数组的第一项
             *   reduce遍历空数组，如果第二个参数有值，则返回第二个值，如果没有那么报错
             */
            let  parent =  path.slice(0,-1).reduce((memo,current)=>{
               return memo.getModuleChildren(current)
            },this.root)
            parent.setModuleChildren([path[path.length -1]],newModule)
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