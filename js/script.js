const mailLogin = document.getElementById('emailLogin'),
    passLogin = document.getElementById('passwordLogin'),
    recordar = document.getElementById('recordarme'),
    btnLogin = document.getElementById('login'),
    modalEl = document.getElementById('modalLogin'),
    modal = new bootstrap.Modal(modalEl),
    contTarjetas = document.getElementById('tarjetas'),
    toggles = document.querySelectorAll('.toggles'),
    cards = document.getElementById('cards'),
    items = document.getElementById('items'),
    footer = document.getElementById('footer'),
    templateTarjetas = document.getElementById('templateTarjetas').content,
    templateFooter=document.getElementById('template-footer').content,
    templateCarrito=document.getElementById('template-carrito').content,
    fragment=document.createDocumentFragment();

document.addEventListener('DOMContentLoaded', () => {
    fetchData()
})
cards.addEventListener('click',e=>{
    agregarCarrito(e)
})
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



function cargarCatalogoDeArchivoJson() {
    const catalogoJson = `.js/data.json`;

    fetch(catalogoJson)
        .then((respuesta) => respuesta.json())
        .then((datos) => {


            datos.forEach((producto) => {
                listaStock.push(producto);
            });
        })
}


const fetchData=async()=>{
    try {
        const respuesta = await fetch('./js/data.json');
        const data = await respuesta.json();
        crearCards(data)
    } catch (error) {
        console.log(error)
    }
}

let carrito = []

const crearCards = data => {
    data.forEach(producto => {
        
        templateTarjetas.querySelector('h5').textContent = `${producto.nombre} "${producto.marca}"`
        templateTarjetas.getElementById('categoria').textContent =`${producto.categoria}`
        templateTarjetas.getElementById('precio').textContent =`$ ${producto.precio}`
        templateTarjetas.getElementById('edad').textContent =`Para: ${producto.edad}`
        templateTarjetas.getElementById('peso').textContent =`Peso neto: ${producto.peso}`
        templateTarjetas.querySelector('img').setAttribute("src",producto.pic)
        templateTarjetas.querySelector('.btn-dark').dataset.id= producto.id

        const clone = templateTarjetas.cloneNode(true)
        fragment.appendChild(clone)

    })
    cards.appendChild(fragment)

}

const agregarCarrito = e => {

    if(e.target.classList.contains('btn-dark')){
        progCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}

const progCarrito = objeto =>{
    const producto= {
        id: objeto.querySelector('.btn-dark').dataset.id,
        nombre: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('#precio').textContent,
        cantidad: 1
    }
    if(carrito.hasOwnProperty(producto.id)){
        producto.cantidad= carrito[producto.id].cantidad + 1
    }

    carrito[producto.id]={...producto}
    crearCarrito()
}

const crearCarrito = ()=>{
    items.innerHTML=''
    Object.values(carrito).forEach(producto =>{
        templateCarrito.querySelector('th').textContent =producto.id
        templateCarrito.querySelector('#nameCarrito').textContent=producto.nombre
        templateCarrito.querySelector('#cantCarrito').textContent=producto.cantidad
        templateCarrito.querySelector('#precioUCarrito').textContent=producto.precio
        templateCarrito.querySelector('#precioTotalCarrito').textContent= producto.cantidad*producto.precio
        
        templateCarrito.querySelector('.btn-info').dataset.id= producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id= producto.id
        
        const clone= templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    
    items.appendChild(fragment)
    
}


