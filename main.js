var SSIDs1 = new Array('PSProjectsBar','PSPBScrollRight','PSPBScrollLeft');
var SSIDs2 = new Array('DSSocialBar','DSScrollRight','DSScrollLeft');
var SSIDs3 = new Array('TGTSThemesBar','TGTSScrollRight','TGTSScrollLeft');
var SSIDs4 = new Array('GVTSThemesBar','GVTSScrollRight','GVTSScrollLeft');

function Scroll(a) { location.hash="#TopSlide"; location.hash=a; }

function Start(){ 
    CSB('!',SSIDs1); CSB('!',SSIDs2); CSB('!',SSIDs3); CSB('!',SSIDs4);
    Resize(); 
}

function CSB(a,SSID) {
    if ( a == '!' ){ CSBA(SSID[0],SSID[1],SSID[2],document.getElementById(SSID[0]).scrollLeft); }
    else {
        var SSFV = document.getElementById(SSID[0]).scrollLeft;
        if (a=='R') { SSFV += document.getElementById('body').offsetWidth/1.5; } else { SSFV -= document.getElementById('body').offsetWidth/1.5; }  
        if (SSFV < 0) { SSFV = 0 } else if ( SSFV > (document.getElementById(SSID[0]).scrollWidth - document.getElementById(SSID[0]).clientWidth)) { SSFV = document.getElementById(SSID[0]).scrollWidth - document.getElementById(SSID[0]).clientWidth }
        CSBA(SSID[0],SSID[1],SSID[2],SSFV);
        document.getElementById(SSID[0]).scrollLeft = SSFV;
    }
}

function CSBA(BarID,SRightID,SLeftID,FTSLP) {
    if (document.getElementById('body').offsetWidth < document.getElementById(BarID).scrollWidth) {
        if (FTSLP == 0) {
            document.getElementById(SRightID).style.opacity = '1';
            document.getElementById(SRightID).style.zIndex = '2';
            document.getElementById(SLeftID).style.opacity = '0';
            document.getElementById(SLeftID).style.zIndex = '0';
        } else if ((document.getElementById(BarID).scrollWidth - document.getElementById('body').offsetWidth) == FTSLP) {
            document.getElementById(SRightID).style.opacity = '0';
            document.getElementById(SRightID).style.zIndex = '0';
            document.getElementById(SLeftID).style.opacity = '1';
            document.getElementById(SLeftID).style.zIndex = '2';
        } else {
            document.getElementById(SRightID).style.opacity = '1';
            document.getElementById(SRightID).style.zIndex = '2';
            document.getElementById(SLeftID).style.opacity = '1';
            document.getElementById(SLeftID).style.zIndex = '2';
        }
    } else {
        document.getElementById(SRightID).style.opacity = '0';
        document.getElementById(SRightID).style.zIndex = '0';
        document.getElementById(SLeftID).style.opacity = '0';
        document.getElementById(SLeftID).style.zIndex = '0';
    }
}

function Resize() { CSB('!',SSIDs1); CSB('!',SSIDs2); CSB('!',SSIDs3); CSB('!',SSIDs4); }
