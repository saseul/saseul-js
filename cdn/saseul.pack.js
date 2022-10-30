/*
SASEUL JS
(c) 2016-2022 by ArtiFriends. All rights reserved.
saseul.com
*/
var SASEUL=SASEUL||function(){var s={},c=s.Core={hash:function(algo,string){return CryptoJS[algo](string).toString(CryptoJS.enc.Hex)},time:function(){return parseInt(new Date().getTime()/1000)},utime:function(){return parseInt((new Date().getTime())+'000')},randomHexString:function(n){var h='';for(var i=0;i<n*2;i+=1){var r=Math.floor(Math.random()*16);h+=r.toString(16)}return h},hexToByte:function(o){if(!o){return new Uint8Array()}var a=[];for(var i=0,l=o.length;i<l;i+=2){a.push(parseInt(o.substr(i,2),16))}return new Uint8Array(a)},byteToHex:function(o){if(!o){return ''}var s='';for(var i=0;i<o.length;i+=1){var h=(o[i]&0xff).toString(16);h=(h.length===1)?'0'+h:h;s+=h}return s.toLowerCase()},stringToByte:function(o){var b=new Uint8Array(new ArrayBuffer(o.length));for(var i=0,l=o.length;i<l;i+=1){b[i]=o.charCodeAt(i)}return b},stringToUnicode:function(o){if(!o){return ''}let u='';for(let i=0;i<o.length;i+=1){let c=o[i].charCodeAt(0).toString(16);if(c.length>2){u+='\\u'+c}else{u+=o[i]}}return u}};return s}();
(function(){var s=SASEUL,c=s.Core,f=s.Enc={SHORT_HASH_SIZE:40,ID_HASH_SIZE:44,HASH_SIZE:64,HEX_TIME_SIZE:14,TIME_HASH_SIZE:78,string:function(o){if(typeof o!=='string'){o=JSON.stringify(o)}return c.stringToUnicode(o.replaceAll('/','\\/'))},hash:function(o){return c.hash('SHA256',this.string(o))},shortHash:function(o){return c.hash('RIPEMD160',this.hash(o))},checksum:function(h){return c.hash('SHA256',c.hash('SHA256',h)).substr(0,4)},hextime:function(u){if(typeof u!=='number'){u=c.utime()}u=u.toString(16);if(u.length>this.HEX_TIME_SIZE){return u.substr(0,this.HEX_TIME_SIZE)}return u.toString(16).padStart(this.HEX_TIME_SIZE,'0')},timeHash:function(o,u){return this.hextime(u)+this.hash(o)},timeHashValidity:function(h){return this.isHex(h)===true&&h.length===this.TIME_HASH_SIZE},idHash:function(o){var h=this.shortHash(o);return h+this.checksum(h)},idHashValidity:function(i){return this.isHex(i)===true&&i.length===this.ID_HASH_SIZE&&this.checksum(i.substr(0,this.SHORT_HASH_SIZE))===i.substr(-4)},spaceId:function(w,s){return this.hash([w,s])},txHash:function(t){return this.timeHash(this.hash(t),t.timestamp)},isHex:function(h){if(typeof h!=='string'){return false}return(Boolean(h.match(/^[0-9a-f]+$/)))}}})();
(function(){var s=SASEUL,c=s.Core,e=s.Enc,f=s.Sign={KEY_SIZE:64,SIGNATURE_SIZE:128,keyPair:function(){var p=nacl.sign.keyPair();var k={};k.private_key=c.byteToHex(p.secretKey).substr(0,64);k.public_key=c.byteToHex(p.publicKey);k.address=this.address(k.public_key);return k},privateKey:function(){return c.byteToHex(nacl.sign.keyPair().secretKey).substr(0,64)},publicKey:function(k){return c.byteToHex(nacl.sign.keyPair.fromSeed(c.hexToByte(k)).publicKey)},address:function(k){return e.idHash(k)},addressValidity:function(a){return e.idHashValidity(a)},signature:function(o,k){return c.byteToHex(nacl.sign.detached(c.stringToByte(e.string(o)),c.hexToByte(k+this.publicKey(k))))},signatureValidity:function(o,k,g){return g.length===this.SIGNATURE_SIZE&&e.isHex(g)===true&&nacl.sign.detached.verify(c.stringToByte(o),c.hexToByte(g),c.hexToByte(k))},keyValidity:function(k){return k.length===this.KEY_SIZE&&e.isHex(k)}}})();
(function(){var s=SASEUL,c=s.Core,e=s.Enc,g=s.Sign,f=s.Rpc={default_peers:['main.saseul.net','aroma.saseul.net','blanc.saseul.net'],ping:function(h){if(typeof h!=='object'){h=this.default_peers}return new Promise(function(_r){f._searchPeers(h,function(r){f._queryRounds(r,function(r){_r(r)})})})},searchPeers:function(h){if(typeof h!=='object'){h=this.default_peers}return new Promise(function(_r){f._searchPeers(h,function(r){_r(r)})})},_searchPeers:function(h,b){f.multi(h,'/peer',{method:"POST",mode:"cors"},function(r){var _r=[];r.forEach(function(i){try{Object.values(i.data.peers).forEach(function(j){_r.push(j.host)})}catch(e){}});b([...new Set(_r)])})},queryRounds:function(h){if(typeof h!=='object'){h=this.default_peers}return new Promise(function(_r){f._queryRounds(h,function(r){_r(r)})})},_queryRounds:function(h,b){f.multi(h,'/round?chain_type=all',{method:"POST",mode:"cors"},function(r){var _r=[];r.forEach(function(i){try{_r.push({host:i.host,main:i.data.main.block,resource:i.data.resource.block})}catch(e){}});b(_r)})},transaction:function(v,k){return this.data(v,k)},request:function(v,k){if(typeof k!=="string"){k=g.privateKey()}return this.data(v,k,"request")},data:function(v,k,t="transaction"){var d={};try{v.from=g.address(g.publicKey(k));if(typeof v.timestamp!=='number'){v.timestamp=c.utime()}d[t]=v;d.public_key=g.publicKey(k);d.signature=g.signature(e.txHash(v),k);return d}catch(_e){if(!g.keyValidity(k)){console.error('Invalid private key: '+k);return{}}console.error(_e);return{}}},send:function(o,h){var p,b=new FormData();if(typeof h!=="string"){h='blanc.saseul.net'}if(typeof o.transaction==="object"){b.append("transaction",e.string(o.transaction));p=h+'/sendtransaction'}else{b.append("request",e.string(o.request));p=h+'/request'}b.append("public_key",o.public_key);b.append("signature",o.signature);return new Promise(function(_r){f._send(b,p,function(r){_r(r)})})},_send:function(form_data,url_path,callback){fetch('//'+url_path,{method:"POST",mode:"cors",body:form_data}).then((function(r){return r.json()}),(function(r){return{code:999,msg:r.message}})).then((function(r){callback(r)}))},multi:function(urls,path,option,callback,max_number=9){var _t=[],_n=0,_z=Math.min(urls.length,max_number);urls=this.shuffle(urls);urls.forEach(function(_a,_i){if(_i<_z){fetch('//'+_a+path,option).then((function(r){return r.json()}),(function(r){return{code:999,msg:r.message}})).then((function(r){try{_t.push({host:_a,data:r.data})}catch(e){}if(_n++ ===_z-1){try{callback(_t)}catch(e){}}}))}})},shuffle:function(a){return a.map(v=>({v,i:Math.random()})).sort((x,y)=>x.i-y.i).map(({v})=>v)}}})();