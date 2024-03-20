import axios from 'axios'
async function GetUser() {
    let User: any 
    try {
        await axios.get('api/users/getuser').then((res)=>{
            if(res.data.success == false){
                return null
            }else{
                User = res.data.user
            }
        })
    } catch (error) {
        console.log(error)
    }
       
  return User
}

export default GetUser