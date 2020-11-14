"use strict"
import Vue from 'vue'
import device from 'mobile-device-detect'

const Helper = {
    install(Vue){
        Vue.prototype.appName = process.env.VUE_APP_NAME
        Vue.prototype.corporateName = "RS PHC SURABAYA"
        Vue.prototype.deviceInfo = JSON.stringify(device.deviceDetect())
        Vue.prototype.tokenGuest = {
            headers:{
                'Authorization' : 'Bearer iy6xhCR4z3MKjJ05ingIRT0GAy0deMZ8QvGtFxAWzBdLEjjHzxkaXEca6ZTvqKtL3Ku3Wgl161pCv1xf58J3B4JRKpPuxC6oOV8C',
            }
        }
        Vue.prototype.getImage = function(folder_name,image){
            if(image != null && image.length>0){
                return process.env.VUE_APP_API_URL + '/images/' + folder_name + '/' + image
            }else{
                return process.env.VUE_APP_API_URL + '/images/' + folder_name + '/no_image.png'
            }
        }
        // Vue.prototype.getLogoInstansi = function(image){
        //     return process.env.VUE_APP_API_URL + '/images/logo_perusahaan/' + image
        // }
        Vue.prototype.formatDateTime = function(sDate,FormatType){
            let lDate = new Date(sDate)
            let month=new Array(12)
            month[0]="Januari"
            month[1]="Februari"
            month[2]="Maret"
            month[3]="April"
            month[4]="Mei"
            month[5]="Juni"
            month[6]="Juli"
            month[7]="Agustus"
            month[8]="September"
            month[9]="Oktober"
            month[10]="November"
            month[11]="Desember"

            let weekday=new Array(7)
            weekday[0]="Ahad"
            weekday[1]="Senin"
            weekday[2]="Selasa"
            weekday[3]="Rabu"
            weekday[4]="Kamis"
            weekday[5]="Jumat"
            weekday[6]="Sabtu"

            let hh = lDate.getHours() < 10 ? '0' + 
                lDate.getHours() : lDate.getHours()
            let mi = lDate.getMinutes() < 10 ? '0' + 
                lDate.getMinutes() : lDate.getMinutes()
            let ss = lDate.getSeconds() < 10 ? '0' + 
                lDate.getSeconds() : lDate.getSeconds()

            let d = lDate.getDate()
            let dd = d < 10 ? '0' + d : d
            let yyyy = lDate.getFullYear();
            let mon = eval(lDate.getMonth()+1)
            let mm = (mon<10?'0'+mon:mon)
            let monthName=month[lDate.getMonth()]
            let weekdayName=weekday[lDate.getDay()]

            if(FormatType==1) {
                return dd+'/'+mm+'/'+yyyy+' '+hh+':'+mi
            } else if(FormatType==2) {
                return weekdayName+', '+dd+' '+ monthName +' ' + yyyy
            } else if(FormatType==3) {
                return dd+'/'+mm+'/'+yyyy
            } else if(FormatType==4) {
                let dd1 = lDate.getDate()
                return dd1+'-'+monthName+'-'+yyyy
            } else if(FormatType==5) {
                return dd+'/'+mm+'/'+yyyy+' '+hh+':'+mi+':'+ss
            } else if(FormatType == 6) {
                return mon + '/' + d + '/' + yyyy + ' ' + hh + ':' + mi + ':' + ss
            } else if(FormatType == 7) {
                return  dd + '-' + monthName + '-' + yyyy + ' ' + hh + ':' + mi + ':' + ss
            } else if(FormatType==8) {
                return dd+'-'+mm+'-'+yyyy
            } else if(FormatType==9) {
                return dd+'-'+mm+'-'+yyyy+' '+hh+':'+mi+':'+ss
            }
        }
    }
}

Vue.use(Helper)