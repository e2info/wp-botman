
jQuery(document).ready(function() {
	//alert(bm_script_vars.base_url);
	/*
	 * When the user enters text in the text input text field and then the presses Enter key
	 */
    //$('.wpbotmanform').submit(function(e) {
    jQuery("input#bm-text").keypress(function(event) {
        if (event.which == 13) {
            event.preventDefault();
            jQuery("#bm-conversation-area .bm-conversation-request").removeClass("bm-is-active");
            var text = jQuery("input#bm-text").val();
            var date = new Date();
            var innerHTML = "<div class=\"bm-conversation-bubble-container bm-conversation-bubble-container-request\"><div class=\"bm-conversation-bubble bm-conversation-request bm-is-active\">" + text + "</div>";
            if (bm_script_vars.show_time) {
                innerHTML += "<div class=\"bm-datetime\">" + date.toLocaleTimeString() + "</div>";
            }
            innerHTML += "</div>";
            if (bm_script_vars.show_loading) {
                innerHTML += "<div class=\"bm-loading\"><i class=\"bm-icon-loading-dot\" /><i class=\"bm-icon-loading-dot\" /><i class=\"bm-icon-loading-dot\" /></div>";
            }
            jQuery("#bm-conversation-area").append(innerHTML);
            jQuery("input#bm-text").val("");
            jQuery("#bm-conversation-area").scrollTop(jQuery("#bm-conversation-area").prop("scrollHeight"));
            textQuery(text);


        }

    });



	/* Overlay slide toggle */
	jQuery(".bm-content-overlay .bm-content-overlay-header").click(function(event){

		if (jQuery(this).find(".bm-icon-toggle-up").css("display") !== "none") {
			jQuery(this).find(".bm-icon-toggle-up").hide();
			jQuery(this).parent().removeClass("myc-toggle-closed");
			jQuery(this).parent().addClass("myc-toggle-open");
			jQuery(this).find(".bm-icon-toggle-down").show();
			jQuery(this).siblings(".bm-content-overlay-container, .bm-content-overlay-powered-by").slideToggle("slow", function() {});
		} else {
			jQuery(this).find(".bm-icon-toggle-down").hide();
			jQuery(this).parent().removeClass("myc-toggle-open");
			jQuery(this).parent().addClass("myc-toggle-closed");
			jQuery(this).find(".bm-icon-toggle-up").show();
			jQuery(this).siblings(".bm-content-overlay-container, .bm-content-overlay-powered-by").slideToggle("slow", function() {});
		}
	});

});

function getCookie(name)
{
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}


/**
 * Send Dialogflow query
 *
 * @param text
 * @returns
 */
function textQuery(text) {
    if(document.cookie.indexOf('userid=')>0){
        //alert(1);
        var userid = getCookie("userid");

        if(!userid){
            var d = new Date();
            var userLang = navigator.language || navigator.userLanguage;
            userid=Math.floor(1000*Math.random()) + d.getTime() +  '.' + d.getTimezoneOffset() + '.' + userLang;
            //setcookie('userid',userid,3600,'/');
            document.cookie="userid="+userid;
        }
    }else{
        var d = new Date();
        var userLang = navigator.language || navigator.userLanguage;
        userid=Math.floor(1000*Math.random()) + d.getTime() +  '.' + d.getTimezoneOffset() + '.' + userLang;
        document.cookie="userid="+userid;
    }

    jQuery.ajax({
        type:"GET",
        url:bm_script_vars.base_url,
		//url:"https://e2bot.localhost.com/wpbot",
        data:{
            driver: "web",
            userId:userid ,
            message: text
        },
        dataType:"jsonp",
        jsonp:"callback",
        jsonpCallback:"success_jsonpCallback",
        success : function(response) {
            for(var i=0,len=response.messages.length; i<len; i++) {
                var date = new Date();
                var innerHTML = "<div class=\"bm-conversation-bubble-container bm-conversation-bubble-container-response\"><div class=\"bm-conversation-bubble bm-conversation-response bm-is-active \">" + response.messages[i].text + "</div>";
                if (bm_script_vars.show_time) {
                    innerHTML += "<div class=\"bm-datetime\">" + date.toLocaleTimeString() + "</div>";
                }
                innerHTML += "</div>";
                jQuery("#bm-conversation-area").append(innerHTML);

            }},
        /*error : function(response) {
            if (bm_script_vars.show_loading) {
                jQuery(".bm-loading").empty();
            }
            textResponse(bm_script_vars.messages.internal_error);
            jQuery("#bm-conversation-area").scrollTop(jQuery("#bm-conversation-area").prop("scrollHeight"));
        }*/
    });



}

