/*1°) Importações*/
const express = require('express');
const router = express.Router();
//vamos carregar nosso modelo
const Turma = require("../models/Turma");
const Aluno = require("../models/Aluno");
//_____________ Rotas dos Alunos __________________
/*2°) Abre e carrega todas informações do aluno no formulário
aluno.handlebars */
router.get('/aluno', (req, res) => {
Aluno.sequelize.query("select * from selecAluno",
{ model: Aluno }).then(function (alunos) {
var nalunos = JSON.parse(JSON.stringify(alunos));
res.render("admin/aluno/aluno",
{ alunos: nalunos });
});
});
/* 3°) Abre o Formulário addaluno.handlebars */
router.get('/aluno/add', (req, res) => {
//pega as turmas cadastradas para popular o select do html
Turma.findAll().then((turmas) => {
var nturmas = JSON.parse(JSON.stringify(turmas));
res.render("admin/aluno/addaluno", { turmas: nturmas});
});
});
/* 4°) Abre e preenche o formulário editaluno.handlebars com informações
do id passado */
router.get('/editar_aluno/:id', (req, res) => {
Aluno.findAll({ where: { 'id_aluno': req.params.id } }).then((alunos) => {
//pega as turmas cadastradas para popular o select do html
Turma.findAll().then((turmas) => {
var nturmas = JSON.parse(JSON.stringify(turmas));
var nalunos = JSON.parse(JSON.stringify(alunos));
res.render("admin/aluno/editaluno", { alunos: nalunos,
turmas: nturmas });
});
});
});


router.get('/aluno/tempo_matricula/:id', (req, res) => {
    const id_aluno = req.params.id; // Pega o ID do aluno da URL

    // Renderiza a página Handlebars para o cadastro de tempo de matrícula e passa o ID do aluno
    res.render("admin/aluno/tempo_matricula", { id_aluno });
});

router.post('/aluno/tempo_matricula', (req, res) => {
    const id_aluno = req.body.id_aluno; // ID do aluno
    const tempo_matricula = req.body.tempo_matricula; // Tempo de matrícula

   
    Tempo.create({
        dias: tempo_matricula
    })
    .then(() => {
       
        res.redirect("/rota_aluno/aluno");
    })
    .catch((erro) => {
     
        res.send('Houve um erro: ' + erro);
    });
});
/* 5°) Recebe as informações do botão que está no addaluno.handlebar
e efetua o cadastro no banco de dados, depois ele volta para a listagem
dos alunos */
router.post('/aluno/nova', (req, res) => {
    Aluno.create({
        matricula: req.body.matricula,
        nome: req.body.nome,
        fk_turma: req.body.fk_turma
        }).then(() => {
        res.redirect("/rota_aluno/aluno");
        }).catch((erro) => {
        res.send('Houve um erro: ' + erro);
        });
        });
        /* 6°) Recebe as informações do botão que está no editaluno.handlebar
        e efetua a alteração no banco de dados. Volta para listagem de alunos */
        router.post('/aluno/editar_aluno', (req, res) => {
        Aluno.update({
        matricula: req.body.matricula,
        nome: req.body.nome,
        fk_turma: req.body.fk_turma
        },
        {
        where: { id_aluno: req.body.id_aluno }
        }).then(() => {
        res.redirect("/rota_aluno/aluno");
        }).catch((erro) => {
        res.send("Este detento não existe " + erro);
        });
        });
        /* 7°) No form aluno.handlebars que lista os alunos possui um botão para
        deletar
        Ele deleta informação e refaz a lista no aluno.handlebars */
        router.get('/deletar_aluno/:id', (req, res) => {
        Aluno.destroy({ where: { 'id_aluno': req.params.id } }).then(() => {
        res.redirect("/rota_aluno/aluno");
        }).catch((err) => {
        res.render("Esse detento não existe");
        });
        });
        /*______ Fim das rotas do aluno ___________*/
        module.exports = router;