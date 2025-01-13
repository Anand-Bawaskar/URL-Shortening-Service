//This acts as diary ki kis user ko konsi cookie id mili hai

const sessionIdToUserMap=new Map();    //There is problem agar hum server refresh/restart karte hai ye map bhi refresh ho jaega aur hume firse login karna padega
function setUser(id,user){
    sessionIdToUserMap.set(id,user);
}

function getUser(id){
    return sessionIdToUserMap.get(id);
}

module.exports={
    setUser,
    getUser,
};