const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv');
const cors = require('cors');
const Joi = require('joi');

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
    if(req.headers.authorization === 'Bearer admin_token') {
        next();
    } else {
        res.status(403).json({ message: 'No autorizado'});
    }
};

app.put('/api/home/:id', adminAutenticado, async(req, res) => {
    const { id } = req.params;
    const { descripcion, imagenURL } = req. body;

    //Valirdar el id
    const idSchema = Joi.number().integer().positive().required();
    const { error: idError } = idSchema.validate(id);
    if(idError) return res.status(400).json({ message: 'Id invalido'});

    //Validar cuerpo de la solicitus
    const schema = Joi.object({
        descripcion: Joi.string().min(1).required(),
        imagenURL: Joi.string().uri().required()
    });

    const { error } = schema.validate(req.body);
    if(error) return res.status(400).json({ message: 'Datos invalidos', details: error.details});

    try{

        const result = await pool.query('SELECT COUNT(*) FROM home WHERE id = $1', [id]);
        if (parseInt(result.rows[0].count) === 0) {
            return res.status(404).json({ message: 'Registro no encontrado'});
        }

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


app.put('/api/sobreNosotros/:id', adminAutenticado, async(req, res) => {
    const { id } = req.params;
    const { descripcion, imagenURL} = req.body;

    //Valirdar el id
    const idSchema = Joi.number().integer().positive().required();
    const { error: idError } = idSchema.validate(id);
    if(idError) return res.status(400).json({ message: 'Id invalido'});

    //Validar cuerpo de la solicitus
    const schema = Joi.object({
        descripcion: Joi.string().min(1).required(),
        imagenURL: Joi.string().uri().required()
    });

    const { error } = schema.validate(req.body);
    if(error) return res.status(400).json({ message: 'Datos invalidos', details: error.details});

    try{

        const result = await pool.query('SELECT COUNT(*) FROM sobreNosotros WHERE id = $1', [id]);
        if (parseInt(result.rows[0].count) === 0) {
            return res.status(404).json({ message: 'Registro no encontrado'});
        }

        await pool.query(
            'UPDATE sobreNosotros SET descripcion = $1, imagenURL = $2 WHERE id = $3',
            [descripcion, imagenURL, id]
        );
        res.json({message: 'Página Sobre Nosotros actualizada exitosamente'});
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Error al intentar realizar los cambios solicitados'});
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});
