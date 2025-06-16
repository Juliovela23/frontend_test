<template>
  <div class="w-full max-w-4xl mx-auto mt-10 bg-[#c9d7e6] rounded-xl p-6 shadow">
    <!-- Título -->
    <div class="text-lg font-medium text-[#15385c] mb-2">Historial Crediticio</div>
    
    <!-- Datos superiores -->
    <div class="flex flex-wrap text-[14px] mb-2 gap-x-10 gap-y-1">
      <span><span class="font-semibold">Código cliente:</span> 00-0000000</span>
      <span><span class="font-semibold">Nombre del cliente:</span> Julio Isabel Vela Flores</span>
    </div>
    <div class="flex flex-wrap text-[14px] mb-3 gap-x-10 gap-y-1">
      <span><span class="font-semibold">CUI cliente:</span> 0000-00000-0000</span>
      <span><span class="font-semibold">Dirección cliente:</span> Acatenango, Chimaltenango</span>
    </div>

    <!-- Tabla -->
    <div class="bg-white rounded shadow border overflow-x-auto">
      <table class="min-w-full text-[13px]">
        <thead>
          <tr class="bg-[#093462] text-white">
            <th class="px-2 py-1 font-semibold border">Crédito</th>
            <th class="px-2 py-1 font-semibold border">Estado</th>
            <th class="px-2 py-1 font-semibold border">Ciclo</th>
            <th class="px-2 py-1 font-semibold border">Sector</th>
            <th class="px-2 py-1 font-semibold border">Vigente</th>
            <th class="px-2 py-1 font-semibold border">Vence</th>
            <th class="px-2 py-1 font-semibold border">Ult. Pago</th>
            <th class="px-2 py-1 font-semibold border">Desembolso</th>
            <th class="px-2 py-1 font-semibold border">Capital</th>
            <th class="px-2 py-1 font-semibold border">Intereses</th>
            <th class="px-2 py-1 font-semibold border">Gasto</th>
            <th class="px-2 py-1 font-semibold border">Mora</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="px-2 py-1 border">32-0000209</td>
            <td class="px-2 py-1 border">Cancelado</td>
            <td class="px-2 py-1 border">1</td>
            <td class="px-2 py-1 border">SERVICIOS</td>
            <td class="px-2 py-1 border">22 sep 2023</td>
            <td class="px-2 py-1 border">23 dic 2024</td>
            <td class="px-2 py-1 border">22 nov 2024</td>
            <td class="px-2 py-1 border">Q 25,000.00</td>
            <td class="px-2 py-1 border">Q 25,000.00</td>
            <td class="px-2 py-1 border">Q 800</td>
            <td class="px-2 py-1 border">Q 0.00</td>
            <td class="px-2 py-1 border">Q 0.00</td>
          </tr>
          <!-- Más filas si quieres -->
        </tbody>
      </table>
      <div class="h-36"></div>
    </div>
  </div>
</template>
