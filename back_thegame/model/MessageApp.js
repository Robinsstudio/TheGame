class MessageApp{
    constructor(){
        this.games={};
    }

    writeMessage(gameId,playerId,playersId,message){
        console.log(this.games);
        if (this.games[`${gameId}`] === undefined){
            this.games[`${gameId}`] = playersId.reduce((prev,ele)=>{prev[`${ele}`]=[];return prev;},{});
        }
        Object.keys(this.games[`${gameId}`]).map(ele=>{
            this.games[`${gameId}`][`${ele}`].push({who : playerId,message:message});
        })
        console.log("Fin write message");
    }

    readMessage(gameId,playerId){
        if(this.games[`${gameId}`] !== undefined && this.games[`${gameId}`][`${playerId}`] !== undefined)
            return this.games[`${gameId}`][`${playerId}`].splice(0,this.games[`${gameId}`][`${playerId}`].length);
        return [];
    }
}


module.exports = MessageApp;