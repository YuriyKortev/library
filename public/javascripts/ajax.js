function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

setInterval(()=>{
    let sbm=document.getElementById("sub");
    let fi=document.getElementById("book").value;
    let si=document.getElementById("author").value;
    let ti=document.getElementById("publication").value;
    (fi==="" || si==="" || ti==="" || !isNumeric(ti))?(sbm.disabled=true):(sbm.disabled=false);
},500);

setInterval(()=>{
    let sbm=document.getElementById("del_sub");
    let si=document.getElementById("del_book").value;
    (si==="")?(sbm.disabled=true):(sbm.disabled=false);
},500);

function loadCount(checkbox){
    var div;

    callAjaxGet((res)=>{
       if(checkbox.checked){
           for(let value of JSON.parse(res)){
               div=document.getElementById(value.id);
               if(!value.count){
                   div.style.opacity=0.2;
               }
           }
       }
       else{
           for(let value of JSON.parse(res)){
               div=document.getElementById(value.id);
               if(!value.count) {
                   div.style.opacity = 1;
               }
           }
       }
    });
}

function loadDate(date) {
    var div;

    callAjaxGet((res)=>{
       for(value of JSON.parse(res)){
           div=document.getElementById(value.id);
           if(value.back_date==date.value)
               div.style.opacity=1;
           else div.style.opacity=0.2;
       }
    });
}

function loadBut(button) {
    var checkbox=document.getElementById("count");
    var div;
    if(checkbox.checked)checkbox.checked=false;
    callAjaxGet((res)=>{
       for(value of JSON.parse(res)){
           div=document.getElementById(value.id);
           div.style.opacity=1;
       }
    });
}

function callAjaxGet(callback){
    var xhttp=new XMLHttpRequest();
    xhttp.onreadystatechange=function () {
        if(this.readyState==4 && this.status==200)
            callback(this.responseText)
    };
    xhttp.open('get','/books',true);
    xhttp.send();
}

addBook.onsubmit=function () {
    var xhr=new XMLHttpRequest();
    xhr.open("POST","/books",true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    xhr.onreadystatechange=function (){
        if(this.status==200 && this.readyState==4){
            let book=JSON.parse(this.responseText);
            if(book.message){
                console.log(book.message);
                return;
            }
            let list=document.getElementById("list");
            let newBook=document.createElement("div");
            newBook.id=book.id;
            newBook.innerHTML=`<p>${book.author}</p><p>"${book.book}"</p><p>${book.publication}</p><a href=/books/${newBook.id}>карточка</a>`;
            //  newBook.style.clear=left;
            list.appendChild(newBook);
        }
    }
    xhr.send(JSON.stringify({book: this.elements.book.value, author: this.elements.author.value, publication: this.elements.publication.value}));

    this.elements.book.value="";
    this.elements.author.value="";
    this.elements.publication.value="";
    return false;
}

delBook.onsubmit=function () {
    let input=this.elements.del_book;
    var xhr=new XMLHttpRequest();
    xhr.open("DELETE","/books/"+this.elements.del_book.value,true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    xhr.onreadystatechange=function(){
      if(this.readyState==4 && this.status==200){
        let id=JSON.parse(this.responseText);
        if(id.message){
            input.value="Такой книги нет";
            return;
        }
        document.getElementById(id.id).remove();
      }
    };
    xhr.send();


    input.value="";

    return false;
}
