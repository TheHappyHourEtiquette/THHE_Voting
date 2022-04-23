module.exports = async function (context, req, connectionInfo) {
    console.log(connectionInfo);
    context.res.body = connectionInfo;
};