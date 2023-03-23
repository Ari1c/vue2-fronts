const font = {
    //字体缩放
    fontZoom(res) {
        let clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        if (!clientWidth) return;
        let fontSize = (clientWidth / 1920);  //获取字体缩放比例
        return res * fontSize;
    },
}


export default font