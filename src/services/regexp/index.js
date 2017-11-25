/**
 * Created by j_bleach on 2017/10/23.
 */

//身份证
const reg_idCard = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/;
//手机号码
const reg_phone = /^1[34578]\d{9}$/;
//姓名：中英文
const reg_name = /^[\u4E00-\u9FA5A-Za-z]+$/;

export {reg_idCard, reg_phone, reg_name}