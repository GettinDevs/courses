"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[9940],{9940:function(O,T,E){function I(O){for(var T={},E=O.split(" "),I=0;I<E.length;++I)T[E[I]]=!0;return T}E.r(T),E.d(T,{pig:function(){return C}});var N="ABS ACOS ARITY ASIN ATAN AVG BAGSIZE BINSTORAGE BLOOM BUILDBLOOM CBRT CEIL CONCAT COR COS COSH COUNT COUNT_STAR COV CONSTANTSIZE CUBEDIMENSIONS DIFF DISTINCT DOUBLEABS DOUBLEAVG DOUBLEBASE DOUBLEMAX DOUBLEMIN DOUBLEROUND DOUBLESUM EXP FLOOR FLOATABS FLOATAVG FLOATMAX FLOATMIN FLOATROUND FLOATSUM GENERICINVOKER INDEXOF INTABS INTAVG INTMAX INTMIN INTSUM INVOKEFORDOUBLE INVOKEFORFLOAT INVOKEFORINT INVOKEFORLONG INVOKEFORSTRING INVOKER ISEMPTY JSONLOADER JSONMETADATA JSONSTORAGE LAST_INDEX_OF LCFIRST LOG LOG10 LOWER LONGABS LONGAVG LONGMAX LONGMIN LONGSUM MAX MIN MAPSIZE MONITOREDUDF NONDETERMINISTIC OUTPUTSCHEMA  PIGSTORAGE PIGSTREAMING RANDOM REGEX_EXTRACT REGEX_EXTRACT_ALL REPLACE ROUND SIN SINH SIZE SQRT STRSPLIT SUBSTRING SUM STRINGCONCAT STRINGMAX STRINGMIN STRINGSIZE TAN TANH TOBAG TOKENIZE TOMAP TOP TOTUPLE TRIM TEXTLOADER TUPLESIZE UCFIRST UPPER UTF8STORAGECONVERTER ",e="VOID IMPORT RETURNS DEFINE LOAD FILTER FOREACH ORDER CUBE DISTINCT COGROUP JOIN CROSS UNION SPLIT INTO IF OTHERWISE ALL AS BY USING INNER OUTER ONSCHEMA PARALLEL PARTITION GROUP AND OR NOT GENERATE FLATTEN ASC DESC IS STREAM THROUGH STORE MAPREDUCE SHIP CACHE INPUT OUTPUT STDERROR STDIN STDOUT LIMIT SAMPLE LEFT RIGHT FULL EQ GT LT GTE LTE NEQ MATCHES TRUE FALSE DUMP",A="BOOLEAN INT LONG FLOAT DOUBLE CHARARRAY BYTEARRAY BAG TUPLE MAP ",R=I(N),S=I(e),t=I(A),L=/[*+\-%<>=&?:\/!|]/;function r(O,T,E){return T.tokenize=E,E(O,T)}function n(O,T){for(var E,I=!1;E=O.next();){if("/"==E&&I){T.tokenize=U;break}I="*"==E}return"comment"}function U(O,T){var E,I=O.next();return'"'==I||"'"==I?r(O,T,(E=I,function(O,T){for(var I,N=!1,e=!1;null!=(I=O.next());){if(I==E&&!N){e=!0;break}N=!N&&"\\"==I}return!e&&N||(T.tokenize=U),"error"})):/[\[\]{}\(\),;\.]/.test(I)?null:/\d/.test(I)?(O.eatWhile(/[\w\.]/),"number"):"/"==I?O.eat("*")?r(O,T,n):(O.eatWhile(L),"operator"):"-"==I?O.eat("-")?(O.skipToEnd(),"comment"):(O.eatWhile(L),"operator"):L.test(I)?(O.eatWhile(L),"operator"):(O.eatWhile(/[\w\$_]/),S&&S.propertyIsEnumerable(O.current().toUpperCase())&&!O.eat(")")&&!O.eat(".")?"keyword":R&&R.propertyIsEnumerable(O.current().toUpperCase())?"builtin":t&&t.propertyIsEnumerable(O.current().toUpperCase())?"type":"variable")}var C={name:"pig",startState:function(){return{tokenize:U,startOfLine:!0}},token:function(O,T){return O.eatSpace()?null:T.tokenize(O,T)},languageData:{autocomplete:(N+A+e).split(" ")}}}}]);
//# sourceMappingURL=9940.fbda959e.chunk.js.map