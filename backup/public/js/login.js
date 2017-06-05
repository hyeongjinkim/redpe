		function login_check(){
			var user_id = getCookie("user_id");
			var user_num = getCookie("user_num");
			var user_type = getCookie("user_type");
			var user_name = getCookie("user_name");
			// cookie 값으로 비교 해서 돌린다.
			// 쿠키가 아예 없을때는 그냥 처음으로 돌리고
			if(user_id === "" || user_num === "" || user_type === ""){
				location.href = './login.html';
			}else{ // 쿠키값이 있는경우 해당값이 정상적인 값인지 확인하기위해 서버와 통신
				$.ajax({
					url  :'https://b8ax8j2bn7.execute-api.ap-northeast-2.amazonaws.com/biopama/web/login/check',
				    dataType: "json",
				    type: "GET",
				    cache: true,
				    jsonp: true,
				    jsonpCallback: "",
						data : {
							user_id : user_id,
							user_num : user_num,
							user_type : user_type,
							user_name : user_name
						},
				   success: function(data){
						 data = JSON.parse(data);
						//  console.log(data.result);
						 if(data.result === "1"){
							// 	alert("정상적인 쿠키다");
						 }else{
							// 	alert("정상적인 쿠키가 아님.");
							// deleteCookie(user_id);
							// deleteCookie(user_num);
							// deleteCookie(user_type);
							// deleteCookie(user_name);
							setCookie("user_id", 	'', -10);
							setCookie("user_name",	'', -10);
							setCookie("user_num", 	'', -10);
							setCookie("user_type",	'', -10);
							location.href = './login.html';
						 }
				   },
				   error: function() {
				        alert("실패했다!!!");
				   }
				});
			}
		}

		function logout(){
			setCookie("user_id", 	'', -10);
			setCookie("user_name",	'', -10);
			setCookie("user_num", 	'', -10);
			setCookie("user_type",	'', -10);
			location.href = './login.html';
		}

    function setCookie(cookieName, value, exdays){
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + exdays);
        var cookieValue = escape(value) + ((exdays==null) ? "" : "; expires=" + exdate.toGMTString());
        document.cookie = cookieName + "=" + cookieValue;
    }

    function deleteCookie(cookieName){
        var expireDate = new Date();
        expireDate.setDate(expireDate.getDate() - 1); //어제날짜를 쿠키 소멸날짜로 설정
        document.cookie = cookieName + "= " + "; expires=" + expireDate.toGMTString();
    }

    function getCookie(cookieName) {
        cookieName = cookieName + '=';
        var cookieData = document.cookie;
        var start = cookieData.indexOf(cookieName);
        var cookieValue = '';
        if(start != -1){
            start += cookieName.length;
            var end = cookieData.indexOf(';', start);
            if(end == -1)end = cookieData.length;
            cookieValue = cookieData.substring(start, end);
        }
        return unescape(cookieValue);
    }


    $(document).ready(function() {
        //Id 쿠키 저장
        var userInputId = getCookie("userInputId");
        $("input[name='login_user_id']").val(userInputId);

        if($("input[name='login_user_id']").val() != ""){
            $("#idSaveCheck").attr("checked", true);
            $("#pwdSaveCheck").removeAttr("disabled");
        }

        $("#idSaveCheck").change(function(){
            if($("#idSaveCheck").is(":checked")){
                   //id 저장 클릭시 pwd 저장 체크박스 활성화
                   $("#pwdSaveCheck").removeAttr("disabled");
                   $("#pwdSaveCheck").removeClass('no_act');
                var userInputId = $("input[name='login_user_id']").val();
                setCookie("userInputId", userInputId, 365);
            }else{
                deleteCookie("userInputId");
                $("#pwdSaveCheck").attr("checked", false);
                deleteCookie("userInputPwd");
                $("#pwdSaveCheck").attr("disabled", true);
                $("#pwdSaveCheck").addClass('no_act');
            }
        });


        $("input[name='login_user_id']").keyup(function(){
            if($("#idSaveCheck").is(":checked")){
                var userInputId = $("input[name='login_user_id']").val();
                setCookie("userInputId", userInputId, 365);
            }
        });

        // //Pwd 쿠키 저장
        // var userInputPwd = getCookie("userInputPwd");
        // $("input[name='login_user_password']").val(userInputPwd);

        // if($("input[name='login_user_password']").val() != ""){
        //     $("#pwdSaveCheck").attr("checked", true);
        //     $("#pwdSaveCheck").removeClass('no_act');
        // }

        // $("#pwdSaveCheck").change(function(){
        //     if($("#pwdSaveCheck").is(":checked")){
        //         var userInputPwd = $("input[name='login_user_password']").val();
        //         setCookie("userInputPwd", userInputPwd, 365);
        //     }else{
        //         deleteCookie("userInputPwd");
        //     }
        // });


        // $("input[name='login_user_password']").keyup(function(){
        //     if($("#pwdSaveCheck").is(":checked")){
        //         var userInputPwd = $("input[name='login_user_password']").val();
        //         setCookie("userInputPwd", userInputPwd, 365);
        //     }
        // });
    });
