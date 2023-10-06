/*1°) Importações*/
const express = require('express');
const router = express.Router();
//vamos carregar nosso modelo
const Turma = require("../models/Turma");
/*_____________ Rotas da Turma __________________ */
/*2°) Abre e carrega todas informações de turmas no formulário
turma.handlebars */
router.get('/turma', (req, res) => {
Turma.findAll().then((turmas) => {
turmas = turmas.map((turma) => {
return turma.toJSON();
});
res.render("admin/turma/turma", { turmas: turmas });
});
});
/*3°) Abre o Formulário addturma.handlebars */
router.get('/turma/add', (req, res) => {
res.render("admin/turma/addturma");
});

/*4°) Abre e preenche o formulário editturma.handlebars com informações
do id passado */
router.get('/editar_turma/:id', (req, res) => {
Turma.findAll({ where: { 'id_turma': req.params.id } }).then((turmas) => {

turmas = turmas.map((turma) => { return turma.toJSON() });
res.render("admin/turma/editturma", { turmas: turmas });
});
});
/*5°) Recebe as informações do botão que está no addturma.handlebar
e efetua o cadastro no banco de dados, depois ele volta para a listagem
das turmas*/
router.post('/turma/nova', (req, res) => {
Turma.create({
descricao: req.body.descricao
}).then(() => {
res.redirect("/rota_turma/turma");
}).catch((erro) => {
res.send('Houve um erro: ' + erro);
});
});

/*6°) Recebe as informações do botão que está no editturma.handlebar
e efetua a alteração no banco de dados. Volta para listagem das turmas*/
router.post('/turma/editar_turma', (req, res) => {
    Turma.update({
    descricao: req.body.descricao
    },
    {
    where: { id_turma: req.body.id_turma }
    }).then(() => {
    res.redirect("/rota_turma/turma");
    }).catch((erro) => {
    res.send("Este detento não existe " + erro);
    });
    });
    /*7°) No form turma.handlebars que lista as turmas possui um botão para
    deletar
    Ele deleta informação e refaz a lista no turma.handlebars*/
    router.get('/deletar_turma/:id', (req, res) => {
    Turma.destroy({ where: { 'id_turma': req.params.id } }).then(() => {
    res.redirect("/rota_turma/turma");
    }).catch((err) => {
    res.render("Esse detento não existe");
    });
    });
    /*______ Fim das rotas da turma ___________ */
    module.exports = router;