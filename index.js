const express = require('express');
const nodemailer = require('nodemailer');
const fs = require('fs');
const cors = require('cors'); 
const app = express();

const PORT = 3000;
app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//this method is used to get the data from the mock_data.json file and then use it 
app.get("/filedata", (req, res) => {
    fs.readFile("./MOCK_DATA.json", (err, data) => {
        if (err) {
            res.status(500).send("Internal Server Error");
        } else {
            const mockData = JSON.parse(data);
            res.json(mockData);
        }
    });
});

// using for the signup page
app.post("/signup", (req, res) => {
    const newdata = req.body;
    fs.readFile("./data.json", (err, data) => {
        if (err) {
            let dataArray = [];
            dataArray.push(newdata);
            fs.writeFile("./data.json", JSON.stringify(dataArray), (err) => {
                if (err) {
                    res.send("There is an error in saving the data");
                } else {
                    res.send("Data saved successfully");
                }
            });
        } else {
            let dataArray = JSON.parse(data);
            dataArray.push(newdata);
            fs.writeFile("./data.json", JSON.stringify(dataArray), (err) => {
                if (err) {
                    res.send("There is an error in saving the data");
                } else {
                    res.status(200).send("Data saved successfully");
                }
            });
        }
    });
});

// using for the log in page
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    fs.readFile("./data.json", (err, data) => {
        if (err) {
            res.status(500).send("Internal Server Error");
        } else {
            try {
                const users = JSON.parse(data);
                const user = users.find(user => user.email === email && user.password === password);
                if (user) {
                    res.send("Login successful");
                } else {
                    res.status(401).send("Invalid email or password");
                }
            } catch (error) {
                res.status(500).send("Internal Server Error");
            }
        }
    });
});


//upload of the body content than use to store the values in it 

app.post("/Upload",(req,res)=>{
    const formdata=req.body;
    fs.readFile("../Notenest/src/MOCK_DATA.json",(err,data)=>{
        if(err){
            let arr=[formdata]; 
            fs.writeFile("../Notenest/src/MOCK_DATA.json",JSON.stringify(arr),(err)=>{
                if(err){
                    res.status(500).send("There is an error in writing the file");
                }
                else{
                    res.status(200).send("File is written");
                }
            });
        } else {
            let arr = JSON.parse(data);
            arr.push(formdata);
            fs.writeFile("../Notenest/src/MOCK_DATA.json", JSON.stringify(arr), (err) => {
                if(err){
                    res.status(500).send("There is an error in writing the file");
                }
                else{
                    res.status(200).send("File is written");
                }
            });
        }
    });
});


//try to send the file data using nodemialer
app.post('/sendmail', (req, res) => {
    const { name, email, message } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'abhidigiworld@gmail.com', 
            pass: 'whenrcbwinipl' 
        }
    });

    const mailOptions = {
        from: email,
        to: 'abhidigiworld@gmail.com', 
        subject: 'New message from your website', 
        text: `You have a new message from ${name} (${email}): ${message}` // Plain text body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
            res.status(500).send('Error sending email');
        } else {
            console.log('Email sent:', info.response);
            res.status(200).send('Email sent successfully');
        }
    });
});


app.listen(PORT, () => {
    console.log("server started");
});
