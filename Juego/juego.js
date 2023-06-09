// --------------------------------------------------------------------------------------------------------------------//
//INTERACCION DEL USUARIO CON EL TABLERO//
// --------------------------------------------------------------------------------------------------------------------//

// Obtener todas las celdas del tablero y el img
const celdas = document.querySelectorAll('.blanco, .marron');
const imagen = document.querySelectorAll('img');

// Convertir las celdas en un array
const celdasArray = Array.from(celdas);

// funcion que pone las celdas a la escucha para que se puedan hacer click
function agregarClickCelda() {
    celdasArray.forEach(celda => {
        celda.addEventListener('click', () => {
            console.log('Celda:', celda.id); /* se muestra en consola la celda a la que se hizo click. Poniendo celda.id,
            me detecta cada una de las id de las celdas del tablero*/
        });
    });
}

// Variable para almacenar la última celda seleccionada
var ultimaCeldaSel = null;

// Resaltar celda al hacer clic en una imagen
function colorCelda(imagen, celda) {
    if (celda && celda.style) {
        celda.style.backgroundColor = '#e45209';

        if (ultimaCeldaSel && ultimaCeldaSel !== celda && ultimaCeldaSel.style) {
            ultimaCeldaSel.style.backgroundColor = '';
        }

        ultimaCeldaSel = celda;

        mostrarMovimientosPosibles(imagen, celda);
    }
}

// Añadir evento de click a cada imagen
function agregarClickImagen() {
    imagen.forEach(imagen => {
        imagen.addEventListener('dragstart', dragstart);
        imagen.addEventListener('click', () => {
            const celda = imagen.closest('td');
            colorCelda(imagen, celda);
            console.log('Imagen', imagen.src)
        });
        imagen.draggable = true; // Habilitar el arrastre de las imágenes
    });
}

// Mostrar círculos en las celdas posibles
function mostrarCirculos(posiblesMovimientos) {
    celdasArray.forEach(celda => {
        const IdCelda = celda.id;
        if (posiblesMovimientos.includes(IdCelda) && !celda.firstChild) {
            const circulo = document.createElement('td');
            circulo.classList.add('circulo');
            celda.appendChild(circulo);
        }
    });
}

// Eliminar los círculos de las celdas anteriores
function eliminarCirculos() {
    document.querySelectorAll('.circulo').forEach(circulo => circulo.remove());
}

//Abiri y cerrar menu del juego
function abrir() {
    var visualizar = document.getElementById('visualizar');

    if (visualizar.style.display === 'block') {
        visualizar.style.display = 'none';
    } else {
        visualizar.style.display = 'block';
    }
}

// --------------------------------------------------------------------------------------------------------------------//
//MOSTRAR LOS POSIBLES MOVIMIENTOS DE TODAS LAS PIEZAS//
// --------------------------------------------------------------------------------------------------------------------//

// Mostrar los movimientos posibles para un peón
function mostrarMovimientosPeon(imagen, celda) {
    const posicionActual = celda.id;
    const filaActual = parseInt(posicionActual.charAt(1));
    const columnaActual = posicionActual.charAt(0);

    const posiblesMovimientos = [];

    if (imagen.src.includes('bP.png')) {
        if (filaActual === 2) {
            // Movimiento inicial del peón negro
            posiblesMovimientos.push(columnaActual + (filaActual + 1));
            posiblesMovimientos.push(columnaActual + (filaActual + 2));
        } else if (filaActual < 8) {
            // Movimiento normal del peón negro
            posiblesMovimientos.push(columnaActual + (filaActual + 1));
        }
    } else if (imagen.src.includes('wP.png')) {
        if (filaActual === 7) {
            // Movimiento inicial del peón blanco
            posiblesMovimientos.push(columnaActual + (filaActual - 1));
            posiblesMovimientos.push(columnaActual + (filaActual - 2));
        } else if (filaActual > 1) {
            // Movimiento normal del peón blanco
            posiblesMovimientos.push(columnaActual + (filaActual - 1));
        }
    }

    eliminarCirculos();
    mostrarCirculos(posiblesMovimientos);
}

// Mostrar los movimientos posibles para un caballo
function mostrarMovimientosCaballo(imagen, celda) {
    // Obtener la posición actual de la celda
    const posicionActual = celda.id;
    const filaActual = parseInt(posicionActual.charAt(1));
    const columnaActual = posicionActual.charAt(0);

    // Array para almacenar las posibles posiciones del caballo
    const posiblesMovimientos = [];

    // Definir los movimientos posibles del caballo [Fila, columna]
    const movimientos = [
        [-2, -1], [-2, 1],
        [-1, -2], [-1, 2],
        [1, -2], [1, 2],
        [2, -1], [2, 1]
    ];

    // Calcular las posibles posiciones del caballo
    movimientos.forEach(movimiento => {
        const fila = filaActual + movimiento[0];
        const columna = String.fromCharCode(columnaActual.charCodeAt(0) + movimiento[1]);
        const IdCelda = columna + fila;

        // Verificar si la posición es válida y existe en el array de celdas
        if (fila >= 1 && fila <= 8 && celdasArray.some(c => c.id === IdCelda)) {
            posiblesMovimientos.push(IdCelda);
        }
    });

    eliminarCirculos();
    mostrarCirculos(posiblesMovimientos);
}

// Función genérica para calcular los movimientos posibles de una pieza
function movTorreAlfil(posicionActual, desplazamientos) {
    const filaActual = parseInt(posicionActual.charAt(1));
    const columnaActual = posicionActual.charAt(0);

    const posiblesMovimientos = [];

    // Recorrer los desplazamientos de la pieza
    for (const desplazamiento of desplazamientos) {
        let fila = filaActual;
        let columna = columnaActual.charCodeAt(0);

        // Iterar mientras el movimiento esté dentro del tablero
        while (true) {
            // Actualizar la posición sumando el desplazamiento
            fila += desplazamiento[0];
            columna += desplazamiento[1];

            // Verificar si la posición está fuera del tablero
            if (fila < 1 || fila > 8 || columna < 97 || columna > 104) {
                break; // Fuera del tablero, no puede seguir moviéndose
            }

            // Construir el ID de la celda actual
            const IdCelda = String.fromCharCode(columna) + fila;

            // Buscar la celda correspondiente en el array de celdas
            const celda = celdasArray.find(c => c.id === IdCelda);

            // Agregar la posición a los posibles movimientos
            posiblesMovimientos.push(IdCelda);

            // Verificar si hay una pieza en la celda actual
            if (celda) {
                if (celda.firstChild) {
                    break; // Se encontró una pieza en el camino, no puede seguir moviéndose
                }
            }
        }
    }

    return posiblesMovimientos;
}

// Mostrar los movimientos posibles para un alfil
function mostrarMovimientosAlfil(imagen, celda) {
    const posicionActual = celda.id;

    const desplazamientosAlfil = [
        [-1, -1], // Movimiento diagonal hacia arriba a la izquierda [Fila, columna]
        [-1, 1],  // Movimiento diagonal hacia arriba a la derecha [Fila, columna]
        [1, -1],  // Movimiento diagonal hacia abajo a la izquierda [Fila, columna]
        [1, 1]    // Movimiento diagonal hacia abajo a la derecha [Fila, columna]
    ];

    const posiblesMovimientos = movTorreAlfil(posicionActual, desplazamientosAlfil);

    eliminarCirculos();
    mostrarCirculos(posiblesMovimientos);

    return posiblesMovimientos; // Devolver los movimientos posibles
}

// Mostrar los movimientos posibles para una torre
function mostrarMovimientosTorre(imagen, celda) {
    const posicionActual = celda.id;

    const desplazamientosTorre = [
        [0, -1], // Movimiento hacia la izquierda [Fila, columna]
        [0, 1],  // Movimiento hacia la derecha [Fila, columna]
        [-1, 0], // Movimiento hacia arriba [Fila, columna]
        [1, 0]   // Movimiento hacia abajo [Fila, columna]
    ];

    const posiblesMovimientos = movTorreAlfil(posicionActual, desplazamientosTorre);

    eliminarCirculos();
    mostrarCirculos(posiblesMovimientos);

    return posiblesMovimientos; // Devolver los movimientos posibles
}

// Mostrar los movimientos posibles para el rey
function mostrarMovimientosRey(imagen, celda) {
    const posicionActual = celda.id;
    const filaActual = parseInt(posicionActual.charAt(1));
    const columnaActual = posicionActual.charAt(0);

    const posiblesMovimientos = [];

    const desplazamientosRey = [
        [-1, 0], [1, 0],
        [0, -1], [0, 1],
        [-1, -1], [-1, 1],
        [1, -1], [1, 1] // Movimientos en dirección vertical, horizontal y diagonal [Fila, columna]
    ];

    // Recorrer los desplazamientos del rey
    for (const desplazamiento of desplazamientosRey) {
        var fila = filaActual;
        var columna = columnaActual.charCodeAt(0);

        // Actualizar la posición sumando el desplazamiento
        fila += desplazamiento[0];
        columna += desplazamiento[1];

        // Verificar si la posición está dentro del tablero
        if (fila >= 1 && fila <= 8 && columna >= 97 && columna <= 104) {
            // Construir el ID de la celda actual
            const IdCelda = String.fromCharCode(columna) + fila;

            // Buscar la celda correspondiente en el array de celdas
            const celda = celdasArray.find(c => c.id === IdCelda);

            // Verificar si no hay una pieza en la celda actual
            if (celda && !celda.firstChild) {
                // Agregar la posición a los posibles movimientos
                posiblesMovimientos.push(IdCelda);
            }
        }
    }

    eliminarCirculos();
    mostrarCirculos(posiblesMovimientos);
}

// Mostrar los movimientos posibles para la reina
function mostrarMovimientosReina(imagen, celda) {
    const posiblesMovimientos = [];

    // Movimientos del alfil
    const movimientosAlfil = mostrarMovimientosAlfil(imagen, celda);
    posiblesMovimientos.push(...movimientosAlfil);

    // Movimientos de la torre
    const movimientosTorre = mostrarMovimientosTorre(imagen, celda);
    posiblesMovimientos.push(...movimientosTorre);

    eliminarCirculos();
    mostrarCirculos(posiblesMovimientos);
}

// Mostrar los movimientos posibles según la pieza seleccionada
function mostrarMovimientosPosibles(imagen, celda) {
    eliminarCirculos();

    if (imagen.src.includes('wP.png') || imagen.src.includes('bP.png')) {
        return mostrarMovimientosPeon(imagen, celda);
    } else if (imagen.src.includes('wN.png') || imagen.src.includes('bN.png')) {
        return mostrarMovimientosCaballo(imagen, celda);
    } else if (imagen.src.includes('wB.png') || imagen.src.includes('bB.png')) {
        return mostrarMovimientosAlfil(imagen, celda);
    } else if (imagen.src.includes('wR.png') || imagen.src.includes('bR.png')) {
        return mostrarMovimientosTorre(imagen, celda);
    } else if (imagen.src.includes('wQ.png') || imagen.src.includes('bQ.png')) {
        return mostrarMovimientosReina(imagen, celda);
    } else if (imagen.src.includes('wK.png') || imagen.src.includes('bK.png')) {
        return mostrarMovimientosRey(imagen, celda);
    }
}

// --------------------------------------------------------------------------------------------------------------------//
//MOVER LAS PIEZAS POR EL TABLERO USANDO DRAG AND DROP//
// --------------------------------------------------------------------------------------------------------------------//
const piezas = document.querySelector('.pieza');
const celda = document.querySelectorAll('.celda');

// Agrega un event listener para el evento 'dragstart' al elemento 'piezas'
piezas.addEventListener('dragstart', dragstart);

// Itera sobre cada elemento 'celda'
celda.forEach(c => {
    // Agrega un event listener para dragStart, drop y dragOver
    c.addEventListener('dragstart', dragstart);
    c.addEventListener('drop', drop);
    c.addEventListener('dragover', dragover);
});

// Función que se ejecuta cuando se inicia el arrastre del elemento 'piezas'
function dragstart(e) {
    const celdaOrigenId = e.target.parentNode.id;
    e.dataTransfer.setData('text/plain', celdaOrigenId);
}

function drop(event) {
    event.preventDefault();

    // Variable para el sonido de las piezas cuando ocurra un drop de una pieza sobre una celda
    const audio = document.getElementById('sonido');
    audio.volume = 0.4;

    // *Documentar en un txt como funciona
    const celdaOrigenId = event.dataTransfer.getData('text/plain');
    const celdaOrigen = document.getElementById(celdaOrigenId);
    const pieza = celdaOrigen.querySelector('img');

    if (pieza) {
        const celdaDestino = event.currentTarget;
        moverPieza(pieza, celdaDestino);

        // Cambiar mensaje del chat de texto
        document.getElementById('titulo').innerHTML = 'Juego en marcha';
        document.getElementById('movimientos').innerHTML = 'El movimiento realizado fue de ' + celdaOrigenId + ' hacia ' + celdaDestino.id + '.';

        // Iniciar el audio de las piezas al hacer drop
        audio.play();

        // Verificar si ha ocurrido un jaque mate
        jaqueMate(pieza);
    }

    eliminarCirculos();
}

// variable de turno
let turno = 'negras';

// Funcion que sirve para verificar los turnos de las piezas y los ataques de cada una de estas 
function moverPieza(pieza, destinoCelda) {
    const destinoPieza = destinoCelda.querySelector('img');
    const piezasBlancas = blancas(pieza.src);
    const piezasNegras = negras(pieza.src);

    if ((piezasBlancas && turno !== 'blancas') || (piezasNegras && turno !== 'negras')) {
        return; // Evitar que las piezas se muevan cuando no es su turno
    }

    if (destinoPieza) {
        const mismoColor = (piezasBlancas && blancas(destinoPieza.src)) || (piezasNegras && negras(destinoPieza.src));
        if (mismoColor) {
            return; // Evitar que una imagen del mismo color se sobreponga en la misma celda
        }

        /* const mismoColor = (piezasBlancas && blancas(destinoPieza.src)) || (piezasNegras && negras(destinoPieza.src));
            if (destinoPieza && mismoColor){
                return;
            } */

        const destinoBlancas = blancas(destinoPieza.src);
        const destinoNegras = negras(destinoPieza.src);

        if ((piezasBlancas && destinoNegras) || (piezasNegras && destinoBlancas)) {
            destinoCelda.removeChild(destinoPieza); // Si la condicion se cumple, se sustituye la pieza antigua por la nueva
        }
    }

    destinoCelda.appendChild(pieza); // esto agrega la pieza correctamente a la celda destino (destino celda)
    mostrarMovimientosPosibles(pieza, destinoCelda); // se resaltan los movimientos llamando a la funcion

    turno = (turno === 'negras') ? 'blancas' : 'negras'; // se cambia el turno de las piezas
    //Si el turno actual es negras, se cambia a blancas, y asi sucesivamente

    iniciarContador();
}

function blancas(src) {
    return src.includes('w');
}

function negras(src) {
    return src.includes('b');
}

// Función que se ejecuta cuando se arrastra un elemento sobre una 'celda'
function dragover(e) {
    e.preventDefault();
}

// --------------------------------------------------------------------------------------------------------------------//
//COUNTDOWN DEL JUEGO//
// --------------------------------------------------------------------------------------------------------------------//

// variables del countdown
var duracionTurno = 300; // Duración del turno en segundos
var intervaloContador; // Referencia al intervalo del contador
var contador; // Elemento donde se muestra el contador
var countdown1 = 300;
var countdown2 = 300;

// Función para iniciar el contador
function iniciarContador() {
    var duracionTurno = (turno === 'negras' ? countdown1 : countdown2); // Obtener el tiempo restante según el turno
    contador = document.getElementById(turno === 'negras' ? 'countdown1' : 'countdown2'); // Obtener el elemento del contador según el turno

    detenerContadores(); // Limpiar el intervalo anterior

    intervaloContador = setInterval(function () {
        // Resta un segundo a la duración del turno
        duracionTurno--;

        // Almacena el tiempo restante actualizado en la variable correspondiente
        if (turno === 'negras') {
            countdown1 = duracionTurno;
        } else if (turno === 'blancas') {
            countdown2 = duracionTurno;
        }

        // Calcula los minutos y segundos restantes
        var minutos = Math.floor(duracionTurno / 60);
        var segundos = duracionTurno % 60;

        // Actualiza el contenido del contador
        contador.innerHTML = minutos.toString().padStart(2, "0") + ":" + segundos.toString().padStart(2, "0");

        // Detiene el contador cuando el tiempo llega a cero
        if (duracionTurno <= 0) {
            detenerContadores();
            // Aquí puedes realizar cualquier acción adicional cuando se agota el tiempo del turno
        }
    }, 1000);
}

// Función para detener los contadores
function detenerContadores() {
    clearInterval(intervaloContador);
}

// --------------------------------------------------------------------------------------------------------------------//
//FUNCION PARA EL JAQUE MATE QUE HAGA QUE SE PARE LOS COUNTDOWN //
// Y SE MUESTRE UN MENSAJE //
// --------------------------------------------------------------------------------------------------------------------//

let reyBlancoCapturado = false;
let reyNegroCapturado = false;

function jaqueMate(pieza) {
    const esBlanca = blancas(pieza.src);
    const esNegra = negras(pieza.src);
    const reyContrario = esBlanca ? 'bK.png' : 'wK.png';
    const todasLasPiezas = document.querySelectorAll('.pieza');

    // Comprobar si el rey contrario está en jaque mate
    let jaqueMate = true;

    for (const pieza of todasLasPiezas) {
        if (pieza.src && pieza.src.includes(reyContrario)) { // Check if pieza.src is defined
            const celda = pieza.parentNode;
            const movimientosPosibles = [mostrarMovimientosPosibles(pieza, celda)];
            // Verificar si el rey contrario tiene al menos un movimiento posible
            if (movimientosPosibles.length > 0) {
                jaqueMate = false;
                break; // Salir del bucle, ya que no hay jaque mate
            }
        }
    }

    if (jaqueMate) {
        reyNegroCapturado = esBlanca;
        reyBlancoCapturado = esNegra;
        mostraMensaje();
        detenerContadores();
    }
}


function mostraMensaje() {

    document.getElementById('mensaje_victoria').style.display = 'block';
    const ganador = document.getElementById('ganador');

    if (reyNegroCapturado) {
        ganador.textContent = "El ganador ha sido el jugador 2 ";
        document.getElementById('imagen2').style.display = 'block';
        document.getElementById('imagen1').style.display = 'none';

    } else if (reyBlancoCapturado) {
        ganador.textContent = "El ganador ha sido el jugador 1 ";
        document.getElementById('imagen1').style.display = 'block';
        document.getElementById('imagen2').style.display = 'none';

    }
}

function guia() {
    //recoger todas las ID
    const guiaPiezas = document.getElementById('guia_piezas');
    const imagenPieza = document.getElementById('imagen');
    const explicacion = document.getElementById('explicacion');
    const nombrePieza = document.getElementById('pieza');
    const botonCerrar = document.getElementById('botonCerrar');
    const imagenMovimientos = document.getElementById('imagenMovimiento');

    //Obtenemos los datos de las cajas
    const caja = event.target.closest('.caja');
    const imgSrc = caja.querySelector('img').getAttribute('src');
    const movimientotxt = caja.querySelector('p').innerHTML;

    /*Establecemos variables vacias tipo let ya que serán modificadas donde se escribirá y 
    se pondrá el movimiento y la imagen de movimientos de cada pieza*/
    let explicacionPieza1 = '';
    let explicacionPieza2 = '';
    let imagenMov = '';

    if (movimientotxt === 'Movimientos del Peon') {
        explicacionPieza1 = "Desde su posición inicial, el peón podrá moverse dos casillas al frente y desde una posicion no inicial solo una casilla"
        explicacionPieza2 = "*El peón podrá atacar moviéndose una celda de forma diagonal hacia al frente";
        imagenMov = 'img/movimientosPeon.png';
    } else if (movimientotxt === 'Movimientos del Caballo') {
        explicacionPieza1 = "El caballo se mueve en forma de L: 2 casillas en dirección horizontal o vertical y después 1 casilla más en ángulo recto."
        imagenMov = 'img/movimientosCaballo.png';
    } else if (movimientotxt === 'Movimientos del Alfil') {
        explicacionPieza1 = "Se mueve sobre el tablero en una línea recta diagonal. Se puede mover tantas casillas como se quiera, hasta que se encuentre con el final del tablero o con otra pieza"
        imagenMov = 'img/movimientosAlfil.png';
    } else if (movimientotxt === 'Movimientos de la Torre') {
        explicacionPieza1 = "Se mueve sobre el tablero en una línea recta. Se puede mover tantas casillas como se quiera, hasta que se encuentre con el final del tablero o con otra pieza"
        imagenMov = 'img/movimientosTorre.png';
    } else if (movimientotxt === 'Movimientos del Rey') {
        explicacionPieza1 = "Puede moverse a cualquier casilla adyacente, es decir, se puede mover una casilla en cualquier dirección: horizontal, vertical o diagonal"
        imagenMov = 'img/movimientosRey.png';
    } else if (movimientotxt === 'Movimientos de la Reina') {
        explicacionPieza1 = "La reina se mueve como la torre y el alfil juntos. Se puede mover tantas casillas como se quiera, hasta que se encuentre con el final del tablero o con otra pieza"
        imagenMov = 'img/movimientosReina.png';
    }

    //Actualizamos la nueva informacion
    imagenPieza.src = imgSrc;
    explicacion.innerHTML = explicacionPieza1 + "<br>" + explicacionPieza2;
    nombrePieza.innerHTML = movimientotxt;
    imagenMovimientos.src = imagenMov;
    guiaPiezas.style.display = 'block';

    //Ponemos el boton a la escucha para que cuando se haga click sobre este se cierre la guia
    botonCerrar.addEventListener('click', function () {
        guiaPiezas.style.display = 'none';
    });
}

// --------------------------------------------------------------------------------------------------------------------//
//INICIAR LAS FUNCIONES DE CLICKCELDA Y CLICKIMAGEN//
//E INICIAR EL JUEGO Y EL CONTADOR//
// --------------------------------------------------------------------------------------------------------------------//

// Función principal para inicializar el juego y dentro las funciones de click celda y agregar click imagen
function iniciarJuego() {
    agregarClickCelda();
    agregarClickImagen();
}

// Iniciar el juego
iniciarJuego();
// Inicia el contador al cargar la página
iniciarContador();

