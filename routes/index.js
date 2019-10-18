var express = require('express');
var router = express.Router();

var books=require('../public/books');
const fs=require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  return res.render('index', { books: books });
  next();
});

router.get('/books',(req,res,next)=>{
  return res.end(JSON.stringify(books));
  next();
});

router.get('/books/:num',(req,res,next)=>{
  let number=req.params.num;
  for(let value of books){
    if(value.id==number) {
      return res.render('book',{book:value});
    }
  }
});

router.put('/books/:num',(req,res)=>{
  for(key in books){
    if(books[key].id==req.params.num){
      let body=req.body;
      if(body.book!=undefined){
        books[key].book=body.book;
        books[key].author=body.author;
        books[key].publication=body.publication;
      }
      else {
        books[key].count=!books[key].count;
      }
      break;
    }
  }
  fs.writeFile('books',JSON.stringify(books),(err)=>{
    if(err) throw err;
  });

  res.end();
});

router.post('/books',(req,res)=>{
  let body=req.body;
  for(value of books){
    if(value.book==body.book){
      res.json({message: "Already count"});
      return
    }
  }
  var newId=books[books.length-1].id+1;
  let date=new Date();
  books.push({
    id: newId,
    book: body.book,
    author: body.author,
    publication: body.publication,
    count: true,
    back_date: `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`
  });

  fs.writeFile('books',JSON.stringify(books),(err)=>{
    if(err) throw err;
  });
  res.send(JSON.stringify(books[books.length-1]));
});

router.delete('/books/:book',(req,res)=>{
  let del_i=books.map((x)=>{return x.book}).indexOf(req.params.book);
  if(del_i===-1){
    res.json({message: "Not found"});
  }else{
    let id=books[del_i].id;
    books.splice(del_i,1);
    fs.writeFile('books',JSON.stringify(books),(err)=>{
      if(err) throw err;
    });
    res.send(JSON.stringify({id: id}));
  }
});

router.get('/books/*',(req,res)=>{
  return res.end(JSON.stringify({error:'No such book'}));
});

module.exports = router;
