const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint para obter postagens
app.get('/api/posts/:categoria', (req, res) => {
    const categoria = req.params.categoria;
    fs.readFile('posts.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Erro ao ler posts');
        }
        const posts = JSON.parse(data);
        res.json(posts[categoria] || []);
    });
});

// Endpoint para criar nova postagem
app.post('/api/posts/:categoria', (req, res) => {
    const categoria = req.params.categoria;
    const novoPost = req.body;
    fs.readFile('posts.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Erro ao ler posts');
        }
        const posts = JSON.parse(data);
        if (!posts[categoria]) {
            posts[categoria] = [];
        }
        posts[categoria].push(novoPost);
        fs.writeFile('posts.json', JSON.stringify(posts, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Erro ao salvar post');
            }
            res.status(201).json(novoPost);
        });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
