const {Schema,model}=require('mongoose');

const RoleSchema=Schema({
    rol:{
        type:String,
        required:[true,'Es obligatorio']
    }
});

module.exports=model('Role',RoleSchema);