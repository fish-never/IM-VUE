
let list = ["/::)", "/::~", "/::B", "/::|", "/:8-)", "/::<", "/::$", "/::X", "/::Z", "/::'(", "/::-|", "/::@", "/::P", "/::D", "/::O", "/::(", "/::+", "/:–b", "/::Q", "/::T", "/:,@P", "/:,@-D", "/::d", "/:,@o", "/::g", "/:|-)", "/::!", "/::L", "/::>", "/::,@", "/:,@f", "/::-S", "/:?", "/:,@x", "/:,@@", "/::8", "/:,@!", "/:!!!", "/:xx", "/:bye", "/:wipe", "/:dig", "/:handclap", "/:&-(", "/:B-)", "/:<@", "/:@>", "/::-O", "/:>-|", "/:P-(", "/::'|", "/:X-)", "/::*", "/:@x", "/:8*", "/:pd", "/:<W>", "/:beer", "/:basketb", "/:oo", "/:coffee", "/:eat", "/:pig", "/:rose", "/:fade", "/:showlove", "/:heart", "/:break", "/:cake", "/:li", "/:bome", "/:kn", "/:footb", "/:ladybug", "/:shit", "/:moon", "/:sun", "/:gift", "/:hug", "/:strong", "/:weak", "/:share", "/:v", "/:@)", "/:jj", "/:@@", "/:bad", "/:lvu", "/:no", "/:ok", "/:love", "/:<L>", "/:jump", "/:shake", "/:<O>", "/:circle", "/:kotow", "/:turn", "/:skip", "[挥手]", "/:#-0", "[街舞]", "/:kiss", "/:<&", "/:&>"];

function emojiIndexToImg(idx){
    return '<img  src="https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/'+ idx +'.gif" data-emoji="'+ idx +'"/>';
}

function emojiToImg(code){
    let str = code;
    for(let i =0; i<list.length; i++){
        let ej = list[i];
        if(str){
        while(str.indexOf(ej) != -1){
            str = str.replace(ej, emojiIndexToImg(i));
        }
        }
    }
    return str;
}

function imgToEomoji(html){
    // return html.replace(/<img .*? data-emoji="(.*?)"\/>/g, function(it, idx){
    return html.replace(/<img .*? data-emoji="(.*?)".*?>/g, function(it, idx){
        return list[idx];
    })
}

export default {
    list,
    emojiIndexToImg,
    emojiToImg,
    imgToEomoji,
}


