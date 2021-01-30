export function mapState (arraState){
    let obj = {}
    arraState.forEach(stateName=>{
        obj[stateName] = function(){
            return this.$store.state[stateName]
        }
    })
    return obj
}