# Taskly

Taskly is a simple task management application built using **Angular** and **AG Grid** for managing and displaying tasks efficiently.

## Features

- **Task Management**: Add, edit, and filter tasks.
<!-- - **Infinite Scrolling**: Load more tasks as you scroll down. -->
- **Developer Filtering**: Filter tasks by assigned developers.
- **AG Grid Integration**: Editable and customizable table columns.
- **Material UI**: Uses Angular Material for UI components.

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
- **Filtering**: Use the search box or developer filters to find specific tasks.
- **Infinite Scrolling**: Scroll down to load more tasks.

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
