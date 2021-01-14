const app = require('./src/app.js');
const port = 3000;
const fileUpload = require('express-fileupload');



// EJS
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
   res.send('<h1>Hello from express</h1>')
})


app.get(`/auth/reset-password/:id`,  (req, res) => res.render('resetPassword'));

app.use(fileUpload({
   createParentPath: true
}));


// Server
app.listen(port, () => {
   console.log(`Listening on: http://localhost:${port}`);
});




