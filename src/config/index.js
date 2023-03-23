const ip = ''
const setting = {
    dev: {
        // wzyserviceURL: "https://4611v798p7.zicp.fun",
        wzyserviceURL: "https://6730z68z61.goho.co",
        yxdserviceURL: 'https://6730z68z61.goho.co',
        serviceURL_menu: "http://10.145.41.45:8082/manager-server",
        serviceURL_user: "http://10.145.41.123:8083/user-server",
        serviceBaseUrl: '',
        whjserivceUrl: 'https://3f840622o1.goho.co/',
        // whjserivceUrl: 'https://6730z68z61.goho.co/',
    },
    test: {

    },
    pro: {
        //生产

    }
}
const config = process.env.NODE_ENV === 'production' ? setting.pro : process.env.NODE_ENV === 'development' ? setting.dev : setting.test
export default config