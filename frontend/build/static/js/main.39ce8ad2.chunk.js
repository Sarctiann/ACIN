(this.webpackJsonpfrontend=this.webpackJsonpfrontend||[]).push([[0],{93:function(e,t,a){"use strict";a.r(t);var n=a(0),c=a(31),r=a.n(c),s=a(29),i=a(152),l=a(11),o=a(8),j=a(76),b=a(145),u=a(136),d=a(40),O=a(147),x=a(149),h=a(150),m=a(140),p=a(146),g=a(132),f=a(133),v=a(134),y=a(135),C=["/news","/calculator","/answers","/settings"],k=["complete","basic","answers","calculator","regexs"],w=a(37),S=a(52),_=a(138),T=a(130),F=a(141),A=a(1),B=["value","items","setTabValue","icon","label","disabled"],N=function(e){var t=e.value,a=e.items,c=e.setTabValue,r=e.icon,s=e.label,i=e.disabled,j=Object(S.a)(e,B),b=Object(o.h)(),u=Object(n.useState)(null),d=Object(l.a)(u,2),O=d[0],x=d[1],h=Boolean(O);return Object(A.jsxs)(A.Fragment,{children:[Object(A.jsx)(p.a,Object(w.a)(Object(w.a)({label:s},j),{},{icon:r,iconPosition:"start",id:"id_menu","aria-controls":"aria_menu",onClick:function(e){x(e.currentTarget)},"aria-haspopup":"true","aria-expanded":h?"true":void 0,disabled:i})),Object(A.jsx)(_.a,{id:"aria_menu",anchorEl:O,open:h,onClose:function(){x(null)},TransitionComponent:T.a,children:a.map((function(e){return Object(A.jsx)(F.a,{onClick:function(){var a;a=e.sub_route,x(null),b("".concat(t,"/").concat(a)),c(t)},children:e.label},e.label)}))})]})},U=a(148),V=a(143),E=a(144),I=a(131),J=["userName","disabled"];var L=function(e){var t=e.userName,a=e.disabled,c=Object(S.a)(e,J),r=Object(o.g)(),s=Object(o.h)(),i="user"===r.pathname.split("/")[1]?"secondary.main":"primary.main";a&&(i="default");var j,b=Object(n.useState)(null),u=Object(l.a)(b,2),d=u[0],O=u[1],x=Boolean(d);return Object(A.jsxs)(A.Fragment,{children:[Object(A.jsx)(U.a,Object(w.a)(Object(w.a)({variant:"outlined"},c),{},{id:"id_menu","aria-controls":"aria_menu",onClick:function(e){O(e.currentTarget)},"aria-haspopup":"true","aria-expanded":x?"true":void 0,color:"secondary",disabled:a,children:Object(A.jsx)(V.a,{sx:{bgcolor:i},children:(j=t,j.split(" ").map((function(e){return e[0]})).join("").toUpperCase())})})),Object(A.jsxs)(_.a,{id:"aria_menu",anchorEl:d,open:x,onClose:function(){O(null)},TransitionComponent:T.a,children:[Object(A.jsx)(E.a,{variant:"body2",color:"secondary",marginX:2,mb:1,children:t}),Object(A.jsx)(I.a,{}),Object(A.jsx)(F.a,{onClick:function(){O(null),console.log("Give me Options!!!"),s("/user/account")},children:"Options"}),Object(A.jsx)(F.a,{onClick:function(){O(null),console.log("handle Logout!!!"),s("/user/login")},children:"Logout"})]})]})},P=function(e){var t=!1;switch(Object(o.g)().pathname.split("/")[1]){case C[0]:t=C[0];break;case C[1]:t=C[1];break;case C[2]:t=C[2];break;case C[3]:t=C[3];break;default:t=!1}var a=Object(n.useState)(t),c=Object(l.a)(a,2),r=c[0],i=c[1];return Object(A.jsx)(A.Fragment,{children:Object(A.jsx)(x.a,{position:"sticky",children:Object(A.jsxs)(h.a,{sx:{justifyContent:"space-between"},children:[Object(A.jsxs)(m.a,{indicatorColor:"primary",onChange:function(e,t){switch(t){case C[0]:case C[2]:i(t)}},value:r,children:[Object(A.jsx)(p.a,{value:C[0],label:"News",icon:Object(A.jsx)(g.a,{}),iconPosition:"start",component:s.b,to:C[0],disabled:e.disabled}),Object(A.jsx)(N,{value:C[1],label:"Calculator",icon:Object(A.jsx)(f.a,{}),setTabValue:i,items:[{label:"Complete Calculator",sub_route:k[0]},{label:"Basic Calculator",sub_route:k[1]}],disabled:e.disabled}),Object(A.jsx)(p.a,{value:C[2],label:"Answers",icon:Object(A.jsx)(v.a,{}),iconPosition:"start",component:s.b,to:C[2],disabled:e.disabled}),Object(A.jsx)(N,{value:C[3],label:"Settings",icon:Object(A.jsx)(y.a,{}),setTabValue:i,items:[{label:"Answers Settings",sub_route:k[2]},{label:"Calculator Settings",sub_route:k[3]},{label:"Regexs Settings",sub_route:k[4]}],disabled:e.disabled})]}),Object(A.jsx)(L,{userName:"Sebasti\xe1n Atl\xe1ntico",disabled:e.disabled})]})})})},R=a(151),q=function(){return Object(A.jsxs)(R.a,{maxWidth:"lg",children:[Object(A.jsx)(E.a,{variant:"h1",color:"primary",children:"News"}),Object(A.jsx)(E.a,{variant:"h6",color:"dafault",children:"Ideas:"}),Object(A.jsx)("li",{children:" personal remainders "}),Object(A.jsx)("li",{children:" global news "})]})},G=function(){return Object(A.jsxs)(A.Fragment,{children:[Object(A.jsx)(E.a,{variant:"h6",color:"secondary",children:"Calculator"}),Object(A.jsx)(o.b,{})]})},W=function(){return Object(A.jsx)(E.a,{variant:"h1",color:"primary",children:"Complete Calculator"})},X=function(){return Object(A.jsx)(E.a,{variant:"h1",color:"primary",children:"Basic Calculator"})},z=function(){return Object(A.jsx)(E.a,{variant:"h1",color:"primary",children:"Answers"})},D=function(){return Object(A.jsxs)(A.Fragment,{children:[Object(A.jsx)(E.a,{variant:"h6",color:"secondary",children:"Settings"}),Object(A.jsx)(o.b,{})]})},H=function(){return Object(A.jsx)(E.a,{variant:"h1",color:"primary",children:"Answers Settings"})},K=function(){return Object(A.jsx)(E.a,{variant:"h1",color:"primary",children:"Calculator Settings"})},M=function(){return Object(A.jsx)(E.a,{variant:"h1",color:"primary",children:"Regexs Settings"})},Q=function(){return Object(A.jsxs)(A.Fragment,{children:[Object(A.jsx)(E.a,{variant:"h6",color:"secondary",children:"User"}),Object(A.jsx)(o.b,{})]})},Y=function(){return Object(A.jsx)(E.a,{variant:"h1",color:"primary",children:"User Login"})},Z=function(){return Object(A.jsx)(E.a,{variant:"h1",color:"primary",children:"User Account"})},$=function(){var e=Object(n.useState)("getToken()"),t=Object(l.a)(e,2),a=t[0],c=t[1];return[a,function(e){localStorage.setItem("token",JSON.stringify(e)),c(e.token)}]},ee=Object(j.a)({palette:{mode:"dark",primary:u.a,secondary:d.a}}),te=function(){var e=$(),t=Object(l.a)(e,2),a=t[0],n=t[1],c=!Boolean(a);return Object(A.jsx)(b.a,{theme:ee,children:Object(A.jsxs)(O.a,{sx:{height:"100vh"},square:!0,children:[Object(A.jsx)(P,{disabled:c}),a&&Object(A.jsxs)(o.e,{children:[Object(A.jsx)(o.c,{path:"/",element:Object(A.jsx)(o.a,{to:C[0]})}),Object(A.jsx)(o.c,{path:C[0],element:Object(A.jsx)(q,{})}),Object(A.jsxs)(o.c,{path:C[1],element:Object(A.jsx)(G,{}),children:[Object(A.jsx)(o.c,{path:k[0],element:Object(A.jsx)(W,{})}),Object(A.jsx)(o.c,{path:k[1],element:Object(A.jsx)(X,{})})]}),Object(A.jsx)(o.c,{path:C[2],element:Object(A.jsx)(z,{})}),Object(A.jsxs)(o.c,{path:C[3],element:Object(A.jsx)(D,{}),children:[Object(A.jsx)(o.c,{path:k[2],element:Object(A.jsx)(H,{})}),Object(A.jsx)(o.c,{path:k[3],element:Object(A.jsx)(K,{})}),Object(A.jsx)(o.c,{path:k[4],element:Object(A.jsx)(M,{})})]}),Object(A.jsxs)(o.c,{path:"/user",element:Object(A.jsx)(Q,{}),children:[Object(A.jsx)(o.c,{path:"login",element:Object(A.jsx)(Y,{setToken:n})}),Object(A.jsx)(o.c,{path:"account",element:Object(A.jsx)(Z,{})})]})]})||Object(A.jsx)(Y,{setToken:n})]})})};r.a.render(Object(A.jsxs)(A.Fragment,{children:[Object(A.jsx)(i.a,{}),Object(A.jsx)(s.a,{children:Object(A.jsx)(te,{})})]}),document.getElementById("root"))}},[[93,1,2]]]);
//# sourceMappingURL=main.39ce8ad2.chunk.js.map