//Global error handler

const globalErrHandler=(err,req,res,next) => {

    if(res.statusCode < 400) next()
    const statusCode = res.statusCode || 500;

    let status='error'
    if(statusCode.toString().startsWith('4')) status='fail'
    res.status(statusCode).json({
        status,
        message:err.message
    })
    next()

}

module.exports= globalErrHandler