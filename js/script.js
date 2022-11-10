const mailLogin = document.getElementById('emailLogin'),
    passLogin = document.getElementById('passwordLogin'),
    recordar = document.getElementById('recordarme'),
    btnLogin = document.getElementById('login'),
    modalEl = document.getElementById('modalLogin'),
    modal = new bootstrap.Modal(modalEl),
    contTarjetas = document.getElementById('tarjetas'),
    toggles = document.querySelectorAll('.toggles');
const usuarios = [{
    nombre: 'Agustina',
    mail: 'agus.nieto@mail.com',
    pass: 'berlin'
},
{
    nombre: 'Cecilia',
    mail: 'ceci.ln@mail.com',
    pass: '310598!'
},
{
    nombre: 'Rodolfo',
    mail: 'rodoyo@mail.com',
    pass: 'crovarabasquet'
}]


function cargarCatalogoDeArchivoJson() {
    const catalogoJson = `.js/data.json`;

    fetch(catalogoJson)
        .then((respuesta) => respuesta.json()) //Respuesta del servidor
        .then((datos) => {
            console.log("Catalogo de Archivo JSON Cargando...");

            datos.forEach((producto) => {
                listaStock.push(producto);
            });
        })

        .finally(() => {
            console.log("Carga Finalizada...");
            console.log(listaStock);
        });
}

let carrito = []
function crearHTML(productos) {
    contTarjetas.innerHTML = '';
    productos.forEach((prod) => {
        const tarjeta = `<div class="card" style="width: 18rem;" id="card ${prod.nombre}">
        <img src="${prod.pic}" class="card-img-top" alt="${prod.nombre}">
        <div class="card-body">
                 <h5 class="card-title">${prod.nombre}</h5>
                 <p class="card-text">${prod.categoria} ${prod.edad}. Marca: ${prod.marca}</p>
               </div>
               <ul class="list-group list-group-flush">
                 <li class="list-group-item">Peso: ${prod.peso}</li>
                 <li class="list-group-item">Precio: $ ${prod.precio}</li>
                 <li class="list-group-item">Valoracion: ${prod.valoracion} puntos.</li>
               </ul>
               <button class="btn btn-primary " type="submit" id="sumaCarrito">Añadir al carrito</button>
               
             </div> `;
        contTarjetas.innerHTML += tarjeta;

        

    })
   
}

const comprar = document.getElementById('sumaCarrito');
comprar.addEventListener('click',(e)=>{
    e.preventDefault()
    carrito.push({
        id: prod.id,
        img: prod.pic,
        nombre: prod.nombre,
        precio: prod.precio,
    });
    console(carrito)
});



async function bringData() {
    const respuesta = await fetch('./js/data.json');
    const datos = await respuesta.json();

    console.log(datos)

    crearHTML(datos);
}


bringData();



function validarUsuario(usersDB, user, pass) {
    let encontrado = usersDB.find((userDB) => userDB.mail == user);

    if (typeof encontrado === 'undefined') {
        return false;
    } else {
        if (encontrado.pass != pass) {
            return false;
        } else {
            return encontrado;
        }
    }
}

function guardarDatos(usuarioDB, storage) {

    const usuario = {
        "name": usuarioDB.nombre,
        "mail": usuarioDB.mail,
        "pass": usuarioDB.pass
    }
    storage.setItem("usuario", JSON.stringify(usuario))
}


function saludar(usuario) {
    nombreUsuario.innerHTML = `Bienvenido/a, <span>${usuario.name}</span>`
}

function limpiarDatos() {
    localStorage.clear();
    sessionStorage.clear()
}

function recuperarUsuario(storage) {
    let usuarioEnStorage = JSON.parse(storage.getItem('usuario'))
    return usuarioEnStorage;
}

function estaLogueado(usuario) {

    if (usuario) {
        saludar(usuario);
        cambiarInfo(toggles, "d-none");

    }

}

function cambiarInfo(array, clase) {
    array.forEach(element => {
        element.classList.toggle(clase);
    });

}


btnLogin.addEventListener('click', (e) => {
    e.preventDefault();

    if (!mailLogin.value || !passLogin.value) {
        Swal.fire({
            icon: 'warning',
            title: 'Hubo un error',
            text: '¡Todos los campos son requeridos!',
        })
    } else {

        let data = validarUsuario(usuarios, mailLogin.value, passLogin.value)

        if (!data) {
            Swal.fire({
                icon: 'error',
                title: 'Usuario y/o contraseña erróneos',
                text: 'Por favor, ingresar el usuario y la contraseña correctamente.',
            })

        } else {

            if (recordar.checked) {
                guardarDatos(data, localStorage);
                saludar(recuperarUsuario(localStorage));
            } else {
                guardarDatos(data, sessionStorage);
                saludar(recuperarUsuario(sessionStorage));
            }

            modal.hide();
            cambiarInfo(toggles, 'd-none');
        }

    }
});

btnLogout.addEventListener('click', () => {
    limpiarDatos();
    cambiarInfo(toggles, 'd-none');
});


window.onload = () => estaLogueado(recuperarUsuario(localStorage));


