
const express=require("express");
const bodyParser=require("body-parser");
const https=require("https");
const app=express();

app.use(express.static("public"));  //because css files are static so must be refferred in this way
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res)
{
res.sendFile(__dirname+"/signup.html"); //shows the signup page
});


app.post("/",function(req,res) //recieves the post request from the sign up page
{

var email=req.body.email;
var fName=req.body.first;
var lName=req.body.last;
console.log(email,fName,lName);

//to send the data to mail chimp it must be in a definite format
var data={
  members:[
    {
      email_address:email,
      status:"subscribed",
      merge_fields:{
        FNAME:fName,
        LNAME:lName

      }
    }
  ]
};
const json_data=JSON.stringify(data); //because we can not send the data in JSON

const url="https://us18.api.mailchimp.com/3.0/lists/15b70abdc3";

const options={
  method:"POST",
  auth:"arun:b5cbf87f2b26c098af0000e5664de76f-us18"
}

const request=https.request(url,options,function(response)
{
  if(response.statusCode==200)
  {
    res.sendFile(__dirname+"/success.html");
  }
  else
  {
    res.sendFile(__dirname+"/failure.html");
  }
  response.on("data",function(data) //data send back from the mailchimp
{
  console.log(JSON.parse(data));

})
})

request.write(json_data);
request.end();

});

app.post("/failure",function(req,res)
{
  res.redirect("/");
})

app.listen(3000,function()
{
  console.log("Server is running");
});
