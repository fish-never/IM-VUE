import { Toast } from 'mint-ui';

export default {

    show(msg){
        Toast({
            message: msg,
            position: 'bottom',
            duration: 3000
        });
    },

    bottomShow1500(msg){
      Toast({
        message: msg,
        position: 'bottom',
        duration: 1500
      });
    },

};
