"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[8377],{8377:function(e,t,r){function n(e,t,r){return t(r),r(e,t)}r.r(t),r.d(t,{haskell:function(){return F}});var a=/[a-z_]/,i=/[A-Z]/,o=/\d/,l=/[0-9A-Fa-f]/,u=/[0-7]/,s=/[a-z_A-Z0-9'\xa1-\uffff]/,f=/[-!#$%&*+.\/<=>?@\\^|~:]/,c=/[(),;[\]`{}]/,d=/[ \t\v\f]/;function m(e,t){if(e.eatWhile(d))return null;var r=e.next();if(c.test(r)){if("{"==r&&e.eat("-")){var m="comment";return e.eat("#")&&(m="meta"),n(e,t,h(m,1))}return null}if("'"==r)return e.eat("\\"),e.next(),e.eat("'")?"string":"error";if('"'==r)return n(e,t,p);if(i.test(r))return e.eatWhile(s),e.eat(".")?"qualifier":"type";if(a.test(r))return e.eatWhile(s),"variable";if(o.test(r)){if("0"==r){if(e.eat(/[xX]/))return e.eatWhile(l),"integer";if(e.eat(/[oO]/))return e.eatWhile(u),"number"}e.eatWhile(o);m="number";return e.match(/^\.\d+/)&&(m="number"),e.eat(/[eE]/)&&(m="number",e.eat(/[-+]/),e.eatWhile(o)),m}return"."==r&&e.eat(".")?"keyword":f.test(r)?"-"==r&&e.eat(/-/)&&(e.eatWhile(/-/),!e.eat(f))?(e.skipToEnd(),"comment"):(e.eatWhile(f),"variable"):"error"}function h(e,t){return 0==t?m:function(r,n){for(var a=t;!r.eol();){var i=r.next();if("{"==i&&r.eat("-"))++a;else if("-"==i&&r.eat("}")&&0==--a)return n(m),e}return n(h(e,a)),e}}function p(e,t){for(;!e.eol();){var r=e.next();if('"'==r)return t(m),"string";if("\\"==r){if(e.eol()||e.eat(d))return t(g),"string";e.eat("&")||e.next()}}return t(m),"error"}function g(e,t){return e.eat("\\")?n(e,t,p):(e.next(),t(m),"error")}var w=function(){var e={};function t(t){return function(){for(var r=0;r<arguments.length;r++)e[arguments[r]]=t}}return t("keyword")("case","class","data","default","deriving","do","else","foreign","if","import","in","infix","infixl","infixr","instance","let","module","newtype","of","then","type","where","_"),t("keyword")("..",":","::","=","\\","<-","->","@","~","=>"),t("builtin")("!!","$!","$","&&","+","++","-",".","/","/=","<","<*","<=","<$>","<*>","=<<","==",">",">=",">>",">>=","^","^^","||","*","*>","**"),t("builtin")("Applicative","Bool","Bounded","Char","Double","EQ","Either","Enum","Eq","False","FilePath","Float","Floating","Fractional","Functor","GT","IO","IOError","Int","Integer","Integral","Just","LT","Left","Maybe","Monad","Nothing","Num","Ord","Ordering","Rational","Read","ReadS","Real","RealFloat","RealFrac","Right","Show","ShowS","String","True"),t("builtin")("abs","acos","acosh","all","and","any","appendFile","asTypeOf","asin","asinh","atan","atan2","atanh","break","catch","ceiling","compare","concat","concatMap","const","cos","cosh","curry","cycle","decodeFloat","div","divMod","drop","dropWhile","either","elem","encodeFloat","enumFrom","enumFromThen","enumFromThenTo","enumFromTo","error","even","exp","exponent","fail","filter","flip","floatDigits","floatRadix","floatRange","floor","fmap","foldl","foldl1","foldr","foldr1","fromEnum","fromInteger","fromIntegral","fromRational","fst","gcd","getChar","getContents","getLine","head","id","init","interact","ioError","isDenormalized","isIEEE","isInfinite","isNaN","isNegativeZero","iterate","last","lcm","length","lex","lines","log","logBase","lookup","map","mapM","mapM_","max","maxBound","maximum","maybe","min","minBound","minimum","mod","negate","not","notElem","null","odd","or","otherwise","pi","pred","print","product","properFraction","pure","putChar","putStr","putStrLn","quot","quotRem","read","readFile","readIO","readList","readLn","readParen","reads","readsPrec","realToFrac","recip","rem","repeat","replicate","return","reverse","round","scaleFloat","scanl","scanl1","scanr","scanr1","seq","sequence","sequence_","show","showChar","showList","showParen","showString","shows","showsPrec","significand","signum","sin","sinh","snd","span","splitAt","sqrt","subtract","succ","sum","tail","take","takeWhile","tan","tanh","toEnum","toInteger","toRational","truncate","uncurry","undefined","unlines","until","unwords","unzip","unzip3","userError","words","writeFile","zip","zip3","zipWith","zipWith3"),e}(),F={name:"haskell",startState:function(){return{f:m}},copyState:function(e){return{f:e.f}},token:function(e,t){var r=t.f(e,(function(e){t.f=e})),n=e.current();return w.hasOwnProperty(n)?w[n]:r},languageData:{commentTokens:{line:"--",block:{open:"{-",close:"-}"}}}}}}]);
//# sourceMappingURL=8377.23d91ed1.chunk.js.map