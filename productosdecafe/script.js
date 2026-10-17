// Precios y datos de productos
const precios = {
    "Pupusa": 0.75,
    "Hamburguesa": 2.50,
    "Pizza": 2.00,
    "Taco": 1.50,
    "Jugo": 1.00,
    "Agua": 0.75
};

let registrosTxt = [];
let contadorPedidos = 1;

function formatearMoneda(valor) {
    return Number(valor).toFixed(2);
}

function realizarPedido() {
    const cliente = document.getElementById('cliente').value.trim();
    const producto = document.getElementById('producto').value;
    const cantidad = parseInt(document.getElementById('cantidad').value, 10);
    const metodoPago = document.querySelector('input[name="pago"]:checked')?.value || 'Efectivo';

    if (!cliente || Number.isNaN(cantidad) || cantidad < 1) {
        alert('Por favor, ingresa un nombre y una cantidad válida.');
        return;
    }

    const precio = precios[producto];
    const subtotal = precio * cantidad;

    let descuento = 0;
    if (cantidad >= 5) {
        descuento = subtotal * 0.10;
    }

    const total = subtotal - descuento;
    const codigo = contadorPedidos.toString().padStart(3, '0');

    const lineaTxt = [
        codigo,
        cliente,
        producto,
        cantidad,
        formatearMoneda(precio),
        formatearMoneda(subtotal),
        formatearMoneda(descuento),
        formatearMoneda(total),
        metodoPago
    ].join('|');

    registrosTxt.push(lineaTxt);
    contadorPedidos++;

    const recibo = document.getElementById('recibo');
    recibo.classList.remove('hidden');
    recibo.textContent = `══════════════════════════════
PEDIDO REGISTRADO
══════════════════════════════
Código: ${codigo}
Cliente: ${cliente}
Producto: ${producto}
Cantidad: ${cantidad}
Precio unit.: $${formatearMoneda(precio)}
Subtotal: $${formatearMoneda(subtotal)}
Descuento: $${formatearMoneda(descuento)}
Total: $${formatearMoneda(total)}
Pago: ${metodoPago}
══════════════════════════════`;
}

function descargarTXT() {
    if (registrosTxt.length === 0) {
        alert('No hay pedidos registrados para guardar.');
        return;
    }

    const contenido = registrosTxt.join('\n');
    const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = 'pedidos.txt';
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();

    URL.revokeObjectURL(url);
}

function cargarPedidos(event) {
    const archivo = event.target.files[0];
    if (!archivo) return;

    const lector = new FileReader();
    lector.onload = function (e) {
        const contenido = e.target.result;
        const lineas = contenido.split('\n');

        const tbody = document.getElementById('cuerpo-tabla');
        tbody.innerHTML = '';

        let totalVentas = 0;
        let totalPedidos = 0;

        lineas.forEach((linea) => {
            const texto = linea.trim();
            if (texto === '') return;

            const datos = texto.split('|');
            if (datos.length < 8) return;

            const codigo = datos[0];
            const cliente = datos[1];
            const producto = datos[2];
            const cantidad = datos[3];
            const total = parseFloat(datos[7]) || 0;

            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${codigo}</td>
                <td>${cliente}</td>
                <td>${producto}</td>
                <td>${cantidad}</td>
                <td>$${formatearMoneda(total)}</td>
            `;
            tbody.appendChild(fila);

            totalVentas += total;
            totalPedidos++;
        });

        document.getElementById('tabla-container').classList.remove('hidden');

        const resumen = document.getElementById('resumen-ventas');
        resumen.textContent = `══════════════════════════
RESUMEN DE VENTAS
══════════════════════════
Total de pedidos: ${totalPedidos}
Total recaudado: $${formatearMoneda(totalVentas)}
══════════════════════════`;
    };

    lector.readAsText(archivo, 'UTF-8');
}
