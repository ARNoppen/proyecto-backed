const { createApp } = Vue;

createApp({
  data() {
    return {
      form: {
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        age: ''
      },
      invalidFields: {
        first_name: false,
        last_name: false,
        email: false,
        password: false,
        age: false
      },
    errorMsg: ''
    };
  },
  methods: {
    async register() {
        // validamos campos individualmente
        this.invalidFields.first_name = !this.form.first_name;
        this.invalidFields.last_name = !this.form.last_name;
        this.invalidFields.email = !this.form.email;
        this.invalidFields.password = !this.form.password;
        this.invalidFields.age = !this.form.age;
        
        if (
          this.invalidFields.first_name ||
          this.invalidFields.email ||
          this.invalidFields.password ||
          this.invalidFields.age
        ) {
          this.errorMsg = "Todos los campos marcados son obligatorios.";
          return;
        }
        
        this.errorMsg = ""; // limpiar el mensaje de error al intentar registrar

      try {
        const response = await fetch("/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this.form) 
        });

        const result = await response.json();

        if (result.success) {
          Swal.fire("Registrado", result.message, "success");
          setTimeout(() => {
            window.location.href = "/login";
          }, 3000);
        } else {
          Swal.fire("Error", result.message, "error");
        }
      } catch (error) {
        console.error("Error al registrar:", error);
        Swal.fire("Error", "Ocurrió un error inesperado.", "error");
      }
    }
  }
}).mount("#register-app");