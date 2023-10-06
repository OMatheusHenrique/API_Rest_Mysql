create database escola;


use escola;

CREATE TABLE turma (
    id_turma INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    descricao VARCHAR(50),
    createdAt DATETIME,
    updatedAt DATETIME
);

CREATE TABLE tempo (
    id_tempo INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    dias NVARCHAR(50)
);

CREATE TABLE aluno (
    id_aluno INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    matricula INTEGER,
    nome VARCHAR(100),
    fk_turma INT,
    createdAt DATETIME,
    updatedAt DATETIME,
    INDEX aluno_FKIndex1 (fk_turma),
    FOREIGN KEY (fk_turma)
        REFERENCES turma (id_turma)
        ON DELETE NO ACTION ON UPDATE NO ACTION
);
insert into turma values(default, "Assalto à mão armada", now(), now());
insert into turma values(default, "Lavagem de Dinheiro",now(), now());


select * from turma;


SELECT 
    *
FROM
    aluno;
SELECT 
    a.id_aluno AS id_aluno,
    a.matricula AS matricula,
    a.nome AS nome,
    t.descricao
FROM
    aluno AS a
        INNER JOIN
    turma AS t ON a.fk_turma = t.id_turma;
CREATE VIEW selecAluno AS
    SELECT 
        a.id_aluno AS id_aluno,
        a.matricula AS matricula,
        a.nome AS nome,
        t.descricao
    FROM
        aluno AS a
            INNER JOIN
        turma AS t ON a.fk_turma = t.id_turma;
select * from selecAluno;