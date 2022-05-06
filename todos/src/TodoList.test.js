import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import TodoList from './TodoList';

function addTodo(todoList, task = "write test") {
  const taskInput = todoList.getByLabelText("Tasks:");
  fireEvent.change(taskInput, { target: { value: task } });

  const submitButton = todoList.getByText("Add a todo!");
  fireEvent.click(submitButton);
}

it("renders without crashing", function () { 
  render(<TodoList />);
});

it("matches snapshot", function () { 
  const { asFragment } = render(<TodoList />);
  expect(asFragment()).toMatchSnapshot();
});

it("adds a todo", function () { 
  const list = render(<TodoList />);
  addTodo(list);

  // expect form to clear and todo to be visible
  expect(list.getByLabelText("Tasks:")).toHaveValue("");
  expect(list.getByText("write test")).toBeInDocument();
  expect(list.getByText("Edit")).toBeInDocument();
  expect(list.getByText("X")).toBeInDocument();
});

it("edit todo", function () { 
  const list = render(<TodoList />);
  addTodo(list);

  fireEvent.click(list.getAllByText("Edit"));
  const editInput = list.getByDisplayValue("write test");
  fireEvent.change(editInput, { target: { value: 'study' } });
  fireEvent.click(list.getByText("Update!"));

  // expect only edit to display
  expect(list.getByText("study")).toBeInDocument();
  expect(list.queryByText("write test")).not.toBeInDocument();
});

it("deletes", function () { 
  const list = render(<TodoList />);
  addTodo(list);

  fireEvent.click(list.getByText("X"));

  // expect todo to be deleted
  expect(list.queryByText("write test")).not.toBeInDocument();
});
