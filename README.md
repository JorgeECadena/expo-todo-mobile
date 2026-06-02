# Sistema de Gestión de Ateliers y Tareas (Todo App)

¡Bienvenido al repositorio del proyecto! Esta es una aplicación móvil moderna desarrollada para optimizar la organización, seguimiento y gestión de talleres (ateliers) y tareas de manera eficiente.

## 📝 Descripción del Proyecto

Este proyecto consiste en una aplicación móvil multiplataforma diseñada para la gestión integral de tareas relacionadas con ateliers. La aplicación permite a los usuarios crear, visualizar, editar, buscar y eliminar tareas (ateliers). 

### Características Principales

* **Detalle Avanzado:** Vista detallada de cada taller, incluyendo título, descripción, prioridad (LOW, MEDIUM, HIGH), fecha de vencimiento y estado de completado.
* **Modo de Edición Dinámico:** Formulario interactivo gestionado con **Formik** y validado con **Yup** que permite modificar toda la información en tiempo real.
* **Manejo Multifacético de Categorías:** Soporte completo para visualizar y asignar múltiples categorías por atelier, representadas visualmente mediante etiquetas con colores personalizados.
* **Búsqueda Optimizada (Debounce):** Pantalla de búsqueda dedicada que implementa un retraso (*debounce*) de 500ms al escribir. Esto evita llamadas excesivas al backend, protegiendo el rendimiento del servidor.
* **Compatibilidad Estricta con Backend:** Formateo localizado de fechas al formato ISO `LocalDateTime` requerido por servidores Java para evitar desajustes de zona horaria o errores de parseo (500 Internal Server Error).

---

## 🚀 Tecnologías Utilizadas

La arquitectura del proyecto está construida sobre las siguientes tecnologías y librerías modernas del ecosistema JavaScript/TypeScript:

* **React Native:** Framework principal para el desarrollo de la interfaz nativa multiplataforma.
* **Expo:** Plataforma y suite de herramientas para agilizar el desarrollo y la compilación.
* **Expo Router:** Enrutamiento basado en archivos nativo para una navegación fluida e intuitiva.
* **TypeScript:** Tipado estático robusto para garantizar la escalabilidad y prevenir errores en tiempo de ejecución.
* **Formik & Yup:** Gestión robusta de formularios, estados de carga, manejo de errores y esquemas de validación estrictos.
* **NativeWind (Tailwind CSS):** Sistema de diseño y estilizado mediante clases utilitarias altamente eficientes.
* **@react-native-community/datetimepicker:** Selector nativo de fechas tanto para iOS como para Android.

---

## 🛠️ Instrucciones de Instalación

Sigue estos pasos para configurar el entorno de desarrollo local:

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/JorgeECadena/expo-todo-mobile.git](https://github.com/JorgeECadena/expo-todo-mobile.git)
   cd todo-mobile