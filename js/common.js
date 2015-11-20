//var baseUrl = "http://172.16.77.41:8080/ningboWeb/nbRequest";
var baseUrl = "http://101.231.124.9:56679/ningboWeb/nbRequest";
var GLOBAL_URL = "http://101.231.124.9:56679/NxServiceAgentV2";
//公共提示框
window.alert = function(msg, callback){
	divShow({
		strTitle: '宁波外配处方平台',
		tip: msg,
		icon: '',
		callback: callback
	});
}
window.confirm = function(msg, callback1, callback2){
	divShow({
		strTitle: '宁波外配处方平台',
		tip: msg,
		icon: '',
		type: 'confirm',
		confirmCallback: callback1,
		callback: callback2
	});
}
// 处方/购药 订单页面提示框
window.alert1 = function(msg, callback){
	divShow({
		strTitle: '提示',
		tip: msg,
		icon: '',
		callback: callback
	});
}
/**
 * select用法
 * $(dom).on("change", select.chooseSelect);
 */
var select = {};
select.chooseSelect = function() {
	var that = $(this).find("select");
	select.setOption(that.parents("[need]"), that.val());
};
select.setOption = function(elem, code, value) {
	var select = elem.find("select");
	select.val(code);
	var codeName = select.find("option:selected").text();
	if(value){
		codeName = value;
	}
	elem.find("[show]").text(codeName);
	elem.attr("need", code);
};
//Ajax请求失败提示
function ajaxError(){
	alert("网络连接失败，请稍后重试！");
}
//Loading
function loading(){
	var len = $("#loading").length;
	var load = '<div id="loading">' +
					'<div class="spinnerBg" len=' + len + '></div>' + 
					'<div class="spinner vAlign">' + 
						'<div class="bounce1"></div>' + 
						'<div class="bounce2"></div>' + 
						'<div class="bounce3"></div>' + 
					'</div>' + 
				'</div>';
	if(len > 0){
		var length = $("#loading>.spinnerBg").attr("len");
		$("#loading>.spinnerBg").attr("len", Number(length) + 1);
		return;
	}
	$("body").append(load);
}
function loaded(){
	var len = $("#loading>.spinnerBg").attr("len");
	if(len > 0){
		$("#loading>.spinnerBg").attr("len", Number(len) - 1);
		return;
	}
//	$("#loading").remove();
	setTimeout('$("#loading").remove()', 500);
}
//表单提交字段封装
function formatFormParams(form, encrypt){
	var params = form.serializeArray();
	var len = params.length;
	var str = "{";
	for(i in params){
		str += "\"" + $.trim(params[i].name) + "\":\"" + $.trim(params[i].value) + "\",";
	}
	str = str.substring(0, str.length - 1);
	str += "}";
	if(encrypt){
		str = strEnc(str, '111111', '', '');
	}
	return str;
}
//cookie相关操作
function getCookie(c_name) {
	if (document.cookie.length > 0) {
		c_start = document.cookie.indexOf(c_name + "=");
		if (c_start != -1) {
			c_start = c_start + c_name.length + 1;
			c_end = document.cookie.indexOf(";", c_start);
			if (c_end == -1)
				c_end = document.cookie.length;
			return unescape(document.cookie.substring(c_start, c_end));
		}
	}
	return "";
}
function setCookie(c_name, value, datetype, expiredays) {
	//datetype 时间类型: d 天, s 秒
	var exdate = new Date();
	if(datetype && expiredays){
		if(datetype == "d"){
			exdate.setDate(exdate.getDate() + expiredays);
		} else if(datetype == "s"){
			exdate.setTime(exdate.getTime() + expiredays*1000);
		}
	}
	document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
}
function divShow(opts) {
	var tip = opts.tip,
		icon = opts.icon,
		callback = opts.callback;
	//类型，confirm表示confirm,其他表示alert
	var type = opts.type;
	var basePath = "..";
	var head = document.getElementsByTagName("head")[0];
	var dialogCSS = document.getElementById("dialogCSS");
	if(dialogCSS){
		
	} else {
		var style = document.createElement("link");
		style.href = "../css/dialog.css";
		style.rel = "stylesheet";
		style.type = "text/css";
		style.id = "dialogCSS";
		head.appendChild(style);
	}

	//判斷是否有msgDiv
	var msgDiv = document.getElementById("dialogMsgDiv");
	if (msgDiv) {
		document.body.removeChild(msgDiv);
	};
	//判斷是否有bgDiv
	var bgDiv = document.getElementById("dialogBgDiv");
	if (bgDiv) {
		document.body.removeChild(bgDiv);
	};

	var bgWidth = document.body.offsetWidth;
	var bgHeight = document.body.offsetHeight;

	//背景div
	bgDiv = document.createElement("div");
	bgDiv.setAttribute("id", "dialogBgDiv");
	bgDiv.className = "dialogBgDiv";
	document.body.appendChild(bgDiv);

	//msg對話框                                                    
	var msgDiv = document.createElement("div");
	msgDiv.setAttribute("id", "dialogMsgDiv");
	msgDiv.setAttribute("align", "center");
	msgDiv.className = "dialogMsgDiv";

	//計算msg對話框大小
	var fontSize = 12;
	var lineWidth = $(window).width() * 0.7;
	var dialogWidth = 250;
	var dialogHeight = 160;
	if (fontSize * tip.length < lineWidth) {
		dialogWidth = parseInt(fontSize * tip.length) + 50;
	} else {
		dialogWidth = parseInt(lineWidth);
		dialogHeight += parseInt(((fontSize * tip.length) / lineWidth) * fontSize);
	}
	if (dialogWidth < 250) {
		dialogWidth = 250;
	}
	msgDiv.style.width = dialogWidth + "px";
	msgDiv.style.height = dialogHeight + "px";
	var left = ($(window).width() - dialogWidth) / 2;
	var top = ($(window).height() - dialogHeight) / 2;
	msgDiv.style.left = left + "px";
	msgDiv.style.top = top + "px";

	//標題
	var title = document.createElement("div");
	title.setAttribute("id", "dialogTitle");
	title.setAttribute("align", "right");
	title.className = "dialogTitle";
	title.title = '关闭';
//	title.innerHTML = "<table border='0' width='100%' height='100%'><tr><td align='left' style='border:none;'>" + opts.strTitle + "</td><td align='right' style='border:none;'><span style='cursor:pointer'><img src='" + basePath + "/images/close.png'></img></span></td></tr></table>";
	title.innerHTML = "<table border='0' width='100%' height='100%'><tr><td align='left' style='border:none;'>" + opts.strTitle + "</td><td align='right' style='border:none;'></td></tr></table>";

	document.body.appendChild(msgDiv);
	document.getElementById("dialogMsgDiv").appendChild(title);

	//展示對話框內容
	var txt = document.createElement("div");
	txt.setAttribute("id", "dialogMsgTxt");
	txt.className = "dialogTxt";
	var txtHeight = dialogHeight - 30 + "px";
//	var txtHeight = dialogHeight - 50 + "px";
//	if(type){
//		txtHeight = dialogHeight - 30 + "px";
//	}
	txt.style.height = txtHeight;
	var txtHTML = "";
	if (icon) {
		if (icon == "failed") {
			txtHTML = "<div style='width:" + dialogWidth + "px;height:" + txtHeight + ";word-break: break-all;word-wrap: break-word;'><div style='text-align:center;height:68%;width:100%;color:#565656;'><div class='vAlign'><img src='" + basePath + "/images/alert.png' style='margin-right:5px;'/>" + tip +
				"</div></div><div style='text-align:center;width:100%;height:32%;'>";
		} else if (icon == "success") {
			txtHTML = "<div style='width:" + dialogWidth + "px;height:" + txtHeight + ";word-break: break-all;word-wrap: break-word;'><div style='text-align:center;height:68%;width:100%;color:#565656;'><div class='vAlign'><img src='" + basePath + "/images/success.png' style='margin-right:5px;'/>" + tip +
				"</div></div><div style='text-align:center;width:100%;height:32%;'>";
		}
	} else {
		txtHTML = "<div style='width:" + dialogWidth + "px;height:" + txtHeight + ";word-break: break-all;word-wrap: break-word;'><div style='text-align:center;height:68%;width:100%;color:#565656;'><div class='vAlign'>" + tip +
			"</div></div><div style='text-align:center;width:100%;height:32%;'>";
	}
	if(type){
		txtHTML += "<button id='dialogConfirmButton' class='dialogButton' type='button' style='border-right:1px solid #d2d2d2;'>确定</button><button id='dialogCloseButton' class='dialogButton' type='button'>取消</button>";
	} else{
		txtHTML += "<button id='dialogCloseButton' class='dialogCloseButton' type='button'>确定</button>";
	}
	txtHTML += "</div></div>";
	txt.innerHTML = txtHTML;
	document.getElementById("dialogMsgDiv").appendChild(txt);
	//點擊標題關閉和關閉按鈕
	var closeAll = document.getElementById("dialogTitle");
	var closeButton = document.getElementById("dialogCloseButton");
	var closeWin = function() {
		document.body.removeChild(bgDiv);
		document.getElementById("dialogMsgDiv").removeChild(title);
		document.body.removeChild(msgDiv);
		//$("body").unbind("keydown");
		if (callback) {
			callback();
		}
	};
//	closeAll.onclick = closeWin;
	closeButton.onclick = closeWin;
	if(type){
		var confirmButton = document.getElementById("dialogConfirmButton");
		confirmButton.onclick = function(){
			document.body.removeChild(bgDiv);
			document.getElementById("dialogMsgDiv").removeChild(title);
			document.body.removeChild(msgDiv);
			var confirmCallback = opts.confirmCallback;
			if(confirmCallback){
				confirmCallback();
			}
		};
	}
	bgDiv.style.visibility = "visible";
	setTimeout("document.getElementById('dialogCloseButton').focus()", 100);
}
// 截取url参数
function request(paras, s) {
    var url = location.href;
    var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
    var paraObj = {}
    for (i = 0; j = paraString[i]; i++) {
        paraObj[j.substring(0, j.indexOf("="))] = j.substring(j.indexOf("=") + 1, j.length);
    }
    var returnValue = paraObj[paras];
    //处理paras值，截取到字符s的位置
    if(returnValue && s){
    	var _i = returnValue.indexOf(s);
		if(_i != -1){
			returnValue = returnValue.substring(0, _i);
		}
    }
    if (typeof (returnValue) == "undefined") {
        return "";
    } else {
        return returnValue;
    }
}
// 截取fromUrl参数
function requestFromUrl(paras) {
    var curUr = location.href;
    var index = curUr.indexOf(paras) + paras.length + 1;
    var fromUrl = curUr.substring(index);
    return fromUrl;
}