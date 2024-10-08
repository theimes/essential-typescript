import { TodoItem } from "./todoItem.js";
import { TodoCollection } from "./todoCollection.js";
//import inquirer from "inquirer";

import { select } from '@inquirer/prompts';
import { input } from '@inquirer/prompts';
import { checkbox, Separator } from '@inquirer/prompts';

let todos = [
    new TodoItem(1, "Buy Flowers"),
    new TodoItem(2, "Get Shoes", true),
    new TodoItem(3, "Collect Tickets"),
    new TodoItem(4, "Call Anja", true)];

let collection = new TodoCollection("Thorsten", todos);
let showCompleted = true;

const displayTodoList = () => { 
    console.log(`${collection.userName}'s Todo List `
        + `(${collection.getItemCounts().incomplete} items to do)`);
    collection.getTodoItems(showCompleted).forEach(item => item.printDetails());
}

const promptAdd = () => {
    console.clear();
    input({
        message: "Enter task",
    }).then( answers => {
        console.log(answers);
        if (answers !== "") {
            collection.addTodo(answers);
        }
        promptUser();
    })
}

const promptComplete = () => {
    console.clear();
    checkbox({
        message: "Mark Tasks Complete",
        choices: collection.getTodoItems(false).map(item => ({
            name: item.task,
            value: item.id,
            checked: item.complete
        }))
    }).then(answers => {
        let completedTasks = answers as number[];
        //if (completedTasks.length > 0) {
        collection.getTodoItems(false).forEach(item => 
            collection.markComplete(item.id, completedTasks.find(id => id === item.id) != undefined));
        //}
        promptUser();
    })
}

enum Commands {
    Add = "Add New Task",
    Complete = "Complete Task",
    Toggle = "Show/Hide Completed",
    Purge = "Remove Completed Tasks",
    Quit = "Quit"
}

function promptUser(): void {
    console.clear();
    displayTodoList();
    select({
        message: "Choose option",
        choices: Object.values(Commands)
    }).then(answers => {
        switch (answers) {
            case Commands.Add:
                promptAdd();
                break;
            case Commands.Complete:
                if (collection.getItemCounts().incomplete > 0) {
                    promptComplete();
                } else {
                    promptUser();
                }
                break;
            case Commands.Toggle:
                    showCompleted = !showCompleted;
                    promptUser();
                    break;
            case Commands.Purge:
                collection.removeComplete();
                promptUser();
                break;
            case Commands.Quit:
                break;
            default:
                promptUser();
                break;
         }
    })
}

promptUser();
