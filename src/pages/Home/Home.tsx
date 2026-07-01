import { Link } from "react-router";
import { ChevronRight } from "lucide-react";

const Home = () => {
  return (
    <div className="flex flex-col gap-4 p-2">
      <h4 className="max-w-xl text-center mx-auto">
        Kickstart your project with Vite, React, TypeScript, TailwindCSS, and
        ShadCN UI. This template is designed to help you quickly set up a modern
        web application with a clean and responsive user interface.
      </h4>
      <p className="max-w-xl text-center mx-auto">
        Navigate through available components to see the template in action.
      </p>

      <div className="grid grid-cols-4 gap-4">
        <Link
          to="/components"
          className="flex items-center justify-between gap-2 rounded-lg border py-2 px-4 hover:bg-accent transition"
        >
          Components
          <ChevronRight size={20} />
        </Link>
        <Link
          to="/form"
          className="flex items-center justify-between gap-2 rounded-lg border py-2 px-4 hover:bg-accent transition"
        >
          Form
          <ChevronRight size={20} />
        </Link>
        <Link
          to="/charts"
          className="flex items-center justify-between gap-2 rounded-lg border py-2 px-4 hover:bg-accent transition"
        >
          Charts
          <ChevronRight size={20} />
        </Link>
        <Link
          to="/tables"
          className="flex items-center justify-between gap-2 rounded-lg border py-2 px-4 hover:bg-accent transition"
        >
          Tables
          <ChevronRight size={20} />
        </Link>
      </div>
    </div>
  );
};

export default Home;
