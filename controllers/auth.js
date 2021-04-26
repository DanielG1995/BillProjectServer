const { response } = require("express");
const Usuario = require("../models/usuario");
const bcryptjs=require('bcryptjs');

const login=(req, res=response)=>{
    const {correo,password}=req.body;
    try{
        const usuario=await Usuario.findOne({correo});
    if(!usuario){
        return res.status(400).json({
            msg='Usuario / Password no son correctos'
        });
    }
    if(!usuario.estado){
        return res.status(400).json({
            msg='Usuario / Password no son correctos - estado: false'
        });
    }
    const validPassword=bcryptjs.compareSync(password,usuario.password);
    res.json({
        msg:'Login'
    })

    }catch(err){

    }
    
}

module.exports={
    login
}