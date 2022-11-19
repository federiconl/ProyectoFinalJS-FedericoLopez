//Constantes generales.//
const mailLogin = document.getElementById('emailLogin'),
    passLogin = document.getElementById('passwordLogin'),
    recordar = document.getElementById('recordarme'),
    btnLogin = document.getElementById('login'),
    modalEl = document.getElementById('modalLogin'),
    modal = new bootstrap.Modal(modalEl),
    toggles = document.querySelectorAll('.toggles'),
    cards = document.getElementById('cards'),
    items = document.getElementById('items'),
    footer = document.getElementById('footer'),
    templateTarjetas = document.getElementById('templateTarjetas').content,
    templateFooter = document.getElementById('template-footer').content,
    templateCarrito = document.getElementById('template-carrito').content,
    fragment = document.createDocumentFragment();


// Eventos generales.//
document.addEventListener('DOMContentLoaded', () => {
    fetchData()
})
cards.addEventListener('click', e => {
    agregarCarrito(e)
})

items.addEventListener('click',e =>{
    btnSumaResta(e)

})

// Usuarios para el login//
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

//Inicio de sesion del usuario//
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

//Traer los productos del data.json//

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


const fetchData = async () => {
    try {
        const respuesta = await fetch('./js/data.json');
        const data = await respuesta.json();
        crearCards(data)
    } catch (error) {
        console.log(error)
    }
}

//Crear el html del data.json//
const crearCards = data => {
    data.forEach(producto => {

        templateTarjetas.querySelector('h5').textContent = `${producto.nombre} "${producto.marca}"`
        templateTarjetas.getElementById('categoria').textContent = `${producto.categoria}`
        templateTarjetas.getElementById('precio').textContent = ` ${producto.precio}`
        templateTarjetas.getElementById('edad').textContent = `Para: ${producto.edad}`
        templateTarjetas.getElementById('peso').textContent = `Peso neto: ${producto.peso}`
        templateTarjetas.querySelector('img').setAttribute("src", producto.pic)
        templateTarjetas.querySelector('.btn-dark').dataset.id = producto.id

        const clone = templateTarjetas.cloneNode(true)
        fragment.appendChild(clone)

    })
    cards.appendChild(fragment)

}

//Carrito de compras//
let carrito = []
const agregarCarrito = e => {

    if (e.target.classList.contains('btn-dark')) {
        progCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}

const progCarrito = objeto => {
    const producto = {
        id: objeto.querySelector('.btn-dark').dataset.id,
        nombre: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('#precio').textContent,
        cantidad: 1
    }
    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    }

    carrito[producto.id] = { ...producto }
    crearCarrito()
}


const crearCarrito = () => {
    items.innerHTML = ''
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelector('#nameCarrito').textContent = producto.nombre
        templateCarrito.querySelector('#cantCarrito').textContent = producto.cantidad
        templateCarrito.querySelector('#precioUCarrito').textContent = producto.precio
        templateCarrito.querySelector('#precioTotalCarrito').textContent = producto.precio * producto.cantidad

        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })

    items.appendChild(fragment)

    crearFooter()

    localStorage.setItem('carrito', JSON.stringify(carrito))
}

const crearFooter = () => {
    footer.innerHTML = ''
    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = `<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>`
        return
    }

    const tCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)
    const tPrecio = Object.values(carrito).reduce((acc, { cantidad, precio }) => acc + cantidad * precio, 0)

    templateFooter.getElementById('templateFooterCant').textContent = tCantidad
    templateFooter.getElementById('templateFooterPrecio').textContent = tPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)

    footer.appendChild(fragment)

    const btnVaciar=document.getElementById('vaciarCarrito');
    const btnFinalizar=document.getElementById('finalizarCompra')
   
    btnVaciar.addEventListener('click',()=>{
        carrito = [];
        crearCarrito();
    })

    btnFinalizar.addEventListener('click',()=>{
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: 'btn btn-success ms-2',
              cancelButton: 'btn btn-danger me-2'
            },
            buttonsStyling: false
          })
          
          swalWithBootstrapButtons.fire({
            title: '¿Deseas finalizar tu compra?',
            text: `El precio final de tu compra es $ ${tPrecio}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Si, finalizar.',
            cancelButtonText: 'No, seguir comprando',
            reverseButtons: true
          }).then((result) => {
            if (result.isConfirmed) {
              swalWithBootstrapButtons.fire(
                'Felicitaciones!',
                'Tu compra se ha realizado con exito',
                'success'
              )
              carrito = [];
              crearCarrito();
              
            } 
          })
    })

    
}

const btnSumaResta = e =>{
    if (e.target.classList.contains('btnSumar')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = { ...producto }
        crearCarrito()
    }

    if (e.target.classList.contains('btnRestar')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
        } else {
            carrito[e.target.dataset.id] = {...producto}
        }
        crearCarrito()
    }
}



