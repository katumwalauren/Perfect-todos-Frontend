import { useState } from "react";
import { HStack, VStack, Text, IconButton, StackDivider, Spacer, Input } from "@chakra-ui/react";
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

export default function Todo({ todo, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTodo, setEditedTodo] = useState(todo.todo);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const saveEdit = async () => {
    const updatedTodo = { ...todo, todo: editedTodo };
    try {
      await onUpdate(updatedTodo);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving edit:", error);
    }
  };

  const handleInputChange = (event) => {
    setEditedTodo(event.target.value);
  };

  const handleDelete = async () => {
    try {
      await onDelete(todo._id);
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  return (
    <VStack
      divider={<StackDivider />}
      borderColor="pink.500"
      borderWidth="2px"
      p="4"
      borderRadius="lg"
      width="100%"
      height="60px"
      marginTop="20px"
      maxW={{ base: "90vw", sm: "80vw", lg: "50vw", xl: "40vw" }}
      alignItems="stretch"
    >
       <HStack>
      {isEditing ? (
        <Input
          value={editedTodo}
          onChange={handleInputChange}
          autoFocus
          size="auto"
        />
      ) : (
        <Text>{todo.todo}</Text>
      )}
      <Spacer />
      {isEditing ? (
        <IconButton
          icon={<MdEdit />}
          isRound = "true"
          colorScheme="teal"
          onClick={saveEdit}
        />
      ) : (
        <IconButton
          icon={<MdEdit />}
          isRound
          colorScheme="teal"
          onClick={handleEdit}
        />
      )}
      <IconButton
        icon={<FaTrash />}
        isRound="true"
        colorScheme="red"
        onClick={handleDelete} 
      />
      </HStack>
    </VStack>
  );
}
