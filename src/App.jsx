import { VStack, IconButton, useColorMode } from "@chakra-ui/react";
import { Heading } from "@chakra-ui/react";
import { HStack, Button, Input } from "@chakra-ui/react";
import { FaSun, FaMoon } from "react-icons/fa";
import { useEffect, useState } from "react";
import Todo from "./Todo";
import "./index.css";

export default function App() {
  const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
  const [todos, setTodos] = useState([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    async function getTodos() {
      try {
        const res = await fetch(`${backendUrl}/api/todos/`);
        const todos = await res.json();
        setTodos(todos);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    }
    getTodos();
  }, [backendUrl]);

  const createNewTodo = async (e) => {
    e.preventDefault();
    if (content.length > 3) {
      try {
        const res = await fetch(`${backendUrl}/api/todos`, {
          method: "POST",
          body: JSON.stringify({ todo: content }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const newTodo = await res.json();
        setContent("");
        setTodos([...todos, newTodo]);
      } catch (error) {
        console.error("Error creating todo:", error);
      }
    }
  };

  const handleDelete = async (todoId) => {
    try {
      await fetch(`${backendUrl}/api/todos/${todoId}`, {
        method: "DELETE",
      });
      setTodos(todos.filter(todo => todo._id !== todoId));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleUpdate = async (updatedTodo) => {
    try {
      await fetch(`${backendUrl}/api/todos/${updatedTodo._id}`, {
        method: "PUT",
        body: JSON.stringify(updatedTodo),
        headers: {
          "Content-Type": "application/json",
        },
      });
      setTodos(todos.map(todo => (todo._id === updatedTodo._id ? updatedTodo : todo)));
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <VStack p={8}>
      <IconButton
        icon={colorMode === "light" ? <FaSun /> : <FaMoon />}
        isRound="true"
        size="lg"
        alignSelf="flex-end"
        onClick={toggleColorMode}
      />
      <main>
        <Heading mb="4" fontWeight="extrabold" size="3xl" bgGradient="linear(to-r, blue.300, orange.400, purple.200)" bgClip="text">
          Todo Application
        </Heading>
        <form onSubmit={createNewTodo}>
          <HStack mt="8">
            <Input
              variant="filled"
              placeholder="Enter todos..."
              size="auto"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <Button colorScheme="blue" px="8" type="submit">
              Add Todo
            </Button>
          </HStack>
        </form>
        <div>
          {todos.map((todo) => (
            <Todo key={todo._id} todo={todo} onDelete={handleDelete} onUpdate={handleUpdate} />
          ))}
        </div>
      </main>
    </VStack>
  );
}