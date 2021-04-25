const mongoose=require('mongoose');


const dbConnection = async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_ATLAS,{
            useNewUrlParser: true,
            useUnifiedTopology:true,
            useCreateIndex:true,
            useFindAndModify:false
        });
        console.log('Connection to DB successfully');
    }catch(err){
        throw new Error('Error DB');
    }

}


module.exports={
    dbConnection
}