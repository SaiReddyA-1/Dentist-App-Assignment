const express = require('express');
const bcrypt = require("bcrypt");
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require("firebase-admin");
const fileUpload = require('express-fileupload');
const { initializeApp } = require('firebase-admin/app');
var moment = require('moment'); 
moment().format(); 
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const serviceAccount = require("./doctors-webportal-firebase-adminsdk-v61yk-ac31c47541.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://doctors-webportal.firebaseio.com'
});

const uri = process.env.MONGO_URI;

const app = express()

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('doctors'));
app.use(fileUpload());

const port = 5000;

app.get('/', (req, res) => {
    res.send("hello from db it's working working")
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log("database connected successfully")
    const appointmentCollection = client.db("doctors-portal").collection("appointments");
    const doctorCollection = client.db("doctors-portal").collection("doctors");
    const adminCollection = client.db("doctors-portal").collection("admin");

    app.post('/addAppointment', (req, res) => {

        const bearer = req.headers.authorization;
        if (bearer && bearer.startsWith('Bearer')) {
          const idToken = bearer.split(' ')[1];
          // console.log({ idToken });
    
            admin.auth()
            .verifyIdToken(idToken)
            .then( (decodedToken) => {
              let uid = decodedToken.uid;
              const tokenEmail = decodedToken.email;
              const userEmail = req.body.userEmail;
              // console.log (tokenEmail, userEmail)
    
              if (tokenEmail == userEmail) {
                    const appointment = req.body;
                    // console.log(appointment);
                    appointmentCollection.insertOne(appointment)
                    .then(result => {
                        res.send(result.insertedCount > 0) })
              } else {
                     res.status(401).send('Un-authorized access.');
              }
              // console.log({ uid });
            })
            .catch( (error) => {
              res.status(401).send('Un-authorized access.');
            });
        } else {
          res.status(401).send('Un-authorized access.');
        }
      });

    app.get('/appointments', (req, res) => {
        appointmentCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

  

    app.post('/appointmentsByDate', (req, res) => {
        
        const date = req.body.date;
        // console.log(date)
        // console.log(moment(date).add(1, 'days'))
        const d = moment(date).utc().add(1, 'days').format('DD/MM/YYYY'); 
        
      
        
      
                appointmentCollection.find({date: date})
                    .toArray((err, documents) => {
                        // console.log(documents)
                       
                        res.send(documents);
                    })
            })

     app.post('/addDoctor', (req, res) => {
                // const file = req.files.file;
                const serialNo = {};
                const name = req.body.name;
                const email = req.body.email;
                const expertiseArea = req.body.expertiseArea;
                const qualifications = req.body.qualifications;
                const phone = req.body.phone;
                const maxSerialNo = req.body.maxSerialNo;
                const chamberDays = req.body.chamberDays;
                const createdAt = req.body.created;

               chamberDays.forEach(day => {
                    serialNo[day] = maxSerialNo;
               })
                // const newImg = file.data;
                // const encImg = newImg.toString('base64');
        
                // var image = {
                //     contentType: file.mimetype,
                //     size: file.size,
                //     img: Buffer.from(encImg, 'base64')
                // };
        
                doctorCollection.insertOne({ name, email, expertiseArea, qualifications, phone, maxSerialNo, serialNo, chamberDays, createdAt })
                    .then(result => {
                        res.send(result);
                    })
            })

            app.put('/updateSerialNo', (req, res) => {
                
                const name = req.body.name;
                const selectedDate = (req.body.selectedDate).toLowerCase();
                const maxSerialNo = req.body.maxSerialNo;
                const serialNo = req.body.serialNo;
                const value =((serialNo[selectedDate])-1).toString();
              
                // console.log(selectedDate)
                // console.log(((serialNo[selectedDate])-1).toString())

                
                        
                        doctorCollection.updateOne(
                            {name:name},
                             {$set: {
                                [`serialNo.${selectedDate}`] : `${value}`
                             }
                                
                             })
                    .then(result => {
                        res.send(result);
                    })
            })

            app.get('/doctors', (req, res) => {
                doctorCollection.find({})
                    .toArray((err, documents) => {
                        res.send(documents);
                    })
            });


                app.post("/adminLogin", async (req, res) => {
                    const body = req.body;
                    const user = await adminCollection.findOne({ email: body.email });
                    // console.log(user)
                    if (user) {
                      // check user password with hashed password stored in the database
                      const validPassword = await bcrypt.compare(body.password, user.password);
                      // console.log(body.password)
                      // console.log(validPassword);
                      validPassword ? 
                        (
                          // console.log(validPassword),
                        res.status(200).json({name: user.name, email: user.email})
                        // // res.send(user),
                        // console.log(user)
                        
                        )
                      
                       
                       : res.status(400).json({ error: "Invalid Password" });
                      
                    } 
                    else {
                       
                      res.status(401).json({ error: "User does not exist" });
                    }
                  });

                


              
  
            })


    // app.post('/isDoctor', (req, res) => {
    //     const email = req.body.email;
    //     doctorCollection.find({ email: email })
    //         .toArray((err, doctors) => {
    //             res.send(doctors.length > 0);
    //         })
    // })

;


app.listen(process.env.PORT || port , () => {
    console.log('listening on port')
})