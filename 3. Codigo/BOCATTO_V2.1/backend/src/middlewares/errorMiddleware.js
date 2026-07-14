const errorMiddleware = (

    err,

    req,

    res,

    next

) => {

    console.error(err);

    res.status(err.status || 500).json({

        success: false,

        message: err.message,

        data: null

    });

};

export default errorMiddleware;