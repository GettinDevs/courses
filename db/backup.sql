--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1 (Debian 15.1-1.pgdg110+1)
-- Dumped by pg_dump version 15.1 (Debian 15.1-1.pgdg110+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: courses; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA courses;


ALTER SCHEMA courses OWNER TO postgres;

--
-- Name: notification_type; Type: TYPE; Schema: courses; Owner: postgres
--

CREATE TYPE courses.notification_type AS ENUM (
    'SUCCESS',
    'WARNING',
    'ERROR',
    'GENERAL'
);


ALTER TYPE courses.notification_type OWNER TO postgres;

--
-- Name: roles; Type: TYPE; Schema: courses; Owner: postgres
--

CREATE TYPE courses.roles AS ENUM (
    'USER',
    'ADMIN'
);


ALTER TYPE courses.roles OWNER TO postgres;

--
-- Name: session_progress_status; Type: TYPE; Schema: courses; Owner: postgres
--

CREATE TYPE courses.session_progress_status AS ENUM (
    'NOT_STARTED',
    'IN_PROGRESS',
    'COMPLETED',
    'WAITING_APPROVAL'
);


ALTER TYPE courses.session_progress_status OWNER TO postgres;

--
-- Name: session_type; Type: TYPE; Schema: courses; Owner: postgres
--

CREATE TYPE courses.session_type AS ENUM (
    'LECTURE',
    'ACTIVITY',
    'NOTE'
);


ALTER TYPE courses.session_type OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: app_user; Type: TABLE; Schema: courses; Owner: postgres
--

CREATE TABLE courses.app_user (
    user_id integer NOT NULL,
    username character varying(50) NOT NULL,
    user_role courses.roles DEFAULT 'USER'::courses.roles
);


ALTER TABLE courses.app_user OWNER TO postgres;

--
-- Name: app_user_user_id_seq; Type: SEQUENCE; Schema: courses; Owner: postgres
--

CREATE SEQUENCE courses.app_user_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE courses.app_user_user_id_seq OWNER TO postgres;

--
-- Name: app_user_user_id_seq; Type: SEQUENCE OWNED BY; Schema: courses; Owner: postgres
--

ALTER SEQUENCE courses.app_user_user_id_seq OWNED BY courses.app_user.user_id;


--
-- Name: course; Type: TABLE; Schema: courses; Owner: postgres
--

CREATE TABLE courses.course (
    course_id integer NOT NULL,
    title character varying(120) NOT NULL,
    depends_on integer
);


ALTER TABLE courses.course OWNER TO postgres;

--
-- Name: course_course_id_seq; Type: SEQUENCE; Schema: courses; Owner: postgres
--

CREATE SEQUENCE courses.course_course_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE courses.course_course_id_seq OWNER TO postgres;

--
-- Name: course_course_id_seq; Type: SEQUENCE OWNED BY; Schema: courses; Owner: postgres
--

ALTER SEQUENCE courses.course_course_id_seq OWNED BY courses.course.course_id;


--
-- Name: enrollment; Type: TABLE; Schema: courses; Owner: postgres
--

CREATE TABLE courses.enrollment (
    enrollment_id integer NOT NULL,
    course_id integer NOT NULL,
    user_id integer NOT NULL,
    is_completed boolean DEFAULT false
);


ALTER TABLE courses.enrollment OWNER TO postgres;

--
-- Name: enrollment_enrollment_id_seq; Type: SEQUENCE; Schema: courses; Owner: postgres
--

CREATE SEQUENCE courses.enrollment_enrollment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE courses.enrollment_enrollment_id_seq OWNER TO postgres;

--
-- Name: enrollment_enrollment_id_seq; Type: SEQUENCE OWNED BY; Schema: courses; Owner: postgres
--

ALTER SEQUENCE courses.enrollment_enrollment_id_seq OWNED BY courses.enrollment.enrollment_id;


--
-- Name: notification; Type: TABLE; Schema: courses; Owner: postgres
--

CREATE TABLE courses.notification (
    user_id integer NOT NULL,
    title character varying(100) NOT NULL,
    description text,
    notification_type courses.notification_type NOT NULL
);


ALTER TABLE courses.notification OWNER TO postgres;

--
-- Name: session; Type: TABLE; Schema: courses; Owner: postgres
--

CREATE TABLE courses.session (
    session_id integer NOT NULL,
    title character varying(120) NOT NULL,
    content text NOT NULL,
    session_type courses.session_type DEFAULT 'LECTURE'::courses.session_type,
    is_mandatory boolean NOT NULL,
    rank integer NOT NULL,
    course_id integer NOT NULL
);


ALTER TABLE courses.session OWNER TO postgres;

--
-- Name: session_progress; Type: TABLE; Schema: courses; Owner: postgres
--

CREATE TABLE courses.session_progress (
    session_progress_id integer NOT NULL,
    session_id integer NOT NULL,
    user_id integer NOT NULL,
    is_completed boolean DEFAULT false,
    progress_status courses.session_progress_status DEFAULT 'NOT_STARTED'::courses.session_progress_status
);


ALTER TABLE courses.session_progress OWNER TO postgres;

--
-- Name: session_progress_session_progress_id_seq; Type: SEQUENCE; Schema: courses; Owner: postgres
--

CREATE SEQUENCE courses.session_progress_session_progress_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE courses.session_progress_session_progress_id_seq OWNER TO postgres;

--
-- Name: session_progress_session_progress_id_seq; Type: SEQUENCE OWNED BY; Schema: courses; Owner: postgres
--

ALTER SEQUENCE courses.session_progress_session_progress_id_seq OWNED BY courses.session_progress.session_progress_id;


--
-- Name: session_session_id_seq; Type: SEQUENCE; Schema: courses; Owner: postgres
--

CREATE SEQUENCE courses.session_session_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE courses.session_session_id_seq OWNER TO postgres;

--
-- Name: session_session_id_seq; Type: SEQUENCE OWNED BY; Schema: courses; Owner: postgres
--

ALTER SEQUENCE courses.session_session_id_seq OWNED BY courses.session.session_id;


--
-- Name: app_user user_id; Type: DEFAULT; Schema: courses; Owner: postgres
--

ALTER TABLE ONLY courses.app_user ALTER COLUMN user_id SET DEFAULT nextval('courses.app_user_user_id_seq'::regclass);


--
-- Name: course course_id; Type: DEFAULT; Schema: courses; Owner: postgres
--

ALTER TABLE ONLY courses.course ALTER COLUMN course_id SET DEFAULT nextval('courses.course_course_id_seq'::regclass);


--
-- Name: enrollment enrollment_id; Type: DEFAULT; Schema: courses; Owner: postgres
--

ALTER TABLE ONLY courses.enrollment ALTER COLUMN enrollment_id SET DEFAULT nextval('courses.enrollment_enrollment_id_seq'::regclass);


--
-- Name: session session_id; Type: DEFAULT; Schema: courses; Owner: postgres
--

ALTER TABLE ONLY courses.session ALTER COLUMN session_id SET DEFAULT nextval('courses.session_session_id_seq'::regclass);


--
-- Name: session_progress session_progress_id; Type: DEFAULT; Schema: courses; Owner: postgres
--

ALTER TABLE ONLY courses.session_progress ALTER COLUMN session_progress_id SET DEFAULT nextval('courses.session_progress_session_progress_id_seq'::regclass);


--
-- Data for Name: app_user; Type: TABLE DATA; Schema: courses; Owner: postgres
--

COPY courses.app_user (user_id, username, user_role) FROM stdin;
1	tomas	ADMIN
2	willi	USER
4	anda	USER
3	student	USER
\.


--
-- Data for Name: course; Type: TABLE DATA; Schema: courses; Owner: postgres
--

COPY courses.course (course_id, title, depends_on) FROM stdin;
1	HTML and CSS	\N
2	JavaScript Essentials	\N
3	API	2
\.


--
-- Data for Name: enrollment; Type: TABLE DATA; Schema: courses; Owner: postgres
--

COPY courses.enrollment (enrollment_id, course_id, user_id, is_completed) FROM stdin;
1	1	2	f
2	2	2	f
3	3	2	f
4	1	3	f
5	2	3	f
6	3	3	f
\.


--
-- Data for Name: notification; Type: TABLE DATA; Schema: courses; Owner: postgres
--

COPY courses.notification (user_id, title, description, notification_type) FROM stdin;
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: courses; Owner: postgres
--

COPY courses.session (session_id, title, content, session_type, is_mandatory, rank, course_id) FROM stdin;
1	Introduction	This is your lecture about HTML and CSS	LECTURE	t	0	1
2	Starting with elements	Those are different HTML elements	LECTURE	t	1	1
6	Variables	A la hora de programar, tendremos que tener alguna manera de guardar los datos con los que trabajamos y los resultados de nuestra lógica. Para ello, usamos las _variables_. Podéis imaginar que cada variable representa una caja que contiene cierto contenido dentro y además, tiene una pegatina pegada que indica qué hay dentro.\n\nLa estructura de una variable es la siguiente:\n`var ____ = ____`\n`var etiquetaDeLaCaja = 'contenido de la caja'`\n\nEjemplos:\n```js\nvar gatoVivoOMuerto = 'Gato de Schrödinger'\nvar edad = 34\nvar nombre = 'John'\n```\n\nExplicamos parte por parte:\n- `var`: es una _keyword_ para DECLARAR (__DECLARE__) variables\n- `gatoVivoOMuerto`: es el nombre que le hemos asignado a la variable\n- ` = `: un operador que hemos utilizado para ASIGNAR (__ASSIGN__) un VALOR (__VALUE__) a la variable\n- `'Gato de Schrödinger'`: el VALOR (__VALUE__) que le hemos asignado a la variable\n\n#### Nombre de la variable\nEl nombre de la variable no puede contener espacios. Si está compuesta por varias palabras, como en el ejemplo de `gato vivo o muerto`, se suelen juntar todas las palabras en una y para hacerlo legible, tenemos varios formatos:\n\t- `gatovivoomuerto` (todo junto) <-- por favor, no utilizar esto que no se entiende\n\t- _snake case_: `gato_vivo_o_muerto` (juntamos usando `_`) (se suele usar en Python)\n\t- _pascal case_: `GatoVivoOMuerto` (juntamos y todas las palabras empiezan por mayúscula)\n\t- _camel case_: `gatoVivoOMuerto` (juntos y todas las palabras empiezan por mayúscula menos la primera)\n\nTodos los formatos son válidos en JS, pero se suele utilizar el _camel case_. También mencionar, que las variables no pueden empezar por números ni ser una _keyword_.\n\n#### Valor de la variable (Variable VALUE)\nEl valor de una variable puede ser literalmente todo lo que vosotros queráis, pero hay que diferenciar entre un tipo y otro, para que el ordenador los pueda diferenciar y usar de forma correcta. Los diferentes tipos de valores se conoce como ___VALUE TYPES___ o ___DATA TYPES___ y hay de dos tipos:\n\n- __Primitive Data Type__\n\t- String. Se refiere a texto. Se enmarca entre alguno de los tres símbolos:\n\t\t- `'texto'` <-- se suele usar este\n\t\t- `"texto"` <-- eres un monstruo\n\t\t- \\``text` \\` <-- se suele usar para otras cosas\n\t- Number. Se refiere a números. No se enmarca entre nada, simplemente escribes el número. Los decimales se separan con un punto `.` .\n\t- Boolean. Se refiere a los binarios que tienen dos estados: 0 y 1. En JS son `true` o `false` (todo minúscula).\n\t- Otros. Representan vacío. Por ahora los podéis interpretar de la misma manera, pero de todos modos tenéis una breve explicación.\n\t\t- `null`: El programador quiere representar vacío o nada.\n\t\t- `undefined`: El ordenador representa vacío o nada. (el programador también lo puede usar, pero no tiene mucho sentido :)\n\n- __Non-Primitive Data Type__\n  Estos se utilizan para englobar varios _VALUES_, y no solo uno. Los veremos más adelante.\n\t- Object\n\t- Array\n\t- Set (no se suele utilizar mucho)\n\t- Map (no se suele utilizar mucho)\n\t- Functions\n\n#### Declare vs Define\nImportante tener claros estos dos conceptos:\n- Declarar (__declare__) variables significa crear la variable. Ejemplo: `var age` (creamos la variable age)\n  Una variable solo se puede declarar una única vez. En este caso, no podríamos volver a escribir `var age` porque la variable `age` ya existe.\n  Mencionar que cuando declaramos una variable y no la definimos nosotros, automáticamente se le define el valor de `undefined`.\n\n- Definir (__define__) variables significa asignar un valor a una variable previamente creada. Ejemplo: `age = 23`.\n  A diferencia de declarar, una variable se puede definir todas las veces que queráis. Ejemplo: `age = 50`. En este caso, la variable `age` antes valía `23` y ahora `50`.\n\nTambién podemos declarar y definir una variable a la vez. Ejemplo: `var name = 'John'`.\n\n#### `var` vs `let` vs `const`\nPara declarar variables hasta ahora hemos visto que utilizamos el _keyword_ de `var`, pero esto es una opción deprecada (su uso ya no es recomendable). El motivo es que tiene un _scope_ diferente al resto de lenguajes de programación (_scope_ lo veremos más adelante).\n\nHoy en día, en lugar de `var` se utiliza `let`. Ejemplo: `let name = 'John'`. `let` en un principio funciona de la misma manera que `var` solo que solucionando sus problemas. Recordad que una variable la podemos definir más de una vez.\n\nExiste un otro _keyword_ para declarar variables, el cual es `const` cuyo nombre proviene de _constante_. Este funciona exactamente igual que `let` únicamente que permite que su valor se defina una sola vez, es decir, solo le podemos asignar el valor una sola vez, y no lo podemos cambiar más adelante. Es muy útil cuando sabemos que el valor de la variable no va a cambiar. Si en algún momento intentamos cambiarle el valor, nos va a tirar un error avisándonos de que estamos intentando modificar el valor de una constante.\n\nEjemplos:\n```\nlet age = 10 // se declara la variable age, y se le define el valor de 10\nage = 40     // se define un nuevo valor, y el valor cambia a 40 correctamente\n\nconst name = 'John'  // se declara la variable name, y se le define el valor de 'John'\nname = 'Kyle'        // se le intenta definr un nuevo valor, pero como hemos usado "const" va a tirar error\n```\n\nNormalmente, no solemos cambiar muy a menudo los valores de las variables, por eso, en primar lugar siempre vamos a preferir usar `const`. En el caso de que vayamos a cambiar su valor, ya entonces podemos utilizar `let`.	LECTURE	t	3	2
8	Dynamic Typing	Así como tenemos valores de distintos tipos, de la misma manera las variables también tienen tipo. Tranquilos, que no existen más tipos de datos, únicamente saber que las variables adquieren el mismo tipo que el del contenido. Veamos un ejemplo:\n`let edad = 45`\nNuestro valor es `45`, el cual es de tipo `number`. De la misma manera, la variable `edad` adquiere el tipo del valor que contiene, es decir, la variable edad AHORA MISMO es del tipo `number` también.\n\n¿Recordáis que podemos definir una variable (asignar contenido nuevo) más de una vez? Este contenido nuevo puede ser de tipo diferente, por ende, el tipo de la variable irá cambiando también (de ahí, el _dynamic typing_). Ejemplo:\n```\nlet randomVariable;     // <-- type is undefined\nrandomVariable = 20     // <-- type is number\nrandomVariable = 'hey'  // <-- type is string\n```\n\n#### ¿Por qué hace falta saber esto?\nActualmente, no os aporta demasiado, pero es importante saber que en un lenguaje de programación compilado (no interpretado) es imposible cambiar el tipo de las variables, y además, se tiene que definir por adelantado.\n\nPodréis pensar que esto es una gran ventaja, pero en verdad tiene sus inconvenientes, ya que a la hora de programar (y una vez ya tenemos muchas variables), podemos perder la noción de con qué tipo de variables trabajamos e insertar lógica no válida (y JS no nos va a informar hasta que no se ejecute y falle). Más adelante vamos a estudiar TypeScript (JavaScript con Types, de ahí el nombre) que nos va a ayudar a solucionar estos problemas.	LECTURE	t	4	2
9	Strings	Como ya hemos visto, y ya sabéis, los _strings_ representan texto. En JavaScript tenemos tres maneras de escribirlo:\n```\nconst miColorFavorito = 'rojo'  // comillas simples\nconst miColorFavorito = "rojo"  // comillas dobles\nconst miColorFavorito = `rojo`  // accento grave (back tick)\n```\n\nRecomiendo utilizar comillas simples :)\n\n#### Concatenar texto\nPara concatenar texto podemos usar el operador `+`, ejemplo:\n```\nconst nombre = 'John'\nconst saludo = 'Hola, me llamo '\n\nconst saludoCompleto = saludo + nombre  // 'Hola, me llamo John'\n\nconsole.log(saludoCompleto) // console.log() se utiliza para mostrar un mensaje por consola\n```\n\nOtro ejemplo:\n```\nconst edad = 50\nconst saludoCompleto = 'Tengo ' + edad + ' años' \n```\n\nEn el ejemplo anterior, hemos metido una variable entre texto. En el caso de que tengamos un texto largo y muchas variables, el código quedaría muy poco legible, por eso tenemos otra alternativa para combinar texto y variables. Esto se conoce como _interpolación de texto_, y para ello vamos a utilizar el _back tick_ para englobar nuestro texto, y vamos a **interpolar** las variables utilizando `${ variable }`. Ejemplo:\n```\nconst nombre = 'John'\nconst edad = 50\n\nconst saludo = `Hola, mi nombre es ${nombre} y tengo ${edad} años!` // Perfecto! Así queda mucho más limpio el código!\n\n// Una alternativa poco recomendada es usando el operador prèviamente visto:\nconst saludo = 'Hola, mi nombres es ' + nombre + ' y tengo ' + edad + ' años!'\n```\n\nA la hora de combinar texto (ya sea usando el operador o interpolando), podéis incluir también números, boleanos, nulls y undefined, ya que serán transformados a texto automáticamente. Como en el ejemplo anterior, usamos nombre y edad, que son de tipos diferentes.\n\n#### Escape character (backslash `\\`)\nImaginaros que queréis escribir el siguiente texto: _Tu 'opinión' no me importa_.\n```\nconst pensamiento = 'tu 'opinión' no me importa'\n                    ^___^       ^______________^ // esto indica inicio y fin del string según JS\n```\n\n¡Tenemos un problema! Las comillas simples las usamos también para indicar a JavaScript que trabajamos con texto. ¿Qué hacemos? Fácil, en lugar de utilizar comillas simples, utilizamos comillas dobles o back tick.\n```\nconst pensamiento = "tu 'opinión' no me importa"\n                    ^__________________________^\n```\n¿Todo bien, pero que pasaría si en el mismo texto, necesitamos usar tanto las comillas simples como las comillas dobles y el back tick a la vez? En ese caso, antes del carácter utilizamos `\\` para indicar a JS que no lo interprete como parte del código sino como parte del texto.\n```\nconst pensamiento = 'tu \\'opinión\\' no me importa, "esto" es mucho más importante'\n                    ^____________________________________________________________^\n```	LECTURE	t	5	2
4	Development Environment	¡Solo leyendo, no se aprende, necesitamos practicar! Por eso, vamos a preparar nuestro entorno de desarrollo, el cual nos va a permitir ejecutar código de JS. Antes de instalar programas aleatorios, entendamos por qué los necesitamos :D\n\n#### ¿Qué es un lenguaje de programación?\nEn resumen, un lenguaje de programación es texto que representa instrucciones guardadas en un archivo. Este texto está compuesto, según el lenguaje de programación, por unas palabras reservadas u otras (estas se llaman _keywords_). Ejemplo:\n\n`if (cantidad_a_retirar > candadad_en_banco) print("No tienes suficiente dinero")`\n\nEn este caso, `if` (en español, la condicional `si...`) es una _keyword_.\n\n#### ¿Cómo entiende el ordenador estas instrucciones guardadas en archivos?\nLos ordenadores solo entienden binario, por lo cual, tenemos un paso extra, el cual consiste en pasar estas instrucciones de "lenguaje humano" (palabras reales) a "lenguaje de ordenador" (binario). Para conseguir esto, existen dos maneras según el lenguaje de programación:\n\n- __Lenguaje Compilado.__ Ejemplo: Java (¡¡¡ Es otro lenguaje de programación diferente a JavaScript !!!)\n\t1. Escribir las instrucciones en lenguaje humano. Archivo: _myApp.java_\n\t2. Compilarlo, lo que equivale a pasar las instrucciones a binario y guardarlas en un archivo nuevo. Archivo: _myApp.class_\n\t3. Cada usuario ejecuta este archivo nuevo _myApp.class_ el cual contiene solo código en binario.\n\n- __Lenguaje Interpretado.__ Ejemplo: JavaScript\n\t1. Escribir las instrucciones en lenguaje humano. Archivo: _myApp.js_\n\t2. Cada usuario ejecuta el archivo _myApp.js_ y cada usuario necesita tener instalado un _intérprete_. Existen diferentes _intérpretes_ que leen las instrucciones y en tiempo real, línea por línea, las pasan a binario.\n\nAl leer esto, os preguntaréis por qué no todos los lenguajes son interpretados, si así no hace falta compilar. Bueno, tienen una gran desventaja: son más lentos y requieren más recursos. Pero tienen la ventaja de que son más fáciles de aprender y es más rápido desarrollar con ellos.\n\nTambién os estaréis preguntando, ¿acaso yo tengo instalado un intérprete? Todos los navegadores tienen un intérprete de JavaScript (se suele llamar _JavaScript Engine_) incorporado. En el caso de Firefox es _SpiderMonkey_ y de Chrome es _V8_.\n\nEn un principio, JavaScript se había creado únicamente para ser ejecutado dentro de las páginas web, de ahí que estos intérpretes se encuentren incorporados en los navegadores.\n\nAños más tarde, un grupo de cracks decidieron que sería interesante utilizar JavaScript para otras cosas que no sea solo páginas web. Por eso, extrajeron el intérprete de JS de Chrome (el _V8_), metieron un par de funcionalidades extra y lo llamaron _NodeJS_.\n\n#### ¿Cómo ejecuto entonces JavaScript?\nTenemos dos maneras:\n- Usando el navegador. Clicando botón derecho > "Inspeccionar" > "Consola", puedes ejecutar código JS.\n- Descargando NodeJS (https://nodejs.org/). Hay diferentes versiones, es preferible siempre instalar la versión que viene marcada con _LTS_, lo cual significa _Long Term Support_. Esto es una versión que tendrá soporte bastantes años (si encuentran errores los van a arreglar). El resto, suelen tener soporte 6 meses o un año, y después de ese periodo, si algo falla, no lo van a arreglar.\n\n#### ¿Dónde escribo mi código?\nComo hemos dicho, "instrucciones en un archivo". Con el mismo bloc de notas de Windows puedes crear un archivo con extensión `.js` y escribir ahí mismo el código. Luego, una vez instalado _NodeJS_, deberías escribir en la consola `node mi-archivo.js` y se ejecutará tu código.\n\nUn punto negativo del bloc de notas es que todo el texto está en color negro, y a nosotros nos gustan los colores :D. Por eso, descargamos Visual Studio Code (o abreviado VSCode). Lo bueno de utilizarlo es que nos va a colorear todos los _keywords_ y nos va a ofrecer un autocompletado. También tiene una consola (o terminal) integrada. Incluso podéis descargar extensiones que ofrecen multitud de funcionalidades para facilitaros la programación.\n\nAquí tenéis una demostración completa de los pasos a seguir: (video de 3 min) https://www.youtube.com/watch?v=C0Hq42pIknM&ab_channel=BoostMyTool\n- Descargar e instalar NodeJS\n- Descargar e instalar VSCode\n- Ejecutar un archivo `.js`\n- NO hace falta que instaléis extensiones	LECTURE	t	1	2
5	Statements	En esta sesión, no hace falta memorizar nada. Simplemente, se presentan los conceptos para que tengáis un primer acercamiento al lenguaje de programación y os sintáis más seguros a la hora de practicar.\n\nComo hemos dicho, nuestro código está compuesto por instrucciones, y cada una de estas se llama _statement_. Los _statements_ están compuestos por valores, operadores, expresiones, palabras clave y comentarios. Ejemplos de estos:\n\n- Valores (__values__). Cualquier valor escrito por vosotros, como texto o número. Por ejemplo: la edad de una persona, o su nombre.\n\n- Operadores (__operators__). Símbolos que ofrecen funciona lides (los veremos más adelante). Por ejemplo: `=, +, -, *, /, %, ==, &&, ||, !.`\n\n- Expresiones (__expressions__). Trozo de código que da como resultado un valor. Por ejemplo: `5 + 2` (nos da 7)\n\n- Palabras clave o palabras reservadas (__keywords__). Palabras clave que JS identifica con cierta acción. Por ejemplo:\n\t- `var`: declarar una variable\n\t- `if`: empezar una condición\n\t- `for`: empezar un bucle\n\t- `function`: declarar una función\n\n- Comentarios (__comments__). Se utilizan para explicaciones de nuestro código. Estas no se ejecutan y JS no las lee. Se pueden definir de dos maneras:\n\t- con `//` delante de la línea a comentar (hay que insertarlo delante de cada línea que queramos comentar)\n\t- si la explicación es larga y necesitamos varias líneas, ponemos al principio `/*` y al final `*/`\n\nAl final de cada _statement_, podéis encontrar que terminan en `;` para indicar la finalización de este. Realmente, hoy en día, ya no hace falta y no se suele añadir.\n\nOtro punto a comentar es que a JS le dan igual los espacios en blanco (" "). Tanto uno como el otro, representan lo mismo:\n```\nvar persona = 'John'\nvar persona=     'John'\n```	LECTURE	t	2	2
10	Numbers	Los Numbers representan los números y no hace falta indicarlos de ninguna forma especial como los Strings. Podemos utilizar distintos operadores para realizar multitud de operaciones entre números. Los más usados son:\n```\nconst resultado = 10 + 50 // sumar\nconst resultado = 10 - 50 // restar\nconst resultado = 10 * 50 // multiplicar\nconst resultado = 10 / 50 // dividir\n\nconst resultado = 10.2 + 20 // podemos utilizar también decimales separándolos por un punto\n```\n\nPara cambiar el orden natural de las operaciones utilizamos paréntesis `()`. Recordad que primero va la multiplicación y la división, y luego la suma y la resta.\n```\nconst resultado = (2 + 10) * 5\n```\n\n#### Recordatorio\nEsto no se puede sumar:\n```\nconst resultado = '20' + '40' // Fijaros que son strings, no numbers\n                              // En este caso, va a devolver '2040' porque encadenamos strings\n```\n\n#### Atajos\nA menudo os encontraréis que tenéis que incrementar o decrementar un valor. Esto se consigue así:\n```\nconst age = 20 // definimos valor 20\n\n// hoy es el cumpleaños y tenemos que incrementar su edad por 1\nage = age + 1 // lo que equivale a: 20 + 1\n```\n\nOtra forma que se puede conseguir esto es:\n```\nage += 1 // Incrementamos por 1\n\n\n// más ejemplos:\nage += 20 // Incrementamos por 20\nage -= 5 // Decrementamos por 5\n```\n\nEn el caso de incrementar o decrementar solo por 1, existe incluso este otro atajo:\n```\n// Usando este atajo, no hace falta definir el nuevo valor, es decir, no hace falta hacer esto:\nage = age++\nage = age--\n\n// Basta con:\nage++\nage--\n```	LECTURE	t	6	2
12	Functions	Las funciones son bloques de código diseñados para realizar una cierta tarea. Se utiliza el _keyword_ de `function` el cual procede de un nombre que nosotros elegimos, unos paréntesis `()` y unas llaves `{}`.\n```\nfunction name() {\n // codigo a ejecutar\n}\n```\n\nEjemplo:\n```\nfunction saludo() {\n\tconsole.log('Hola, mi nombre es John!')\n}\n```\n\nAhora bien, hemos declarado la función, pero el bloque de código no se va a ejecutar hasta que no llamemos a la función. Esto se consigue indicando el nombre de la función procediendo de paréntesis.\n```\nsaludo() // Ahora se ejecuta la función y se muestra por pantalla el saludo.\n```\n\nUna otra funcionalidad de las funciones es que estas pueden recibir _parámetros_, los cuales nos puede facilitar para hacer la función más flexible y que sea aún más fácil reutilizar código (no tener que copiar y pegar el mismo código una y otra vez).\n\nVamos a crear una función que pase de Fahrenheit a grados Celsius:\n```\nfunction toCelsius(fahrenheit) {  \n  return (5/9) * (fahrenheit-32);  \n}\n```\nSi os fijáis, hemos introducido un nuevo concepto, el cual es el `return`. No tiene mucho misterio, simplemente es el valor que va a devolver la función una vez ejecutada.\n```\nconst temperaturaMadrid = toCelsius(82)\nconst temperaturaBarcelona = toCelsius(76)\n```\n\nObservamos como mediante el parámetro `fahrenheit` somos capaces de hacer mucho más útil esta función, ya que podemos utilizarla varias veces y con valores distintos. Lo que nos permite el `return` en este caso, es que una vez se ha ejecutado la función, devuelva el valor y este sea guardado en las variables correspondientes.\n\n#### Funciones anónimas\nHasta ahora, hemos visto que una vez declarada la función, utilizando su nombre, la podemos utilizar todas las veces que queramos. Hay veces que una función no nos hace falta reutilizarla y simplemente la queremos usar en el momento de declaración - para ello usamos las funciones anónimas. ¿Por qué anónimas? Porque no tienen nombre, y por ende, no pueden ser reutilizadas. Ejemplo:\n```\nfunction() {\n // nuestra lógica\n}\n```\n\nNormalmente, son también conocidas como funciones _callback_ y tienen una utilidad específica, pero esto lo estudiaremos más tarde. Ahora mismo, nos basta con saber que no tienen nombre y que solo se pueden utilizar a la hora de crearlas. Una duda que os debería de surgir es, ¿cómo la utilizamos si no tiene nombre, incluso si es solo una vez? Tenemos dos maneras:\n\n1. La primera sería guardando la función anónima en una variable (así conseguimos que se comporte de manera casi idéntica a una función normal):\n```\nconst sumarDosValores = function(a, b) {\n\treturn a + b\n}\n\nsumarDosValores(20, 40)\nsumarDosValores(500, 10)\n```\n\n2. Metiendo la función en una expresión mediante paréntesis y ejecutándola `(función)()`:\n```\n(function(a, b) {\n\treturn a + b\n})()\n\n// Tranquilos, esto nunca se usa, pero no está de más conocerlo :) \n```	LECTURE	t	8	2
13	Objects	Tal como vimos en _4. Variables_, los objetos son otro tipo de dato. Los objetos agrupan variables y funciones que en conjunto tienen algún tipo de relación y sentido. Veamos este ejemplo en el contexto de un coche:\n```\nconst marca = 'audi'\nconst color = 'azul'\nconst caballos = 180\n\nfunction arrancar() {\n\t// lógica para arrancar el coche\n}\n\nfunction acelerar() {\n\t// lógica para acelerar el coche\n}\n\nfunction frenar() {\n\t// lógica para frenar el coche\n}\n\nfunction apagar() {\n\t// lógica para apagar el coche\n}\n```\n\nLa estructura de un objeto es la siguiente:\n```\nconst myObject = {\n\tkey1: value1,\n\tkey2: value2\n}\n```\n\nSi agrupamos las variables y funciones previamente declaradas, quedaría:\n```\nconst miCoche = {\n\tmarca: 'audi',\n\tcolor: 'azul',\n\tcaballos: 180,\n\tarrancar: function() {\n\t\t// lógica para arrancar el coche\n\t},\n\tacelerar: function() {\n\t\t// lógica para acelerar el coche\n\t},\n\tfrenar: function() {\n\t\t// lógica para frenar el coche\n\t},\n\tapagar: function() {\n\t\t// lógica para apagar el coche\n\t}\n}\n```\n\nDetalles que observamos:\n- En lugar del operador `=`, se usa `:`\n- El nombre de la variable dentro del objeto se denomina **key** y su contenido **value** (mirad estructura)\n- Cada una de las variables y funciones está separada por una coma `,`\n- Las funciones son anónimas (ver _9. Funciones_)\n\nEmpezando a ser más técnicos, lo que equivale a funciones se denomina _método_ y todo lo otro _propiedades_. En este caso, _marca, color y caballos_ son propiedades de _miCoche_. Mientras que, _arrancar, acelerar, frenar y apagar_ son métodos de _miCoche_.\n\nPara acceder a ellos tenemos dos maneras, en ambos casos usando el **key**:\n- **Bracket notation:** (notación de bracket)\n```\nmiCoche['marca']\nmiCoche['arrancar']() // no olvideis que hay que usar () para ejecutar, ya que es una función\n```\n\n- **Dot notation:** (notación de punto)\n```\nmiCoche.marca\nmiCoche.arrancar()\n```\n\nEs más común utilizar el _dot notation_, pero en el caso de que el **key** esté dentro de una variable, hay que usar el _bracket notation_. Ejemplo:\n```\nconst propiedadAVisualizar = 'marca'\nmiCoche[propiedadAVisualizar]\n```	LECTURE	t	9	2
3	Introduction	JavaScript (o también abreviado JS) es el lenguaje de programación base del desarrollo web, por eso mismo, será muy importante saber utilizarlo bien :) Por suerte, es un lenguaje relativamente sencillo comparado con el resto, y además, no necesitamos programas externos (o muy complejos de instalar) para ejecutarlo.\n\nQue diga que es sencillo, no significa que lo aprenderéis en un día, pero sí que seremos capaces de empezar a construir cosas básicas en poco tiempo. Poco a poco, iremos profundizando hasta llegar a cosas más complejas e interesantes.\n\nEn este curso, en lugar de profundizar en cada concepto por separado, iremos aprendiendo poco a poco un poco de todo, para así, obtener una visión general de JavasScript y poder empezar a programar lo antes posible. Considero que ampliar los conocimientos sobre algo que ya sabes es más fácil que entender temas enteros sin previo contexto.\n\nRecalcar también, por favor, no interpretéis este curso como un libro. Con esto quiero decir, ir saltando de sesión a sesión (cada curso está compuesto por sesiones) e ir fijándoos únicamente en lo que vosotros creáis importante. Obviamente, como cualquier cosa en esta vida, aprender algo nuevo requiere un esfuerzo mental y a los humanos no nos gusta este sentimiento, por lo cual lo intentamos obviar. Es totalmente entendible que al principio todo lo resumáis con un "esto es una mierda sin sentido", pero tranquilos, confiad que la cosa mejora y el dolor de cabeza cada vez disminuye :D Esto lo menciono porque veréis muchas palabras nuevas que formarán oraciones que no tendrán mucho sentido para vosotros, pero por favor, leedlo las veces que haga falta porque si está escrito, significa que es sustancialmente importante.\n\nEl contenido está escrito en español, a pesar de que los conceptos estarán en inglés, ya que os facilitará a la hora de buscar información por internet y encontrar trabajo. Entiendo que la programación ya de por sí es compleja como para aprenderla en otra lengua, pero será fundamental para poder buscar trabajo fuera de España (España es el país que menos paga de toda Europa).\n\n__TIP__: Una muy buena página con recursos y ejemplos es https://www.w3schools.com/js/default.asp\n\n__TIP__: Cambiar el teclado del ordenador (el _layout_) a US os ayudará para programar más rápido, por eso, cuanto antes os acostumbréis, mejor. El teclado en español usa gran parte de las teclas para tildes o letras que no existen en inglés, por eso, para escribir diferentes caracteres que necesitamos a la hora de programar se encuentran con atajos muy raros. Ejemplos: `;[]{}/\\|<>"'`	LECTURE	t	0	2
14	Arrays	Los arrays representan listas de elementos y su estructura es la siguiente:\n```\nconst array_name = [item1, item2, ...];\n```\n\nEjemplo:\n```\nconst car1 = 'bmw'\nconst car2 = 'audi'\nconst car3 = 'mercedes'\n\n// En lugar de definir variables separadas, podemos crear una lista y agruparlas\n// En este caso, tendría sentido, ya que las tres variables son coches\nconst cars = [car1, car2, car3]\n\n// o incluso, sin que haga falta definir préviamente variables\nconst cars = ['bmw', 'audi', 'mercedes']\n\n// si la lista es muy larga, se pueden escribir así también\nconst cars = [\n\t'bmw',\n\t'audi',\n\t'mercedes\n]\n```\n\nPara acceder a cada uno de los valores de forma individual, usamos los índices. Los índices son números que empiezan de 0 y van incrementando por 1 de forma automática según la cantidad de elementos que haya en el array.\n```\nconst cars = [\n\t'bmw',      <- index: 0\n\t'audi',     <- index: 1\n\t'mercedes   <- index: 2\n]\n```\n\nA diferencia de los objetos, con los arrays solo podemos usar el **bracket notation** y especificamos el índice.\n```\ncars[0] // <- devuelve: bmw\ncars[1] // <- devuelve: audi\ncars[2] // <- devuelve: mercedes\n```\n\nDe esta forma, también podemos modificar valores que esten en cierto índice:\n```\ncars[1] = 'audi azul'\n```\n\nMencionar que un array puede contener valores de diferentes tipos:\n```\nconst myArray = [\n\t'toyota',\n\t2001,\n\t{ age: 20 },           // dentro un array podemos meter un objecto también\n\t['platano', 'melon'],  // de la misma manera, un array también\n\tundefined,\n\tnull\n]\n```\n\n¿Cómo accederíamos a `platano`?\n```\n// Primero buscamos el index en el array myArray -> 3\n// Este nos devuelve otro array, y dentro de este esta en index -> 0\n\nmyArray[3][0]\n\n\n// En resumen:\nconst myArray = [\n\t'toyota',              // index: 0\n\t2001,                  // index: 1\n\t{ age: 20 },           // index: 2\n\t['platano', 'melon'],  // index: 3\n//       ^         ^\n//    index 0    index 1\n\tundefined,\n\tnull\n]\n```\n	LECTURE	t	10	2
15	If statement	Los _if statements_ nos permiten ejecutar ciertas acciones según una condición. La estructura es:\n```\n// Disponemos de:\n// - if\n// - else\n// - else if\n\nif (primera condición) {\n\t// código a ejecutar si la primera condición es true\n}\nelse if (segunda condición) {\n\t// código a ejecutar si\n\t// - la primera condición es false\n\t// - la segunda condición es true\n}\nelse {\n\t// código a ejecutar si todas las condiciones enteriores son false\n}\n```\n\nMencionar que el `else if` y el `else` son opcionales.\n\nDentro de "condición" colocamos una expresión que de como resultado Boolean, ya sea `true` o `false`.\n```\nconst edad = 10\n\nif (edad > 18) {\n\tconsole.log('Bienvenido al club!')\n}\nelse {\n\tconsole.log('Aquí tiene tu happy meal')\n}\n```\n\nOtro ejemplo:\n```\nconst novia = null\n\nif (novia) {\n\tconsole.log('A comprar rosas y regalos :)')\n} else {\n\tconsole.log('Descárgate Tinder')\n}\n```	LECTURE	t	11	2
16	While & For Loops	Los bucles son muy útiles cuando queremos ejecutar el mismo código multitud de veces y cambiando únicamente un valor. Cuando trabajamos con bucles, se suelen tratar arrays también. Ejemplo si lo tuviéramos que hacer de forma manual:\n```\nconst frutas = ['mango', 'kiwi', 'manzana']\n\n// utilizamos los íncides para acceder a cada uno de los elementos\nconsole.log(frutas[0])\nconsole.log(frutas[1])\nconsole.log(frutas[2])\n```\n\nAhora imagínate que tenemos un array con 5000 elementos, tardaríamos muchísimo en hacer un `console.log()` a cada uno de los elementos. Por eso mismo, usaremos un bucle.\n\nEl primero que veremos es el `while` y su estructura es la siguiente:\n```\nwhile (condición) {\n\t// codigo a ejecutar mientras la condición sea cierta \n}\n```\n\nSi aplicamos el while a nuestro ejemplo, quedaría algo así:\n```\n// TIP ANTES DE EMPEZAR:\nfrutas.length // devuelve el total de elementos que tenemos en el array, en este caso, devuelve 3\n```\n\n```\nlet i = 0 // el valor que modificaremos en cada iteración es el índice\nwhile (i < frutas.length) { // El índice no puede ser más grande que la candidad de elementos del array\n\tconsole.log(frutas[i]) // Como vimos en "11. Arrays", utilizamos bracket notation para acceder\n\ti += 1 // Incrementamos el valor del índice, para así, en la próxima iteración acceder al siguiente elemento\n}\n```\n\nEl for loop, es idéntico al while, pero estructurado de una mejor forma:\n```\nlet i = 0                   // (1)\nwhile (i < frutas.length) { // (2)\n\tconsole.log(frutas[i])  // (3)\n\ti += 1                  // (4)\n}\n\nfor (___ ; ___ ; ___) {\n\t// codigo a ejecutar\n}\n\nfor (1 ; 2 ; 4) {\n\t3\n}\n\nfor (let i = 0 ; i < frutas.length ; i += 1) {\n\tconsole.log(frutas[i])\n}\n```	LECTURE	t	12	2
11	 Booleans & Others (null, undefined)	En la programación a menudo necesitamos un tipo de dato que represente estos dos estados:\n- YES / NO\n- ON / OFF\n- TRUE / FALSE\n\nEste tipo de dato se llama Boolean y en JavaScript se define por `true` y `false`. Ejemplo:\n```\nconst hoyLlueve = false\nconst sesionIniciada = true\n```\n\nEn JavaScript podemos transformar expresiones a booleano utilizando la función `Boolean( expression )` (fijaros que la primera letra es mayúscula). Ejemplo:\n```\nconst edad = 20\nconst mayorDeEdad = Boolean(20 > 18) // esto devuelve: true\n```\n\nHay varias expresiones que podemos utilizar para obtener Booleans, por ejemplo, como habéis visto, comparando dos números. También podemos comprobar si son el mismo valor:\n```\nconst dineroEnBanco = 900000\nconst eresMillonario = Boolean(dineroEnBanco === 1000000) // usamos triple =\n```\n\nEl operador `===` lo podemos usar también para textos:\n```\nconst mismoNombre = Boolean('Maria' === 'Maria')      // esto devuelve: true\nconst mismaCiudad = Boolean('Barcelona' === 'Madrid') // esto devuelve: false\n```\n\nEs importante saber que `null` y `undefined` siempre representan `false`.\n```\nBoolean(null)      // devuelve: false\nBoolean(undefined) // devuelve: false\n```\n\nAhora que tenéis una idea principal de los booleanos, os puedo comentar un secreto: cuando usamos `<`, `>` o `===` no hace falta utilizar la función `Boolean()` porque una comparación, si lo pensáis, no puede devolver nada más que no sea `cierto`  o `falso`. Ejemplo:\n```\nconst edad = 20\n\n// Son lo mismo\nconst mayorDeEdad = Boolean(20 > 18) \nconst mayorDeEdad = 20 > 18  \n```\n\n#### Operadores && y ||\nA la hora de escribir lógica, estos dos operadores son muy útiles para indicar:\n- "esto Y (AND) esto" `&&`\n- "esto O (OR) esto" `||`\nEjemplos:\n```\nconst dineroSuficiente = true\nconst contratoFijo = false\n\nconst prestamo = dineroSuficiente && contratoFijo\n\n/*\n dineroSuficiente && contratoFijo\n dineroSuficinete Y contratoFijo\n       true       Y    false\n\n Para que esta expresón sea cierta, ambos valores tienen que ser true.\n En nuestro caso, uno es true y el otro false, por lo tanto, va a devolver: false\n*/ \n```\n\nEn caso contrario, con el operador OR, solo hace falta que uno sea cierto.\n```\nconst esGuapo = true\nconst tieneDinero = false\n\nconst triunfaEnLaVida = esGuapo || tieneDinero\n\n// necesitamos que solo uno sea true\n// tenemos un true y un falso, por eso va a devolver: true\n```\n\n#### Operador !\nEl operador `!` nos permite cambiar el estado del booleano, es decir:\n- si es `true`, pasa a `false`\n- si es `false`, pasa a `true`\n\nEjemplos:\n```\nconst estaVivo = true\nconst estaMuerto = !estaVivo\n```\n\nEste operador se utiliza mucho también durante las expresiones dentro de las condicionales, por ejemplo:\n```\n// En este caso, el usuario os podéis imaginar que es null porque todavía estamos esperando\n// los datos de la base de datos y no se ha cargado.\nconst usuario = null // Recordad que null = false\n\nif (!usuario) { // !null = !false = true\n\tconsole.log('Cargando usuario...')\n}\n```	LECTURE	t	7	2
17	Built-in Objects (properties & methods)	\t¡IMPORTANTE! Repasar "9. Functions" y "10. Objects", también tener claros los conceptos de propiedades y métodos. \n\n#### Built-in methods\nPara facilitarnos el trabajo y ahorrarnos tiempo, en JavaScript tenemos un conjunto de funciones ya creadas. Estas funciones se encuentran agrupadas en objetos previamente creados en JavaScript. Estos son: `String, Number, Boolean, Object, Array` (empiezan en mayúscula). Estos se conocen como los "built-in objects", es decir, objectos ya incorporados en JS. Simplemente, para que os hagáis una idea, os podéis imaginar que JS en algún sitio tiene estas declaraciones:\n```\nconst String = {\n\treplace: function(param1, param2) {},\n\tstartsWith: function(param) {},\n\tendsWith: function(param) {},\n\tcharAt: function(param) {},\n\ttrim: function() {},\n\tindexOf: function(param) {},\n\t...\n}\n\nconst Number = {\n\ttoString: function() {}\n}\n\nconst Boolean = {\n\ttoString: function() {},\n\tvalueOf: function() {}\n}\n\nconst Object = {\n\tkeys: function() {},\n\tvalues: function() {},\n\tentries: function() {}\n}\n\nconst Arrays = {\n\tisArray: function(param) {},\n\tforEach: function() {},\n\tmap: function() {},\n\treduce: function() {},\n\tfilter: function() {},\n\tconcat: function() {},\n\treverse: function() {},\n\tpush: function() {},\n\tpop: function() {},\n\tshift: function() {},\n\tunshift: function() {}\n}\n```\n\nFijaros cómo todas las funciones se encuentran dentro de objetos, por ende, pasan a ser métodos de los "built-in" objects.\n\nPor ejemplo, para comprobar si un valor es un array, podemos conseguirlo de la siguiente manera:\n```\nconst data = [1, 2, 3]\nconst esEstoUnArray = Array.isArray(data) // devuelve: true\n\nconst data = 'hola'\nconst esEstoUnArray = Array.isArray(data) // devuelve: false\n```\n\nPara sacar el máximo provecho de estas funciones y hacer el código lo más legible posible, a la hora de definir un valor, según su tipo, automáticamente se heredan todos los métodos del "built-in" object. Además, estos métodos ahora hacen referencia al valor definido. Veámoslo mejor con ejemplos:\n```\nlet data = 'Hola, me llamo John'\n```\n\nObservamos como hemos declarado la variable `data` y la hemos definido con el valor de `Hola, me llamo John`. Tanto la variable como su contenido son de tipo `string`, por lo tanto, automáticamente van a heredar todos los métodos del "built-in" object `String`. Vamos a utilizar algún método:\n```\ndata = data.toUpperCase() // toUpperCase significa: "a mayúscula"\n// va a devolver todo el texto en mayúscula: "HOLA, ME LLAMO JOHN"\n\n// De la misma manera, tenemos el método contrario:\ndata = data.toLowerCase()\n// resultado: "hola, me llamo john"\n```\n\n`toUpperCase()`\n\nVamos a ver en más detalle a qué nos referíamos con la cita "Además, estos métodos ahora hacen referencia al valor definido.". El método `toUpperCase()` como hemos visto antes, es simplemente una función previamente creada y almacenada dentro del objeto `String`. Si las tuviéramos que crear nosotros, sería algo así:\n```\n// DISCLAIMER: No estoy seguro si esta función funciona al 100%, no lo he comprobado, pero lo importante es el concepto...\n// Tampoco hace falta que entendáis la lógica, está escrito simplemente por si tenéis curiosidad.\n\nfunction toUpperCase(value) { // tenemos un parámetro "value" \n\t// Definimos dos arrays, uno para letras mayúsculas y otro para minúsculas.\n\t// Detalle: por ejemplo, para el mismo índice 2, se representa:\n\t// upperCaseLetters[2] -> 'C' mayúscula\n\t// lowerCaseLetters[2] -> 'c' minúscula\n\tconst upperCaseLetters = ['A', 'B', 'C', 'D', ..., 'Z']\n\tconst lowerCaseLetters = ['a', 'b', 'c', 'd', ..., 'z']\n\n\tconst letters = value.split('') // por ejemplo, 'hola' pasa a array ['h', 'o', 'l', 'a']\n\tlet lettersUpperCase = [] // aquí guardaremos todas las letras en mayúscula\n\n\t// hacemos un búcle para iterar sobre cada una de las letras del parámetro value\n\tfor (let i = 0; i < letter.length; i++) {\n\t\tconst letter = letters[i]\n\t\tconst isLetterLowerCase = lowerCaseLetters.includes(letter) // comprobamos si la letra es minúscula\n\t\tif (isLetterLowerCase) {\n\t\t\tconst indexLowerCase = lowerCaseLetters.indexOf(letter) // buscamos en que índice se encuentra la letra \n\t\t\tconst letterUpperCase = upperCaseLetter[indexLowerCase] // usamos el mismo índice para conseguirlo en mayúscula\n\n\t\t\tlettersUpperCase.push(letterUpperCase) // añadimos a array final\n\t\t} else {\n\t\t\t// si no es minúscula, significa que es ya mayúscula u otro caracter, y por eso lo añadimos directamente al array final\n\t\t\tlettersUpperCase.push(letter)\n\t\t}\n\t}\n\n\treturn lettersUpperCase.join('') // Juntamos todos los elementos del array en un texto\n}\n\n\n// Para utilizarlo, hacemos lo siguiente:\ntoUpperCase('hola') // HOLA\ntoUpperCase('heLLo') // HELLO\n```\n\nSi os fijáis, la función tiene un parámetro `value`  y al llamarla, tenemos que pasarle un argumento el cual representa el texto que pasaremos a mayúscula, en este caso, `hola` y `heLLO`. En el caso de los métodos de los "built-in" objects, no hace falta pasar ningún argumento, ya que, como hemos dicho, JS para hacer el código más legible, automáticamente hace referencia al valor. El mismo ejemplo de antes:\n```\n'hola'.toLowerCase() // Fijaros como no pasamos ningún argumento. Directamente, "value" haría referencia a "hola"\n```\n\n#### Built-in properties\nDe la misma manera que los métodos anteriormente vistos, en JavaScript, estos built-in objects, también incluyen propiedades. Estas propiedades las podemos considerar como "metadatos" del valor al que hacen referencia. Por ejemplo, una de las propiedades más usadas es la siguiente:\n```\nconst frutas = ['melon', 'platano', 'apple']\n\nconst _ = frutas.length // nos devuelve el número de elementos dentro del array frutas -> 3 \nconsole.log(_)\n```	LECTURE	t	13	2
\.


--
-- Data for Name: session_progress; Type: TABLE DATA; Schema: courses; Owner: postgres
--

COPY courses.session_progress (session_progress_id, session_id, user_id, is_completed, progress_status) FROM stdin;
1	1	2	t	COMPLETED
2	2	2	t	COMPLETED
3	1	3	t	COMPLETED
\.


--
-- Name: app_user_user_id_seq; Type: SEQUENCE SET; Schema: courses; Owner: postgres
--

SELECT pg_catalog.setval('courses.app_user_user_id_seq', 4, true);


--
-- Name: course_course_id_seq; Type: SEQUENCE SET; Schema: courses; Owner: postgres
--

SELECT pg_catalog.setval('courses.course_course_id_seq', 4, true);


--
-- Name: enrollment_enrollment_id_seq; Type: SEQUENCE SET; Schema: courses; Owner: postgres
--

SELECT pg_catalog.setval('courses.enrollment_enrollment_id_seq', 6, true);


--
-- Name: session_progress_session_progress_id_seq; Type: SEQUENCE SET; Schema: courses; Owner: postgres
--

SELECT pg_catalog.setval('courses.session_progress_session_progress_id_seq', 3, true);


--
-- Name: session_session_id_seq; Type: SEQUENCE SET; Schema: courses; Owner: postgres
--

SELECT pg_catalog.setval('courses.session_session_id_seq', 17, true);


--
-- Name: app_user app_user_pkey; Type: CONSTRAINT; Schema: courses; Owner: postgres
--

ALTER TABLE ONLY courses.app_user
    ADD CONSTRAINT app_user_pkey PRIMARY KEY (user_id);


--
-- Name: app_user app_user_username_key; Type: CONSTRAINT; Schema: courses; Owner: postgres
--

ALTER TABLE ONLY courses.app_user
    ADD CONSTRAINT app_user_username_key UNIQUE (username);


--
-- Name: course course_pkey; Type: CONSTRAINT; Schema: courses; Owner: postgres
--

ALTER TABLE ONLY courses.course
    ADD CONSTRAINT course_pkey PRIMARY KEY (course_id);


--
-- Name: enrollment enrollment_pkey; Type: CONSTRAINT; Schema: courses; Owner: postgres
--

ALTER TABLE ONLY courses.enrollment
    ADD CONSTRAINT enrollment_pkey PRIMARY KEY (enrollment_id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: courses; Owner: postgres
--

ALTER TABLE ONLY courses.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (session_id);


--
-- Name: session_progress session_progress_pkey; Type: CONSTRAINT; Schema: courses; Owner: postgres
--

ALTER TABLE ONLY courses.session_progress
    ADD CONSTRAINT session_progress_pkey PRIMARY KEY (session_progress_id);


--
-- Name: course course_depends_on_fkey; Type: FK CONSTRAINT; Schema: courses; Owner: postgres
--

ALTER TABLE ONLY courses.course
    ADD CONSTRAINT course_depends_on_fkey FOREIGN KEY (depends_on) REFERENCES courses.course(course_id);


--
-- Name: enrollment enrollment_course_id_fkey; Type: FK CONSTRAINT; Schema: courses; Owner: postgres
--

ALTER TABLE ONLY courses.enrollment
    ADD CONSTRAINT enrollment_course_id_fkey FOREIGN KEY (course_id) REFERENCES courses.course(course_id);


--
-- Name: enrollment enrollment_user_id_fkey; Type: FK CONSTRAINT; Schema: courses; Owner: postgres
--

ALTER TABLE ONLY courses.enrollment
    ADD CONSTRAINT enrollment_user_id_fkey FOREIGN KEY (user_id) REFERENCES courses.app_user(user_id);


--
-- Name: notification notification_user_id_fkey; Type: FK CONSTRAINT; Schema: courses; Owner: postgres
--

ALTER TABLE ONLY courses.notification
    ADD CONSTRAINT notification_user_id_fkey FOREIGN KEY (user_id) REFERENCES courses.app_user(user_id);


--
-- Name: session session_course_id_fkey; Type: FK CONSTRAINT; Schema: courses; Owner: postgres
--

ALTER TABLE ONLY courses.session
    ADD CONSTRAINT session_course_id_fkey FOREIGN KEY (course_id) REFERENCES courses.course(course_id);


--
-- Name: session_progress session_progress_session_id_fkey; Type: FK CONSTRAINT; Schema: courses; Owner: postgres
--

ALTER TABLE ONLY courses.session_progress
    ADD CONSTRAINT session_progress_session_id_fkey FOREIGN KEY (session_id) REFERENCES courses.session(session_id);


--
-- Name: session_progress session_progress_user_id_fkey; Type: FK CONSTRAINT; Schema: courses; Owner: postgres
--

ALTER TABLE ONLY courses.session_progress
    ADD CONSTRAINT session_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES courses.app_user(user_id);


--
-- PostgreSQL database dump complete
--

