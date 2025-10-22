<template>
  <div v-if="ticket" class="ticket-detail">
    <h1>Compra finalizada</h1>

    <div class="ticket-info">
      <p><strong>Código de ticket:</strong> {{ ticket.code }}</p>
      <p><strong>Fecha y hora:</strong> {{ ticket.purchase_datetime }}</p>
      <p><strong>Total pagado:</strong> ${{ ticket.amount }}</p>
      <p><strong>Comprador:</strong> {{ ticket.purchaser }}</p>
    </div>

    <div class="actions">
      <router-link class="btn primary" to="/">🏠 Volver al Home</router-link>
      <router-link class="btn primary" to="/products">🛍️ Volver a productos</router-link>
    </div>
  </div>

  <div v-else class="loading">
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
  max-width: 600px;
  margin: 40px auto;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 6px 16px rgba(0,0,0,0.08);
  text-align: center;
}

.ticket-detail h1 {
  margin-bottom: 20px;
  font-size: 1.8rem;
  color: #111827;
}

.ticket-info {
  text-align: left;
  margin-bottom: 20px;
}

.ticket-info p {
  margin: 8px 0;
  font-size: 1rem;
  color: #374151;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 16px;
}

/* Botones iguales al resto */
.btn {
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  color: #111827;
  padding: 10px 14px;
  border-radius: 8px;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
}
.btn:hover { filter: brightness(1.03); }
.btn.primary { background: #2563eb; border-color: #2563eb; color: #fff; }

.loading {
  text-align: center;
  margin-top: 40px;
  color: #6b7280;
}
</style>