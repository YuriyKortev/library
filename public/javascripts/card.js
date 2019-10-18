function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

setInterval(()=>{
    let sbm=document.getElementById("sub");
    let fi=document.getElementById("book").value;
    let si=document.getElementById("author").value;
    let ti=document.getElementById("publication").value;
    let book=document.getElementsByName("book")[0];

    (fi==="" || si==="" || ti==="" || !isNumeric(ti) || (('"'+fi+'"')===book.children[1].innerText && si===book.children[0].innerText && ti===book.children[2].innerText))?(sbm.disabled=true):(sbm.disabled=false);
},500);

changeBook.onsubmit=function () {
    let book=document.getElementsByName("book")[0];
    var xhr=new XMLHttpRequest();
    xhr.open("PUT","/books/"+book.id,true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    xhr.send(JSON.stringify({book: this.elements.book.value, author: this.elements.author.value, publication: this.elements.publication.value}));
    book.children[0].innerText=this.elements.author.value;
    book.children[1].innerText='"'+this.elements.book.value+'"';
    book.children[2].innerText=this.elements.publication.value;
    return false;
}

function take(button){
    let book=document.getElementsByName("book")[0];
    var xhr=new XMLHttpRequest();
    xhr.open("PUT","/books/"+book.id,true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    xhr.send();

    location.reload();
}
