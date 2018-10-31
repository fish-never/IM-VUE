import CONST from '../config/const'

export default {
    
    getProvinceBy(id){
        return CONST.PROVINCES.filter(item=>{
            return item.id == id
        })[0]
    }


}
