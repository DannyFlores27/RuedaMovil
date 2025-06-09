const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

/*// Registro de usuario
exports.registrar = async (req, res) => {
  const { nombre, correo, password, rol } = req.body; // incluir rol opcional

  try {
    const usuarioExistente = await Usuario.buscarPorCorreo(correo);
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'El correo ya está registrado' });
    }

    const hash = await bcrypt.hash(password, 10);
    const nuevoId = await Usuario.crear(nombre, correo, hash, rol); // pasar rol al modelo

    // Simular verificación automática
    await Usuario.verificar(correo);

    return res.status(201).json({ mensaje: 'Usuario registrado correctamente' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensaje: 'Error en el registro', error });
  }
};*/

// Registro de usuario
exports.registrar = async (req, res) => {
  const { nombre, correo, password, rol } = req.body; // incluir rol opcional

  try {
    const usuarioExistente = await Usuario.buscarPorCorreo(correo);
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'El correo ya está registrado' });
    }

    const hash = await bcrypt.hash(password, 10);
    const { secciones_permitidas } = await Usuario.crear(nombre, correo, hash, rol); // recibir secciones_permitidas

    // Simular verificación automática
    await Usuario.verificar(correo);

    return res.status(201).json({ 
      mensaje: 'Usuario registrado correctamente', 
      nombre, 
      secciones_permitidas 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensaje: 'Error en el registro', error });
  }
};

// Inicio de sesión
exports.login = async (req, res) => {
  const { correo, password } = req.body;

  try {
    const usuario = await Usuario.buscarPorCorreo(correo);
    if (!usuario) {
      return res.status(400).json({ mensaje: 'Correo no encontrado' });
    }

    if (usuario.estado !== 'verificado') {
      return res.status(403).json({ mensaje: 'Cuenta no verificada' });
    }

    const coincide = await bcrypt.compare(password, usuario.contrasenia);
    if (!coincide) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

    // Incluir el rol en el token
    const token = jwt.sign(
      {
        id: usuario.id_usuario,
        correo: usuario.correo,
        rol: usuario.rol
      },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    return res.status(200).json({
      mensaje: 'Inicio de sesión exitoso',
      token,
      usuario: {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
        estado: usuario.estado,
        secciones_permitidas: usuario.secciones_permitidas // Incluir secciones_permitidas en la respuesta
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ mensaje: 'Error al iniciar sesión', error: error.message });
  }
};

// Endpoint perfil
exports.perfil = async (req, res) => {
  try {
    const usuario = await Usuario.buscarPorCorreo(req.usuario.correo);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    return res.status(200).json({
      usuario: {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
        secciones_permitidas: usuario.secciones_permitidas
      }
    });
  } catch (error) {
    console.error('Error en perfil:', error);
    return res.status(500).json({ mensaje: 'Error al obtener perfil', error: error.message });
  }
};
