import { TodoItem } from "./todoItem.js";

type ItemCounts = {
    total: number,
    incomplete: number
}

export class TodoCollection {
    private nextId: number = 1;
    private itemMap = new Map<number, TodoItem>();
    
    constructor(public userName: string, todoItems: TodoItem[] = []) {
        todoItems.forEach(item => this.itemMap.set(item.id, item));
    }

    getTodoById(id: number) : TodoItem {
        return this.itemMap.get(id);
    }

    addTodo(task: string) : number {
        while(this.getTodoById(this.nextId)) {
            this.nextId++;
            console.log(`updating nextId: ${this.nextId}`);
        }
        this.itemMap.set(this.nextId, new TodoItem(this.nextId, task));
        return this.nextId;
    }

    getTodoItems(includeComplete: boolean) : TodoItem[] {
        return [...this.itemMap.values()].filter(item => includeComplete || !item.complete);
    }

    // TODO: set doc string
    /* markComplete sets the complete property to the given status */
    markComplete(id: number, complete: boolean) {
        const todoItem = this.getTodoById(id);
        if (todoItem) {
            todoItem.complete = complete;
        }
    }

    removeComplete() {
        this.itemMap.forEach(item => {
            if (item.complete) {
                this.itemMap.delete(item.id);
            }
        })
    }

    getItemCounts() : ItemCounts {
        return {
            total: this.itemMap.size,
            incomplete: this.getTodoItems(false).length
        };
    }
}
