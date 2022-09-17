/* source for regex, Version 2
https://www.sitepoint.com/javascript-validate-email-address-regex/
*/
export function testEmail(str) {
    var re = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;
    return re.test(str);
}

export function charOnly(str){
    var regex =  /^([a-zA-Z]+\s)*[a-zA-Z]+$/
    return regex.test(str)
}

export function numberOnly(str){
    var regex = /^(0|[1-9][0-9]*)$/
    return regex.test(str)
}