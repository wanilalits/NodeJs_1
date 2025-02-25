//node --watch app.js
//mongodb+srv://lalilswani:<db_password>@cluster0.ygf21f6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
const express = require('express');
const mongoose = require('mongoose');
const MySchema = require("./schema");
var bodyParser = require('body-parser')
const jwt = require('jsonwebtoken');

const app = express();


mongoose.connect("mongodb+srv://lalilswani:KrGXqcaDbahGMmaL@cluster0.ygf21f6.mongodb.net/node?retryWrites=true&w=majority&appName=Cluster0")
.then(() => {console.warn('Connected to MongoDB...')   });

//Insert Data
/* 
const data = new MySchema({
    name: 'Lali',
    addreess: 'Indore',
    email :'sag'
});

data.save().then((result) => {
    console.log(result);
}).catch((err) => {
    console.log(err);
});
*/

// Get Data
const getAllData= ()=>{ MySchema.find().then((data) => {
console.log(data);
 })}
  



//GET API
app.get('/', (req, res) => {
  MySchema.find().then((data) => {
    res.send(data);
  }).catch((err) => {
    res.send(err);
  });
});



var jsonParser = bodyParser.json()
app.use(jsonParser);

//Post API
app.post('/user',jsonParser,(req, res) => {
    const data = new MySchema({
        name: req.body.name,
        address: req.body.address,
        email :req.body.email
    });

    data.save().then((result) => {
        res.send(result);
       // console.log(req.headers);
    }).catch((err) => {
        res.send(err);
    });
  }
  );


//PUT API
app.put('/user/:id', (req, res) => {
  MySchema.findOneAndUpdate({_id: req.params.id}, 
    req.body, {new: true}, (err, data) => {
      if (err) {
          res.send(err);
      } else {
        getAllData()
          res.send(data);
      }
  });
}
);

//delete API
app.delete('/user/:id', (req, res) => {
    MySchema.deleteOne({_id: req.params.id}).then((result) => {
        res.send(result);
        console.log('result');
    }).catch((err) => {
        res.send(err);
    }); 
  }
  );

//all delete API
app.delete('/', (req, res) => {
    MySchema.deleteMany().then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        res.send(err);
    });
  }
  );

 //search API
  app.get('/search/:name', (req, res) => {
    var regx = new RegExp(req.params.name, 'i'); // 'i' makes it case
 MySchema.find({name:regx}).then((data) => {
        res.send(data);
      }).catch((err) => {
        res.send(err);
    }
    )});


//Post API with JWT
app.post('/register',jsonParser,(req, res) => {
  const data = new MySchema({
      name: req.body.name,
      address: req.body.address,
      email :req.body.email,
      password:req.body.password,
      Encryptedpassword:req.body.Encryptedpassword,
  });


  const crypto = require('crypto');
  const algorithm = 'aes-256-cbc';
  const passwordKey = 'my secret key';
  const key = crypto.scryptSync(passwordKey, 'salt', 32);
  const iv = Buffer.alloc(16, 0);
  
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update( data.password , 'utf8', 'hex');
  encrypted += cipher.final('hex');
  console.log(encrypted); // outputs the encrypted data
  
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  data.Encryptedpassword=encrypted;
  console.log(decrypted); // outputs the decrypted data
  

  data.save().then((result) => {
      res.status(201).send(result);
    console.log("data Saved");
  }).catch((err) => {
      res.send(err);
      console.log("data not Saved");
  });
}
);



app.post('/login',jsonParser,(req, res) => { 
 MySchema.findOne({email:req.body.email,password:req.body.password }).then((data) => {
 
  if(data==null){
    res.send("Invalid User");
  }
  else{
   
    //jwt
     const secret='my secret key my secret key my secret key';
     const options = { expiresIn: '10h' };
   // jwt.sign(payload, secret, options);
  const token = jwt.sign({email:req.body.email,password:req.body.password}, secret); 
  
  console.log(token); 
  res.status(201).send(data);
  }
}).catch((err) => {
  res.send(err);
});
}
);


//GET API
app.get('/validuser',varifiToken, (req, res) => {
  MySchema.find().then((data) => {
    res.status(202).json(data);
  }).catch((err) => {
    res.send(err);
  });
});
 

//middleware
function varifiToken (req ,res ,next)
{
const token = req.headers['authorization'];
console.log(token);
if (typeof token !=='undefined') 
{
 // const token1=token.split(".");
  jwt.verify(token,'my secret key my secret key my secret key',(err,authData)=>{
    if(err){
      res.json({result:err});
    }
    else{  
     next();
    };
  })
}
else{
  res.send("not define");
  }
}












app.listen(3000, () => console.log('Server is running...'));
