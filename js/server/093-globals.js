var UA, isPDF, userName, userType;

UA = K("request.http_user_agent");
isPDF = (UA.indexOf("Gecko/ /2.0.1") > -1) || (K("ddk.pdf") === "true");
userType = K("sec.usertype");
userName = K("sec.username");