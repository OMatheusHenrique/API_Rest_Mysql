const express = require('express');
const session = require("express-session");
const handlebars = require('express-handlebars');
const path = require('path');
const app = express();
const rota_turma = require('./routes/rota_turma');
const rota_aluno = require('./routes/rota_aluno');
const bodyParser = require("body-parser");
const mysql = require("mysql");

// Configurar a sessão antes de qualquer rota
app.use(session({ secret: "ssshhhhh" }));

// Configurar o mecanismo de visualização Handlebars
app.engine('handlebars', handlebars.create({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Configurar o body-parser para leitura de POST
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Definir a pasta pública para acesso a recursos estáticos
app.use(express.static('public'));

// Conexão com o banco MySQL
function conectiondb() {
    var con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'escola'
    });

    con.connect((err) => {
        if (err) {
            console.log('Erro connecting to database...', err)
            return
        }
        console.log('Connection established!')
    });

    return con;
}

// Rota principal
app.get('/', (req, res) => {
    var message = ' ';
    req.session.destroy();
    res.render('routes/rota_aluno', { message: message });
});

// Remanejar Rotas de Turma
app.use('/rota_turma', rota_turma);

// Remanejar Rotas do Aluno
app.use('/rota_aluno', rota_aluno);

const PORT = 8081;

app.listen(PORT, () => {
    console.log("Servidor Rodando");
});


//criando a sessão
app.use(session({secret: "ssshhhhh"}));

//definindo pasta pública para acesso
app.use(express.static('public'))

//config engines
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/public'));

//config bodyparser para leitura de post
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//conexão com banco mysql
function conectiondb(){
    var con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'escola' 
    });

  
    con.connect((err) => {
        if (err) {
            console.log('Erro connecting to database...', err)
            return
        }
        console.log('Connection established!')
    });

    return con;
}



app.get('/', (req, res) => {
    var message = ' ';
    req.session.destroy();
    res.render('views/registro', { message: message });
});



app.get('/views/registro', (req, res)=>{
    res.redirect('../');

});

app.get("views/routes/rota_aluno", function (req, res){

    if (req.session.user){
        var con = conectiondb();
        var query2 = 'SELECT * FROM users WHERE email LIKE ?';
        con.query(query2, [req.session.user], function (err, results){
            res.render('routes/rota_aluno', { message: results });
            
        });
        
    }else{
        res.redirect("/");
    }
    
});


app.get("/views/login", function(req, res){
    var message = ' ';
    res.render('views/login', {message:message});
});


app.post('/register', function (req, res){

    var username = req.body.nome;
    var pass = req.body.pwd;
    var email = req.body.email;
    var idade = req.body.idade;

    var con = conectiondb();

    var queryConsulta = 'SELECT * FROM users WHERE email LIKE ?';

    con.query(queryConsulta, [email], function (err, results){
        if (results.length > 0){            
            var message = 'E-mail já cadastrado';
            res.render('views/registro', { message: message });
        }else{
            var query = 'INSERT INTO users VALUES (DEFAULT, ?, ?, ?, ?)';

            con.query(query, [username, email, idade, pass], function (err, results){
                if (err){
                    throw err;
                }else{
                    console.log ("Usuario adicionado com email " + email);
                    var message = "ok";
                    res.render('views/registro', { message: message });
                }        
            });
        }
    });
});

//método post do login
app.post('/log', function (req, res){

    var email = req.body.email;
    var pass = req.body.pass;

    var con = conectiondb();

    var query = 'SELECT * FROM users WHERE pass = ? AND email LIKE ?';
    

    con.query(query, [pass, email], function (err, results){
        if (results.length > 0){
            req.session.user = email; //seção de identificação            
            console.log("Login feito com sucesso!");
            res.render('routes/rota_aluno', { message: results });
        }else{
            var message = 'Login incorreto!';
            res.render('views/login', { message: message });
        }
    });
});

app.post('/update', function (req, res){
  
    
    console.log("entrou");
    
    var email = req.body.email;
    var pass = req.body.pwd;
    var username = req.body.nome;
    var idade = req.body.idade;

    var con = conectiondb();

    var query = 'UPDATE users SET username = ?, pass = ?, idade = ? WHERE email LIKE ?';
    

    //execução da query
    con.query(query, [username, pass, idade, req.session.user], function (err, results){
        
        var query2 = 'SELECT * FROM users WHERE email LIKE ?';
        con.query(query2, [req.session.user], function (err, results){
            res.render('views/routes/rota_aluno', {message:results});    
        });
        
    });
});

app.post('/delete', function (req, res){
    //pega os valores digitados pelo usuário
    
    var username = req.body.nome;
    
    //conexão com banco de dados
    var con = conectiondb();
    //query de execução
    var query = 'DELETE FROM users WHERE email LIKE ?';
    

    //execução da query
    con.query(query, [req.session.user], function (err, results){
        res.redirect ('/');
    });
});
