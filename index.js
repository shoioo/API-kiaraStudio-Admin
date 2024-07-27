const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: 'http://localhost:5173'
}));

app.use(express.json());

const pool = new Pool({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

const adminAutenticado = (req, res, next) => {
    const isAdmin = true;
    if (isAdmin) {
        next();
    } else {
        res.status(403).json({ message: "No autorizado" });
    }
};

app.put('/api/home', adminAutenticado, async (req, res) => {
    const { descripcion, imagenURL } = req.body;
    try {
        await pool.query(
            'UPDATE home SET descripcion = $1, imagenURL = $2 WHERE id = 1',
            [descripcion, imagenURL]
        );
        res.json({ message: 'home actualizado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al realizar los cambios solicitados' });
    }
});

app.put('/api/home/:id', adminAutenticado, async(req, res) => {
    const { id } = req.params;
    const { descripcion, imagenURL } = req. body;

    try{
        await pool.query(
            'UPDATE home SET descripcion = $1, imagenURL = $2 WHERE id = $3',
            [descripcion, imagenURL, id]
        );

        res.json({ message: 'Home actualizado exitosamente'});
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Error al realizar los cambios solicitados'});
    }
});


app.put('/api/sobreNosotros', adminAutenticado, async (req, res) => {
    const { descripcion, imagenURL } = req.body;
    try {
        await pool.query(
            'UPDATE sobreNosotros SET descripcion = $1, imagenURL = $2 WHERE id = 1',
            [descripcion, imagenURL]
        );
        res.json({ message: 'Página "Sobre Nosotros" actualizada exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al realizar los cambios solicitados en la página Sobre Nosotros' });
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});
