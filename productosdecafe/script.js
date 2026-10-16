// Precios y datos de productos
const precios = {
    "Pupusa": 0.75,
    "Hamburguesa": 2.50,
    "Pizza": 2.00,
    "Taco": 1.50,
    "Jugo": 1.00,
    "Agua": 0.75
};

// Arreglo para almacenar los pedidos en memoria antes de descargar
let registrosTxt = [];
let contadorPedidos = 1;

function realizarPedido() {
    const cliente = document.getElementById('cliente').value;
    const producto = document.getElementById('producto').value;
    const cantidad = parseInt(document.getElementById('cantidad').value);
    const metodoPago = document.querySelector('input[name="pago"]:checked').value;

    if (!cliente || cantidad < 1) {
        alert("Por favor, ingresa un nombre y una cantidad válida.");
        return;
    }

    // 3. Cálculo de Subtotal
    const precio = precios[producto];
    const subtotal = precio * cantidad;

    // 4. Promoción (10% si cantidad >= 5)
    let descuento = 0;
    if (cantidad >= 5) {
        descuento = subtotal * 0.10;
    }

    const total = subtotal - descuento;
    
    // Generar código de pedido (ej: 001)
    const codigo = contadorPedidos.toString().padStart(3, '0');
    
    // 5. Crear el registro para el TXT
    const lineaTxt = `${codigo}|${cliente}|${producto}|${cantidad}|${precio.toFixed(2)}|${subtotal.toFixed(2)}|${descuento.toFixed(2)}|${total.toFixed(2)}|${metodoPago}`;
    registrosTxt.push(lineaTxt);
    contadorPedidos++;

    // 6. Mostrar el pedido en pantalla
    const recibo = document.getElementById('recibo');
    recibo.classList.remove('hidden');
    recibo.innerHTML = `══════════════════════════════\nPEDIDO REGISTRADO\n══════════════════════════════\nCliente: ${cliente}\nProducto: ${producto}\nCantidad: ${cantidad}\nSubtotal: $${subtotal.toFixed(2)}\nDescuento: $${descuento.toFixed(2)}\nTOTAL: $${total.toFixed(2)}\nPago: ${metodoPago}\n══════════════════════════════`;
}

// Función para descargar el archivo pedidos.txt
function descargarTXT() {
    if (registrosTxt.length === 0) {
        alert("No hay pedidos registrados para guardar.");
        return;
    }
    const contenido = registrosTxt.join('\n');
    const blob = new Blob([contenido], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pedidos.txt';
    a.click();
    
    URL.revokeObjectURL(url);
}

// 7. Consultar pedidos y ⭐ Reto adicional
function cargarPedidos(event) {
    const archivo = event.target.files[0];
    if (!archivo) return;

    const lector = new FileReader();
    lector.onload = function(e) {
        const contenido = e.target.result;
        const lineas = contenido.split('\n');
        
        const tbody = document.getElementById('cuerpo-tabla');
        tbody.innerHTML = ''; // Limpiar tabla
        
        let totalVentas = 0;
        let totalPedidos = 0;

        lineas.forEach(linea => {
            if (linea.trim() === '') return;
            
            // Separar datos por el delimitador "|"
            const datos = linea.split('|');
            // datos = [Código, Cliente, Producto, Cantidad, Precio, Subtotal, Descuento, Total, Pago]
            
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${datos[0]}</td>
                <td>${datos[1]}</td>
                <td>${datos[2]}</td>
                <td>${datos[3]}</td>
                <td>$${datos[7]}</td>
            `;
            tbody.appendChild(tr);

            // Sumar para el reto adicional
            totalVentas += parseFloat(datos[7]);
            totalPedidos++;
        });

        // Mostrar tabla y resumen
        document.getElementById('tabla-container').classList.remove('hidden');
        
        const resumen = document.getElementById('resumen-ventas');
        resumen.innerHTML = `══════════════════════════\nRESUMEN DE VENTAS\n══════════════════════════\nPedidos: ${totalPedidos}\nVentas:\n$${totalVentas.toFixed(2)}`;
    };

    lector.readAsText(archivo);
}