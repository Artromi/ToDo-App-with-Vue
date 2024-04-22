Vue.createApp({
  data() {
    return {
      todos: [
        // { description: "first todo", id: 1, done: false },
        // { description: "learn anything", id: 2, done: true },
        // { description: "go shopping", id: 3, done: false },
      ],
      filter: "all",
      todoInput: "",
    };
  },
  methods: {
    removeDoneTodos(e) {
      e.preventDefault();
      this.todos.forEach((todo) => {
        if (todo.done) {
          fetch(`http://localhost:4730/todos/${todo.id}`, {
            method: "DELETE",
          })
            .then(() => {
              this.getAllTodos();
            })
            .catch((error) => window.alert(error));
        }
      });
    },
    addNewTodo() {
      let todoValue = this.todoInput;
      if (!todoValue.trim()) {
        window.alert("add todo pls!");
        return;
      }
      if (
        this.todos.findIndex(
          (todo) =>
            todo.description.toLowerCase().trim() ===
            todoValue.toLowerCase().trim()
        ) !== -1
      ) {
        window.alert("todo is already in list!");
      } else {
        fetch("http://localhost:4730/todos", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ description: todoValue, done: false }),
        })
          .then((response) => {
            if (response.ok) {
              this.todoInput.value = "";
            }
          })
          .catch((error) => window.alert(error));
      }
      this.todoInput = "";
      this.getAllTodos();
    },
    getAllTodos() {
      fetch("http://localhost:4730/todos")
        .then((res) => res.json())
        .then((todos) => {
          this.todos = todos;
        });
    },
    changeDoneState(todo) {
      fetch("http://localhost:4730/todos/" + todo.id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done: todo.done }),
      }).then(this.getAllTodos());
    },
  },
  computed: {
    filteredTodos() {
      if (this.filter === "all") {
        return this.todos;
      }
      if (this.filter === "open") {
        return this.todos.filter((todo) => {
          return todo.done === false;
        });
      }
      if (this.filter === "done") {
        return this.todos.filter((todo) => {
          return todo.done === true;
        });
      }
    },
  },
  created() {
    this.getAllTodos();
  },
}).mount("#app");
