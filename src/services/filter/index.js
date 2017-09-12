/**
 * Created by j_bleach on 2017/9/12.
 */

export const sex = (data) => {
    if(!data){
        return ''
    }
    return {
        1: '女',
        2: '男',
        3: '未知'
    }[data]
}