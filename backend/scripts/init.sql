CREATE DATABASE IF NOT EXISTS dev_db;
USE dev_db;

-- ruedamovil.bicicleta definition

CREATE TABLE IF NOT EXISTS `bicicleta` (
  `id_bicicleta` int NOT NULL AUTO_INCREMENT,
  `modelo` varchar(100) DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL,
  `ubicacion_actual` varchar(255) DEFAULT NULL,
  `fecha_ultimo_mantenimiento` datetime DEFAULT NULL,
  PRIMARY KEY (`id_bicicleta`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- ruedamovil.rol definition

CREATE TABLE IF NOT EXISTS `rol` (
  `id_rol` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `descripcion` text,
  `secciones_permitidas` text,
  PRIMARY KEY (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- ruedamovil.terminal definition

CREATE TABLE IF NOT EXISTS `terminal` (
  `id_terminal` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `ubicacion` varchar(255) DEFAULT NULL,
  `capacidad_maxima` int DEFAULT NULL,
  `espacios_disponibles` int DEFAULT NULL,
  `estado` varchar(20) DEFAULT 'activa',
  PRIMARY KEY (`id_terminal`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- ruedamovil.usuario definition

CREATE TABLE IF NOT EXISTS `usuario` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `correo` varchar(255) DEFAULT NULL,
  `contrasenia` varchar(255) DEFAULT NULL,
  `fecha_registro` datetime DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL,
  `rol` varchar(20) DEFAULT 'usuario',
  PRIMARY KEY (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- ruedamovil.auditoria definition

CREATE TABLE IF NOT EXISTS `auditoria` (
  `id_auditoria` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int DEFAULT NULL,
  `accion` text,
  `fecha_auditoria` datetime DEFAULT NULL,
  `detalles` text,
  PRIMARY KEY (`id_auditoria`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `auditoria_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- ruedamovil.mantenimiento definition

CREATE TABLE IF NOT EXISTS `mantenimiento` (
  `id_mantenimiento` int NOT NULL AUTO_INCREMENT,
  `id_bicicleta` int DEFAULT NULL,
  `id_usuario` int DEFAULT NULL,
  `fecha_inicio` datetime DEFAULT NULL,
  `fecha_fin` datetime DEFAULT NULL,
  `descripcion` text,
  `estado` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_mantenimiento`),
  KEY `id_bicicleta` (`id_bicicleta`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `mantenimiento_ibfk_1` FOREIGN KEY (`id_bicicleta`) REFERENCES `bicicleta` (`id_bicicleta`),
  CONSTRAINT `mantenimiento_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- ruedamovil.penalizacion definition

CREATE TABLE IF NOT EXISTS `penalizacion` (
  `id_penalizacion` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int DEFAULT NULL,
  `cantidad_faltas` int DEFAULT NULL,
  `fecha_ultima_falta` datetime DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_penalizacion`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `penalizacion_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- ruedamovil.prestamo definition

CREATE TABLE IF NOT EXISTS `prestamo` (
  `id_prestamo` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int DEFAULT NULL,
  `id_bicicleta` int DEFAULT NULL,
  `id_terminal_origen` int DEFAULT NULL,
  `id_terminal_destino` int DEFAULT NULL,
  `id_terminal_destino_modificado` int DEFAULT NULL,
  `fecha_inicio` datetime DEFAULT NULL,
  `fecha_fin` datetime DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL,
  `codigo_desbloqueo` varchar(100) DEFAULT NULL,
  `estado_modificacion` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id_prestamo`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_bicicleta` (`id_bicicleta`),
  KEY `id_terminal_origen` (`id_terminal_origen`),
  KEY `id_terminal_destino` (`id_terminal_destino`),
  KEY `id_terminal_destino_modificado` (`id_terminal_destino_modificado`),
  CONSTRAINT `prestamo_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`),
  CONSTRAINT `prestamo_ibfk_2` FOREIGN KEY (`id_bicicleta`) REFERENCES `bicicleta` (`id_bicicleta`),
  CONSTRAINT `prestamo_ibfk_3` FOREIGN KEY (`id_terminal_origen`) REFERENCES `terminal` (`id_terminal`),
  CONSTRAINT `prestamo_ibfk_4` FOREIGN KEY (`id_terminal_destino`) REFERENCES `terminal` (`id_terminal`),
  CONSTRAINT `prestamo_ibfk_5` FOREIGN KEY (`id_terminal_destino_modificado`) REFERENCES `terminal` (`id_terminal`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- ruedamovil.reporte definition

CREATE TABLE IF NOT EXISTS `reporte` (
  `id_reporte` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int DEFAULT NULL,
  `id_bicicleta` int DEFAULT NULL,
  `descripcion` text,
  `fecha_reporte` datetime DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_reporte`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_bicicleta` (`id_bicicleta`),
  CONSTRAINT `reporte_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`),
  CONSTRAINT `reporte_ibfk_2` FOREIGN KEY (`id_bicicleta`) REFERENCES `bicicleta` (`id_bicicleta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- ruedamovil.soporte definition

CREATE TABLE IF NOT EXISTS `soporte` (
  `id_soporte` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int DEFAULT NULL,
  `id_reporte` int DEFAULT NULL,
  `accion` text,
  `fecha_soporte` datetime DEFAULT NULL,
  `comentarios` text,
  PRIMARY KEY (`id_soporte`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_reporte` (`id_reporte`),
  CONSTRAINT `soporte_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`),
  CONSTRAINT `soporte_ibfk_2` FOREIGN KEY (`id_reporte`) REFERENCES `reporte` (`id_reporte`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- ruedamovil.usuario_rol definition

CREATE TABLE IF NOT EXISTS `usuario_rol` (
  `id_usuario_rol` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int DEFAULT NULL,
  `id_rol` int DEFAULT NULL,
  `fecha_asignacion` datetime DEFAULT NULL,
  PRIMARY KEY (`id_usuario_rol`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_rol` (`id_rol`),
  CONSTRAINT `usuario_rol_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`),
  CONSTRAINT `usuario_rol_ibfk_2` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- ruedamovil.codigo_desbloqueo definition

CREATE TABLE IF NOT EXISTS `codigo_desbloqueo` (
  `id_codigo` int NOT NULL AUTO_INCREMENT,
  `id_prestamo` int DEFAULT NULL,
  `codigo` varchar(100) DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_codigo`),
  KEY `id_prestamo` (`id_prestamo`),
  CONSTRAINT `codigo_desbloqueo_ibfk_1` FOREIGN KEY (`id_prestamo`) REFERENCES `prestamo` (`id_prestamo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;