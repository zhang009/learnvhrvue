import {getRequest} from "./api";



export const initMenu=(router,store)=>{
    if(store.state.routes.length>0){
        return;
    }
    getRequest("/system/config/menu").then(data=>{
        if(data){
            let fmtRoutes=formatRoutes(data);
            console.log(fmtRoutes);
            router.addRoutes(fmtRoutes);
            store.commit('initRoutes', fmtRoutes);//调用刚才index.js定义的方法
        }
    })
}
export const formatRoutes=(routes)=>{
    let fmRoutes=[];//最终返回的数据

    routes.forEach(router=>{
        let{
            path,
            component,
            name,
            meta,
            iconCls,
            children
        } = router;//批量的变量定义
        if(children&& children instanceof Array){
            children=formatRoutes(children);//递归调用
        }
        let fmRouter={
            path: path,
            name: name,
            iconCls: iconCls,
            meta: meta,
            children:children,//这个时候children已经是格式化后的
            component(resolve){
               /* if(component.startWith("Emp")){
                    require(['../views/emp/'+component+".vue"],resolve);//与cli3模板道理类似(ES5里面的写法)
                }else if(component.startWith("Per")){
                    require(['../views/per/'+component+".vue"],resolve);
                }else if(component.startWith("Sal")){
                    require(['../views/sal/'+component+".vue"],resolve);
                }else if(component.startWith("Sta")){
                    require(['../views/sta/'+component+".vue"],resolve);
                }else if(component.startWith("Sys")){
                    require(['../views/sys/'+component+".vue"],resolve);
                }*/
                if (component.startsWith("Home")) {
                    require(['../views/' + component + '.vue'], resolve);
                } else if (component.startsWith("Emp")) {
                    require(['../views/emp/' + component + '.vue'], resolve);
                } else if (component.startsWith("Per")) {
                    require(['../views/per/' + component + '.vue'], resolve);
                } else if (component.startsWith("Sal")) {
                    require(['../views/sal/' + component + '.vue'], resolve);
                } else if (component.startsWith("Sta")) {
                    require(['../views/sta/' + component + '.vue'], resolve);
                } else if (component.startsWith("Sys")) {
                    require(['../views/sys/' + component + '.vue'], resolve);
                }

            }
        }
        fmRoutes.push(fmRouter);
    })
    return fmRoutes;
}