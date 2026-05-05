<h1>Todo App</h1>

  <p>A straightforward and modern Todo application built with React, TypeScript, and Vite. This app allows you to manage and organize your daily tasks with custom statuses, priorities, and due dates.</p>

  <hr>

  <h2>Getting Started</h2>

  <p>Follow these instructions to get a copy of the project up and running on your local machine for development and testing.</p>

  <h3>Prerequisites</h3>

  <p>Make sure you have the following software installed on your machine:</p>
  <ul>
    <li><a href="https://nodejs.org/">Node.js</a> (v18 or higher recommended)</li>
    <li>npm (comes with Node.js)</li>
  </ul>

  <h3>Installation & Local Setup</h3>

  <ol>
    <li>
      <strong>Clone the repository:</strong>
      <pre><code>git clone https://github.com/JHTgh/Todo_app.git
cd Todo_app</code></pre>
    </li>
    <li>
      <strong>Install dependencies:</strong>
      <pre><code>npm install</code></pre>
    </li>
    <li>
      <strong>Set up the environment variables:</strong>
      <p>Create a <code>.env.local</code> file in the root of your project by copying the example file:</p>
      <pre><code>cp .env.example .env.local</code></pre>
    </li>
    <li>
      <strong>Configure the .env.local file:</strong>
      <p>Open the newly created <code>.env.local</code> file and set your local API URL:</p>
      <pre><code>VITE_API_URL=http://localhost:3000/api</code></pre>
    </li>
    <li>
      <strong>Run the application:</strong>
      <p>Start the development server and the backend API. An SQLite database (<code>todos.db</code>) will be created automatically in your local directory when the app runs.</p>
      <pre><code>npm run dev</code></pre>
      <p><em>The frontend should now be running at <code>http://localhost:5173</code>.</em></p>
    </li>
  </ol>

  <hr>

  <h2>Features</h2>

  <ul>
    <li><strong>Task Management:</strong> Create, toggle, and delete tasks.</li>
    <li><strong>Filtering:</strong> Filter tasks by status (Pending/Completed) and priority (Low/Medium/High).</li>
    <li><strong>Sorting:</strong> Sort tasks by creation date, due date, or priority level.</li>
    <li><strong>TypeScript:</strong> Type-safe components and state management.</li>
  </ul>

  <hr>

  <h2>Technologies Used</h2>

  <ul>
    <li>React</li>
    <li>Vite</li>
    <li>TypeScript</li>
    <li>SQLite</li>
  </ul>

  <img width="802" height="1301" alt="image" src="https://github.com/user-attachments/assets/30864587-18f2-4df1-8615-eca186ce2758" />
