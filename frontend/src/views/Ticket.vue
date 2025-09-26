<template>
  <div v-if="ticket" class="ticket-detail">
    <h1>Compra finalizada</h1>
    <p><strong>Código de ticket:</strong> {{ ticket.code }}</p>
    <p><strong>Fecha y hora:</strong> {{ ticket.purchase_datetime }}</p>
    <p><strong>Total pagado:</strong> ${{ ticket.amount }}</p>
    <p><strong>Comprador:</strong> {{ ticket.purchaser }}</p>

    <router-link to="/products">
      <button>Volver a productos</button>
    </router-link>
  </div>

  <div v-else>
    <p>Cargando ticket...</p>
  </div>
</template>

<script>
export default {
  name: "Ticket",
  data() {
    return {
      ticket: null,
    };
  },
  async mounted() {
    await this.loadTicket();
  },
  methods: {
    async loadTicket() {
      try {
        const tid = this.$route.params.tid;
        const response = await fetch(`/api/tickets/${tid}`, {
          credentials: "include",
        });
        const result = await response.json();

        if (result.success) {
          this.ticket = result.payload;
        } else {
          console.error("Ticket no encontrado");
        }
      } catch (error) {
        console.error("Error al obtener ticket:", error);
      }
    },
  },
};
</script>

<style scoped>
.ticket-detail {
  padding: 20px;
  border: 1px solid #ccc;
  margin-top: 20px;
}
</style>