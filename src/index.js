const express = require ('express');



const app = express();
app.use('/', express.json());

app.get('/', (req, res)=> {
    res.send('Server up and running');
})

app.listen(8080, () => {
    console.log('Project1 listening on http://localhost:8080');
    
});