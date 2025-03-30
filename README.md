# Taskly

Taskly is a simple task management application built using **Angular** and **AG Grid** for managing and displaying tasks efficiently.

## Features

- **Task Management**: Add, edit, and filter tasks.
- **Kanban Board**: Visualize tasks in a Kanban layout, allowing for drag-and-drop task management across different statuses.
- **Developer Filtering**: Filter tasks by assigned developers.
- **AG Grid Integration**: Editable and customizable table columns.
- **Inline Editing in Table**: Directly edit task details within the AG Grid table cells.
- **Material UI**: Uses Angular Material for UI components.
- **Search Functionality**: Quickly find tasks using the search bar.

## Tech Stack

- **Frontend**: Angular, AG Grid, Angular Material, TailwindCSS
- **Backend**: Mock API (https://mocki.io/v1/e5f26750-17e9-487b-93fe-2d1ff07c3da8)

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/f-chilmi/taskly.git
   cd taskly
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Start the development server:

   ```sh
   npm start
   ```

4. Open your browser and visit `http://localhost:4200`.

## Configuration

- API URL: Update `task.service.ts` if needed to change the API endpoint.
- Static Data: Modify `static-data.service.ts` to adjust dropdown options.

## Usage

- **Adding a Task**: Click the "New Task" button and fill in the form.
- **Editing a Task**: Click on a cell in the grid to edit values.
- **Editing a Task (Kanban)**: Drag and drop tasks between Kanban columns to update their status.
- **Filtering**: Use the search box or developer filters to find specific tasks.
- **Kanban View**: Switch to the Kanban view to visualize tasks in a Kanban board.

## Deployment

To deploy on Vercel:

```sh
npm run build
vercel deploy
```

## Contributing

Feel free to submit pull requests or open issues for improvements.

## License

MIT License
