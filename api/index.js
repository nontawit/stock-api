const express = require ('express');
const admin = require ('firebase-admin');
const dotenv = require ('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL
    })
});

const db = admin.firestore();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World');
});

// แสดงข้อมูลของ stock615 ทั้งหมด
app.get('/api/stock615', async (req, res) => {
    try {
        const snapshot = await db.collection('stock615')
        .orderBy('recorded')
        .get();

        const data = snapshot.docs.map(doc => {
            const { recorded, ...rest } = doc.data();
            const recordedDate = recorded.toDate();
            const thaiDate = recordedDate.toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }) 
            const thaiTime = recordedDate.toLocaleTimeString('th-TH', {
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
            });
               
            return {
                id: doc.id,
                ...rest,
                recorded: `${thaiDate} เวลา ${thaiTime}`
            };
        });
        

        res.status(200).json(data);
    } catch (error) {
        console.error('Error getting documents: ', error);
        res.status(500).send('Error getting document');
    }
});

//เพิ่มข้อมูลของ stock615
app.post('/api/stock615', async (req, res) => {
    const { docID, productName, price, quantity, shelfPosition, recorded } = req.body ;
    
    try {

        const recordedDate = new Date();

        const newDocRef = db.collection('stock615').doc(docID);


        await newDocRef.set({
            productName,
            price,
            quantity,
            shelfPosition,
            recorded: admin.firestore.Timestamp.fromDate(recordedDate)
        });

        res.status(201).json({massage: 'Document added successfully'});
    } catch (error) {
        console.error('Error adding documents: ', error);
        res.status(500).send('Error adding document');
    }

});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;